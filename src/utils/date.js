export const MONTHS_UZ = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

export const WEEKDAYS_SHORT_UZ = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
export const WEEKDAYS_UZ = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
export const WEEKDAYS_FULL_UZ = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

// The salon is in Tashkent, but a visitor's browser (or a tester's device) can be set to
// any timezone. "Today" and "now" for booking/slot purposes must always reflect Tashkent
// wall-clock time, never the viewer's local clock — otherwise slot cutoffs and the "Bugun"
// day chip drift depending on where the browser thinks it is. We read the current instant
// through Intl's IANA tz database rather than a hardcoded UTC+5 offset so this stays correct
// even if the offset rules ever change.
const TASHKENT_TZ = 'Asia/Tashkent';

function tashkentParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TASHKENT_TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month) - 1,
    date: Number(parts.day),
    hours: Number(parts.hour),
    minutes: Number(parts.minute),
  };
}

export function getTashkentMinutesNow() {
  const { hours, minutes } = tashkentParts();
  return hours * 60 + minutes;
}

function toIso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildDayRange(startOffset, endOffset) {
  const { year, month, date } = tashkentParts();
  const days = [];
  for (let i = startOffset; i <= endOffset; i++) {
    const d = new Date(year, month, date + i);
    days.push({
      date: toIso(d),
      dayNum: d.getDate(),
      monthName: MONTHS_UZ[d.getMonth()],
      weekdayShort: WEEKDAYS_SHORT_UZ[d.getDay()],
      isToday: i === 0,
    });
  }
  return days;
}

export function getNext7Days() {
  return buildDayRange(0, 6);
}

export function getDayRange(startOffset, endOffset) {
  return buildDayRange(startOffset, endOffset);
}

export function formatDateUzShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  return `${d.getDate()}-${MONTHS_UZ[d.getMonth()]}, ${WEEKDAYS_UZ[d.getDay()]}`;
}

export function todayIso() {
  const { year, month, date } = tashkentParts();
  return toIso(new Date(year, month, date));
}
