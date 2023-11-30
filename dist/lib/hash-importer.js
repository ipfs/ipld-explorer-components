/* global globalThis */
import * as sha3 from '@multiformats/sha3';
import { from } from 'multiformats/hashes/hasher';
import * as sha2 from 'multiformats/hashes/sha2';

// #WhenAddingNewHasher

export async function getHashersForCodes(code) {
  for (var _len = arguments.length, codes = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    codes[_key - 1] = arguments[_key];
  }
  return Promise.all(codes.map(getHasherForCode));
}

/**
 * Helper function to prevent `this` from being lost when calling `encode` and `digest` on a hasher.
 */
function getBoundHasher(hasher) {
  return {
    ...hasher,
    encode: hasher.encode.bind(hasher),
    digest: hasher.digest.bind(hasher)
  };
}
export async function getHasherForCode(code) {
  // #WhenAddingNewHasher
  switch (code) {
    case sha2.sha256.code:
      return getBoundHasher(sha2.sha256);
    case sha2.sha512.code:
      return getBoundHasher(sha2.sha512);
    case 17:
      // git hasher uses sha1. see ipld-git/src/util.js
      return getBoundHasher(from({
        name: 'sha1',
        code,
        encode: async data => {
          const crypto = globalThis.crypto ?? (await import('crypto')).webcrypto;
          const hashBuffer = await crypto.subtle.digest('SHA-1', data);
          return new Uint8Array(hashBuffer);
        }
      }));
    case sha3.sha3512.code:
      // sha3-512
      return getBoundHasher(sha3.sha3512);
    case sha3.keccak256.code:
      // keccak-256
      return getBoundHasher(sha3.keccak256);
    case 30:
      return getBoundHasher(from({
        name: 'blake3',
        code,
        encode: async data => {
          const {
            digest
          } = await import('blake3-multihash');
          return (await digest(data)).digest;
        }
      }));
    default:
      throw new Error(`unknown multihasher code '${code}'`);
  }
}