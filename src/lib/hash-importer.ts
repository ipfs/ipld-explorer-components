/* global globalThis */
import { keccak256 } from 'js-sha3'
import { type Hasher, from } from 'multiformats/hashes/hasher'
import * as sha2 from 'multiformats/hashes/sha2'

type SupportedHashers = typeof sha2.sha256 | typeof sha2.sha512 | Hasher<'keccak-256', 27> | Hasher<'sha1', 17>

export async function getHashersForCodes (...codes: number[]): Promise<SupportedHashers[]> {
  return Promise.all(codes.map(getHasherForCode))
}

export default async function getHasherForCode (code: number): Promise<SupportedHashers> {
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
          const crypto = globalThis.crypto ?? (await import('crypto')).webcrypto
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
