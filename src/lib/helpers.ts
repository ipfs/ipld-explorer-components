import { type Helia } from '@helia/interface'
import { CID } from 'multiformats'
import codecImporter from './codec-importer.js'
import { getHasherForCode } from './hash-importer.js'

export function ensureLeadingSlash (str: string): string {
  if (str.startsWith('/')) return str
  return `/${str}`
}

/**
 * When migrating to typescript and removing redux-bundler, a lot of old code
 * had checks like `path ? path : null` which would fire as "false" when the
 * path was an empty string. This function helps the migration path but should
 * be removed once all the old code is updated.
 */
export function isFalsy <T> (str: T | null | string | undefined): str is null {
  if (str == null || str === '') return true
  return false
}

export function isTruthy <T> (str: T | null | string | undefined): boolean {
  return !isFalsy(str)
}

export async function addDagNodeToHelia <T> (helia: Helia, codecName: string, node: T, hasherCode = 18): Promise<CID> {
  const codec = await codecImporter(codecName)
  const hasher = await getHasherForCode(hasherCode)
  const encodedNode = codec.encode(node)
  const mhDigest = await hasher.digest(encodedNode)
  const cid = CID.createV1(codec.code, mhDigest)

  return helia.blockstore.put(cid, encodedNode)
}
