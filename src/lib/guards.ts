import type { PBLink, PBNode } from '@ipld/dag-pb'

export function isNotNullish<T> (value: T): value is NonNullable<T> {
  return value != null
}

export function isPBNode (value: unknown): value is PBNode {
  return isNotNullish(value) && typeof value === 'object' && (value as PBNode).Data != null && (value as PBNode).Links != null
}

export function isPBLink (value: unknown): value is PBLink {
  return isNotNullish(value) && typeof value === 'object' && (value as PBLink).Hash != null
}
