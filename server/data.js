export const services = [
  { id: 'soch-turmagi', name: 'Soch turmagi', price: 150000 },
  { id: 'manikyur', name: 'Manikyur', price: 120000 },
  { id: 'pardoz', name: 'Pardoz (makiyaj)', price: 250000 },
  { id: 'soch-boyash', name: "Soch bo'yash", price: 400000 },
  { id: 'qosh-korreksiyasi', name: 'Qosh korreksiyasi', price: 80000 },
];

export const masters = [
  { id: 'nilufar', name: 'Nilufar', services: ['soch-turmagi', 'soch-boyash'], rating: 4.9 },
  { id: 'madina', name: 'Madina', services: ['manikyur'], rating: 4.9 },
  { id: 'sevara', name: 'Sevara', services: ['pardoz', 'qosh-korreksiyasi'], rating: 4.9 },
];

export const workingHours = { start: 9, end: 20 };

export function getTimeSlots() {
  const slots = [];
  for (let h = workingHours.start; h < workingHours.end; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
}
