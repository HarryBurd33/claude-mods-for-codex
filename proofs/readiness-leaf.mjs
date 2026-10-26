// Fixed synthetic group-cleanup leaf. No IO, commands, network or model work.
process.on('SIGTERM', () => {});
setInterval(() => {}, 1000);
