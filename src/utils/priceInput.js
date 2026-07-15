export function formatPriceInput(value) {
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function parsePriceInput(value) {
  return Number(String(value).replace(/\D/g, '')) || 0;
}
