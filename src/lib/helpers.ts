import { type Helia } from '@helia/interface'
import { CID, type MultihashDigest } from 'multiformats'
import { sha256 } from 'multiformats/hashes/sha2'

export function ensureLeadingSlash (str: string): string {
  if (str.startsWith('/')) return str
  return `/${str}`
}

export interface DigestFn {
  (data: Uint8Array): Promise<MultihashDigest<number>>
}

export async function addDagNodeToHelia <T> (helia: Helia, codec: { encode: (n: T) => Uint8Array, code: number }, node: T, digestFn?: DigestFn): Promise<CID> {
  const encodedNode = codec.encode(node)
  const hash = digestFn != null ? await digestFn(encodedNode) : await sha256.digest(encodedNode)
  const cid = CID.createV1(codec.code, hash)

  return helia.blockstore.put(cid, encodedNode)
}
