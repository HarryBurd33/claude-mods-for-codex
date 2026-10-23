// Local JSON-RPC transport only. No network listener, sampling, or model calls.
export function runMcpServer(handle, { input = process.stdin, output = process.stdout, diagnostic = process.stderr } = {}) {
  const MAX_MESSAGE_BYTES = 1048576, MAX_OUTPUT_MESSAGES = 32, MAX_OUTPUT_BYTES = 2 * MAX_MESSAGE_BYTES;
  const active = new Map(), outbound = new Map(), outputQueue = [];
  let buffer = '', queuedBytes = 0, outputBytes = 0, writing, nextId = 1, stopped = false, ended = false;
  function stop() {
    if (stopped) return;
    stopped = true;
    for (const controller of active.values()) controller.abort();
    for (const pending of outbound.values()) pending.reject(new Error('Host disconnected'));
    outbound.clear();
    if (writing) { clearTimeout(writing.timer); writing.reject(new Error('Transport closed')); writing = undefined; }
    for (const entry of outputQueue.splice(0)) entry.reject(new Error('Transport closed'));
    outputBytes = 0;
    input.pause();
  }
  function fail() {
    if (stopped) return;
    diagnostic.write('claude-mods: transport unavailable\n');
    stop(); process.exitCode = 1; input.destroy();
  }
  function finishIfEnded() {
    if (ended && active.size === 0 && outbound.size === 0 && !writing && outputQueue.length === 0) stop();
  }
  function flushOutput() {
    if (stopped || writing || outputQueue.length === 0) return;
    const entry = outputQueue.shift(); writing = entry;
    function finish(error) {
      // A late write callback after stop must not restart output or change bounds.
      if (writing !== entry || stopped) return;
      clearTimeout(entry.timer); writing = undefined; outputBytes -= entry.bytes;
      if (error) { entry.reject(new Error('Output unavailable')); fail(); return; }
      entry.resolve(); flushOutput(); finishIfEnded();
    }
    entry.timer = setTimeout(() => finish(new Error('Output timeout')), 5000);
    try { output.write(entry.line, finish); } catch { finish(new Error('Output unavailable')); }
  }
  function send(message) {
    if (stopped) return Promise.reject(new Error('Transport closed'));
    let line;
    try { line = JSON.stringify(message) + '\n'; } catch { return Promise.reject(new Error('Invalid response')); }
    const bytes = Buffer.byteLength(line);
    // Every response, parse error and notification uses this one bounded queue.
    // Waiting for the write callback prevents accumulating writes on a slow host.
    if (bytes > MAX_MESSAGE_BYTES || outputQueue.length + (writing ? 1 : 0) >= MAX_OUTPUT_MESSAGES || outputBytes + bytes > MAX_OUTPUT_BYTES) {
      fail(); return Promise.reject(new Error('Output limit'));
    }
    return new Promise((resolve, reject) => {
      outputBytes += bytes;
      outputQueue.push({ line, bytes, resolve, reject }); flushOutput();
    });
  }
  async function requestHost(method, params, { signal, timeoutMs = 30000 } = {}) {
    if (stopped || ended || method !== 'elicitation/create' || outbound.size >= 1 || signal?.aborted) throw new Error('Host request unavailable');
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) throw new Error('Invalid host request bound');
    const id = `mods-server:${nextId++}`;
    return new Promise((resolve, reject) => {
      let timer;
      const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort); outbound.delete(id); };
      const cancel = reason => {
        if (!outbound.has(id)) return;
        cleanup(); reject(new Error(reason));
        if (!stopped) void send({ jsonrpc: '2.0', method: 'notifications/cancelled', params: { requestId: id, reason } }).catch(fail);
      };
      const abort = () => cancel('Host request cancelled');
      timer = setTimeout(() => cancel('Host request timed out'), timeoutMs);
      signal?.addEventListener('abort', abort, { once: true });
      outbound.set(id, {
        resolve: value => { cleanup(); resolve(value); },
        reject: error => { cleanup(); reject(error); },
      });
      send({ jsonrpc: '2.0', id, method, params }).catch(error => { cleanup(); reject(error); });
    });
  }
  function receive(line) {
    let message;
    try { message = JSON.parse(line); } catch { void send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Invalid JSON' } }).catch(fail); return; }
    const validId = id => (typeof id === 'string' && id.length <= 256) || Number.isSafeInteger(id);
    if (!message || Array.isArray(message) || message.jsonrpc !== '2.0') { void send({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid request' } }).catch(fail); return; }
    if (message.method === undefined) {
      const pending = outbound.get(message.id);
      if (pending) {
        const result = Object.hasOwn(message, 'result'), error = Object.hasOwn(message, 'error');
        error || !result ? pending.reject(new Error('Host rejected request')) : pending.resolve(message.result);
      }
      return;
    }
    if (typeof message.method !== 'string' || (message.id !== undefined && !validId(message.id))) { void send({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid request' } }).catch(fail); return; }
    if (message.id === undefined) {
      if (message.method === 'notifications/cancelled') active.get(message.params?.requestId)?.abort();
      return;
    }
    if (active.has(message.id) || active.size >= 8) { fail(); return; }
    const controller = new AbortController(), bytes = Buffer.byteLength(line);
    if ((queuedBytes += bytes) > 2 * MAX_MESSAGE_BYTES) { fail(); return; }
    active.set(message.id, controller);
    Promise.resolve().then(() => {
      if (message.params !== undefined && (!message.params || typeof message.params !== 'object' || Array.isArray(message.params))) throw new Error('Invalid parameters');
      return handle(message, { signal: controller.signal, requestHost });
    }).then(result => stopped ? undefined : send({ jsonrpc: '2.0', id: message.id, result }), () => stopped ? undefined : send({ jsonrpc: '2.0', id: message.id, error: { code: -32602, message: 'Invalid or unavailable request' } }))
      .catch(fail).finally(() => { active.delete(message.id); queuedBytes -= bytes; finishIfEnded(); });
  }
  input.setEncoding('utf8');
  input.on('data', chunk => {
    if (stopped) return;
    buffer += chunk;
    if (Buffer.byteLength(buffer) > MAX_MESSAGE_BYTES) return fail();
    let end;
    while ((end = buffer.indexOf('\n')) >= 0 && !stopped) {
      const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
      if (line.trim()) receive(line);
    }
  });
  input.on('end', () => {
    if (stopped) return;
    ended = true;
    // EOF prevents new host requests and cancels waits. Drain already accepted
    // replies through the same bounded output queue before stopping.
    for (const controller of active.values()) controller.abort();
    for (const pending of outbound.values()) pending.reject(new Error('Host disconnected'));
    if (buffer.trim()) fail(); else finishIfEnded();
  });
  input.on('error', fail); output.on('error', fail);
  return { stop };
}
