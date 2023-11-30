export function isNotNullish(value) {
  return value != null;
}
export function isPBNode(value) {
  return isNotNullish(value) && typeof value === 'object' && value.Data != null && value.Links != null;
}
export function isPBLink(value) {
  return isNotNullish(value) && typeof value === 'object' && value.Hash != null;
}