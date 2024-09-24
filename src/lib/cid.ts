import * as dagCbor from '@ipld/dag-cbor'
import * as dagJson from '@ipld/dag-json'
import * as dagPb from '@ipld/dag-pb'
import { CID, type MultibaseDecoder } from 'multiformats/cid'

/**
 * Converts a value to a CID or returns null if it cannot be converted.
 */
export function toCidOrNull <T extends string> (value: any, base?: MultibaseDecoder<T> | undefined): CID | null {
  if (value == null) return null
  try {
    return CID.asCID(value) ?? CID.parse(value, base)
  } catch (err) {
    return null
  }
}

/**
 * This function is deprecated, use `getCodeOrNull` instead.
 *
 * `cid.codec` is deprecated, use integer "code" property instead
 *
 * @deprecated
 */
export function getCodecOrNull (value: any): string | null {
  const cid = toCidOrNull(value)

  if (cid == null) return null
  switch (cid.code) {
    case dagCbor.code:
      return dagCbor.name
    case dagJson.code:
      return dagJson.name
    case dagPb.code:
      return dagPb.name
    default:
      return null
  }
}

export function getCodeOrNull (value: string): number | null {
  const cid = toCidOrNull(value)
  return (cid != null) ? cid.code : null
}

export function toCidStrOrNull (value: string | CID): string | null {
  const cid = toCidOrNull(value)
  return (cid != null) ? cid.toString() : null
}
