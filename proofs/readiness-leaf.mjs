// Fixed synthetic group-cleanup leaf. No IO, commands, network or model work.
if (process.argv[2] === 'bounded-silent') {
  // Fixed fixture self-exit; no inherited pipes and no arbitrary lifetime option.
  setTimeout(() => process.exit(0), 1000);
} else {
  process.on('SIGTERM', () => {});
  setInterval(() => {}, 1000);
}
