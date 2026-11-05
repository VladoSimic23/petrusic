export function phoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export function messagingNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("00") ? digits.slice(2) : digits;
}
