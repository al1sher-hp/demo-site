export function formatPhoneInput(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  let result = '+998';
  if (digits.length > 0) result += ` ${digits.slice(0, 2)}`;
  if (digits.length > 2) result += ` ${digits.slice(2, 5)}`;
  if (digits.length > 5) result += ` ${digits.slice(5, 7)}`;
  if (digits.length > 7) result += ` ${digits.slice(7, 9)}`;
  return result;
}

export function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('998');
}
