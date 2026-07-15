import { WEEKDAYS_SHORT_UZ } from './date.js';

const WEEKDAY_MON_FIRST = [1, 2, 3, 4, 5, 6, 0];

export function workdaysSummary(hours) {
  const working = WEEKDAY_MON_FIRST
    .map((wd) => hours.find((h) => h.weekday === wd))
    .filter((h) => h && !h.isDayOff);

  if (working.length === 0) return "Ish kunlari yo'q";

  const sameHours = working.every(
    (h) => h.startTime === working[0].startTime && h.endTime === working[0].endTime,
  );
  const hoursLabel = sameHours ? `${working[0].startTime}–${working[0].endTime}` : 'turli vaqt';

  if (working.length === 7) return `Har kuni, ${hoursLabel}`;

  const workingSet = new Set(working.map((h) => h.weekday));
  const runs = [];
  let run = [];
  for (const wd of WEEKDAY_MON_FIRST) {
    if (workingSet.has(wd)) {
      run.push(wd);
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  }
  if (run.length) runs.push(run);

  const dayLabel = runs
    .map((r) =>
      r.length > 1
        ? `${WEEKDAYS_SHORT_UZ[r[0]]}–${WEEKDAYS_SHORT_UZ[r[r.length - 1]]}`
        : WEEKDAYS_SHORT_UZ[r[0]],
    )
    .join(', ');

  return `${dayLabel}, ${hoursLabel}`;
}
