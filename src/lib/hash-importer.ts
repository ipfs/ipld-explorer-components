import * as sha2 from 'multiformats/hashes/sha2'
export default async function getHasherForCode (code: number) {
  switch(code) {
    case sha2.sha256.code:
      return sha2.sha256
    case sha2.sha512.code:
      return sha2.sha512
    default:
      throw new Error(`unknown multihasher code '${code}'`)
  }
}
