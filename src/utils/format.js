export function formatPrice(n) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}
