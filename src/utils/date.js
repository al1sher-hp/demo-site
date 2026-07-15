export const MONTHS_UZ = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

export const WEEKDAYS_SHORT_UZ = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
export const WEEKDAYS_UZ = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
export const WEEKDAYS_FULL_UZ = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

function toIso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildDayRange(startOffset, endOffset) {
  const days = [];
  const today = new Date();
  for (let i = startOffset; i <= endOffset; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
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
  return toIso(new Date());
}
