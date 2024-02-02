/* global globalThis */
import * as sha3 from '@multiformats/sha3'
import { createBLAKE3 } from 'hash-wasm'
import { type Hasher, from } from 'multiformats/hashes/hasher'
import * as sha2 from 'multiformats/hashes/sha2'

// #WhenAddingNewHasher
export type SupportedHashers = typeof sha2.sha256 |
  typeof sha2.sha512 |
  Hasher<'keccak-256', 27> |
  Hasher<'sha1', 17> |
  Hasher<'blake2b-512', 45632> |
  Hasher<'sha3-512', 20> |
  Hasher<'blake3', 30>

export async function getHashersForCodes (code: number, ...codes: number[]): Promise<SupportedHashers[]> {
  return Promise.all(codes.map(getHasherForCode))
}

/**
 * Helper function to prevent `this` from being lost when calling `encode` and `digest` on a hasher.
 */
function getBoundHasher <T extends SupportedHashers> (hasher: T): T {
  return {
    ...hasher,
    encode: hasher.encode.bind(hasher),
    digest: hasher.digest.bind(hasher)
  }
}

export async function getHasherForCode (code: number): Promise<SupportedHashers> {
  // #WhenAddingNewHasher
  switch (code) {
    case sha2.sha256.code:
      return getBoundHasher(sha2.sha256)
    case sha2.sha512.code:
      return getBoundHasher(sha2.sha512)
    case 17:
      // git hasher uses sha1. see ipld-git/src/util.js
      return getBoundHasher(from({
        name: 'sha1',
        code,
        encode: async (data: Uint8Array): Promise<Uint8Array> => {
          const crypto = globalThis.crypto ?? (await import('crypto')).webcrypto
          const hashBuffer = await crypto.subtle.digest('SHA-1', data)
          return new Uint8Array(hashBuffer)
        }
      }))
    case sha3.sha3512.code: // sha3-512
      return getBoundHasher(sha3.sha3512)
    case sha3.keccak256.code: // keccak-256
      return getBoundHasher(sha3.keccak256)
    case 30:
      return getBoundHasher(from({
        name: 'blake3',
        code,
        encode: async (data: Uint8Array): Promise<Uint8Array> => {
          const blake3Hasher = await createBLAKE3()
          blake3Hasher.init()
          blake3Hasher.update(data)
          return blake3Hasher.digest('binary')
        }
      }))
    default:
      throw new Error(`unknown multihasher code '${code}'`)
  }
}
