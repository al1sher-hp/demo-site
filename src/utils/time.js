export const TIME_OPTIONS = (() => {
  const opts = [];
  for (let h = 6; h <= 23; h++) {
    opts.push(`${String(h).padStart(2, '0')}:00`);
    opts.push(`${String(h).padStart(2, '0')}:30`);
  }
  return opts;
})();
