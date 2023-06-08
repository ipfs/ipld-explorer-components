import * as dagCbor from '@ipld/dag-cbor'
import * as dagJson from '@ipld/dag-json'
import * as dagPb from '@ipld/dag-pb'
import { CID } from 'multiformats'

/**
 * @template {string} Prefix
 * @param {any} value
 * @param {import('multiformats/bases/interface').MultibaseDecoder<Prefix>} [base]
 * @returns
 */
export function toCidOrNull (value, base) {
  if (!value) return null
  try {
    return CID.asCID(value) || CID.parse(value, base)
  } catch (err) {
    return null
  }
}

/**
 * This function is deprecated, use `getCodeOrNull` instead.
 *
 * `cid.codec` is deprecated, use integer "code" property instead
 *
 * @param {any} value
 * @returns {string}
 * @deprecated
 */
export function getCodecOrNull (value) {
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

export function getCodeOrNull (value) {
  const cid = toCidOrNull(value)
  return cid ? cid.code : null
}

export function toCidStrOrNull (value) {
  const cid = toCidOrNull(value)
  return cid ? cid.toString() : null
}
