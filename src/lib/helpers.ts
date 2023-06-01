
export function ensureLeadingSlash (str: string): string {
  if (str.startsWith('/')) return str
  return `/${str}`
}
