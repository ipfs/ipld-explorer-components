import { type Helia } from '@helia/interface'
import { CID } from 'multiformats'
import codecImporter from './codec-importer.js'
import { getHasherForCode } from './hash-importer.js'

export function ensureLeadingSlash (str: string): string {
  if (str.startsWith('/')) return str
  return `/${str}`
}

export async function addDagNodeToHelia <T> (helia: Helia, codecName: string, node: T, hasherCode = 18): Promise<CID> {
  const codec = await codecImporter(codecName)
  const hasher = await getHasherForCode(hasherCode)
  const encodedNode = codec.encode(node)
  const mhDigest = await hasher.digest(encodedNode)
  const cid = CID.createV1(codec.code, mhDigest)

  return helia.blockstore.put(cid, encodedNode)
}
