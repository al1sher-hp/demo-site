export const SEED_SERVICES = [
  { id: 'soch-turmagi', name: 'Soch turmagi', price: 150000, durationMin: 60 },
  { id: 'manikyur', name: 'Manikyur', price: 120000, durationMin: 60 },
  { id: 'pardoz', name: 'Pardoz (makiyaj)', price: 250000, durationMin: 90 },
  { id: 'soch-boyash', name: "Soch bo'yash", price: 400000, durationMin: 120 },
  { id: 'qosh-korreksiyasi', name: 'Qosh korreksiyasi', price: 80000, durationMin: 30 },
];

export const SEED_MASTERS = [
  { id: 'nilufar', name: 'Nilufar', services: ['soch-turmagi', 'soch-boyash'], rating: 4.9 },
  { id: 'madina', name: 'Madina', services: ['manikyur'], rating: 4.9 },
  { id: 'sevara', name: 'Sevara', services: ['pardoz', 'qosh-korreksiyasi'], rating: 4.9 },
];

export const SEED_WORKING_HOURS = { start: '09:00', end: '20:00' };
