export function generateSlots(startTime, endTime) {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const end = eh * 60 + em;

  const slots = [];
  let cursor = sh * 60 + sm;
  while (cursor + 60 <= end) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    cursor += 60;
  }
  return slots;
}
