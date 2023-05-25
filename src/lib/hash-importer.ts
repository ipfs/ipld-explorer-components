/* global globalThis */
import * as sha2 from 'multiformats/hashes/sha2'
import { from } from 'multiformats/hashes/hasher'
import { keccak256 } from 'js-sha3'

export default async function getHasherForCode (code: number) {
  switch (code) {
    case sha2.sha256.code:
      return sha2.sha256
    case sha2.sha512.code:
      return sha2.sha512
    case 17:
      // git hasher uses sha1. see ipld-git/src/util.js
      return from({
        name: 'sha1',
        code,
        encode: async (data: Uint8Array) => {
          const crypto = globalThis.crypto || (await import('crypto')).webcrypto
          const hashBuffer = await crypto.subtle.digest('SHA-1', data)
          return new Uint8Array(hashBuffer)
        }
      })
    case 27: // keccak-256
      return from({
        name: 'keccak-256',
        code,
        encode: async (data: Uint8Array) => {
          return new Uint8Array(keccak256.arrayBuffer(data))
        }
      })

    default:
      throw new Error(`unknown multihasher code '${code}'`)
  }
}
