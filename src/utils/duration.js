export const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

export function formatDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} daqiqa`;
  if (m === 0) return `${h} soat`;
  return `${h} soat ${m} daqiqa`;
}
