export function isEmpty(value: unknown) {
  return value === undefined || value === null || value === '';
}

export function isValidNumber(value: unknown) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isInvalid(field: unknown) {
  return field === undefined || field === null || field === '' || (typeof field === 'number' && Number.isNaN(field));
}
