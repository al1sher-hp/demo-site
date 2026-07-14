const MONTHS_UZ = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

const WEEKDAYS_UZ = [
  'yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba',
];

export function formatDateUz(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDate();
  const month = MONTHS_UZ[d.getMonth()];
  const weekday = WEEKDAYS_UZ[d.getDay()];
  return `${day}-${month}, ${weekday}`;
}

export function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
