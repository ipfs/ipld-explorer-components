import { type Helia } from '@helia/interface'
import { CID } from 'multiformats'
import { type NormalizedDagLink, type NormalizedDagNode } from '../types.js'
import getCodecForCid from './get-codec-for-cid.js'
import { getRawBlock } from './get-raw-block.js'
import { isFalsy, isTruthy } from './helpers'
import normaliseDagNode from './normalise-dag-node.js'

interface ResolvedIpldPathInfo {
  targetNode: NormalizedDagNode
  canonicalPath: string
  localPath: string
  nodes: NormalizedDagNode[]
  pathBoundaries: object[]
}

export interface IpldInterface {
  get(): Promise<unknown>
  resolve(): Promise<unknown>
}

/**
 * Walk an IPLD path to find all the nodes and path boundaries it traverses.
 *
 * Normalizes nodes into a common structure:
 *
 * ```js
 * { cid: String, type: 'dag-cbor' | 'dag-pb' | 'git-raw' | ..., data: *, links: [{cid, name}] }
 * ```
 *
 * Path boundaries capture the source and target cid where a path traverses a link:
 *
 * ```js
 * { linkPath: 'a/b', source: `zdpHash1` target: `zdpHash2`' }
 * ```
 *
 * Usage:
 * ```js
 * const res = resolveIpldPath(getHelia, 'zdpuHash' '/favourites/0/a/css')
 * const {targetNode, canonicalPath, localPath, nodes, pathBoundaries} = res
 * ```
 * Where:
 * - `targetNode` is the normalised node that the path lands in.
 * - `canonicalPath` is the shortest cid + path that can be used to locate the targetNode
 * - `localPath` is the tail part of the path that is local to the targetNode. May be ''
 * - `nodes` is the array of nodes that the path traverses.
 * - `pathBoundaries` is the array of links that the path traverses.
 */
export async function resolveIpldPath (helia: Helia, sourceCid: CID | string, path: string, nodes: NormalizedDagNode[] = [], pathBoundaries: NormalizedDagLink[] = []): Promise<ResolvedIpldPathInfo> {
  const { value, remainderPath } = await ipldGetNodeAndRemainder(helia, sourceCid, path)
  if (sourceCid == null) {
    // eslint-disable-next-line no-console
    console.trace('sourceCid is null')
    throw new Error('sourceCid is null')
  }
  const sourceCidStr = sourceCid.toString()

  const node = normaliseDagNode(value, sourceCidStr)
  nodes.push(node)

  const linkPath = findLinkPath(path, remainderPath)
  const link = findLink(node, linkPath)

  if (link != null) {
    pathBoundaries.push(link)
    // Go again, using the link.target as the sourceCid, and the remainderPath as the path.
    return resolveIpldPath(helia, link.target, remainderPath, nodes, pathBoundaries)
  }
  // we made it to the containing node. Hand back the info
  const canonicalPath = path != null ? `${sourceCidStr}${path}` : sourceCidStr
  const targetNode = node

  return { targetNode, canonicalPath, localPath: path, nodes, pathBoundaries }
}

export interface IpldGetNodeAndRemainderResult {
  /**
   * The decoded value of the node at the given path
   */
  value: any

  /**
   * The path that was not resolved
   */
  remainderPath: string
}

export async function ipldGetNodeAndRemainder (helia: Helia, sourceCid: CID | string, path?: string): Promise<IpldGetNodeAndRemainderResult> {
  if (sourceCid == null) {
    throw new Error('sourceCid is null')
  }
  let cidInstance = CID.asCID(sourceCid)
  if (cidInstance === null) {
    cidInstance = CID.parse(sourceCid as string)
  }
  const codecWrapper = await getCodecForCid(cidInstance)
  const encodedValue = await getRawBlock(helia, cidInstance)
  const value = codecWrapper.decode(encodedValue)

  // @ts-expect-error - limiting code changes, ignore this error
  const codecWrapperResolveResult = await codecWrapper.resolve(isTruthy(path) ? path : '/', encodedValue)
  // TODO: there was a type error previously uncaught
  const resolveValue: any = {}
  const { remainderPath } = codecWrapperResolveResult

  if (resolveValue?.Hash != null) {
    // this is never actually called because of above TODO callout
    // This is a PBLink, and we should resolve that link so we're returning PBNodes not PBLinks
    return ipldGetNodeAndRemainder(helia, value.Hash, remainderPath)
  }

  return {
    value,
    remainderPath
  }
}

/**
 * Find the link object that matches linkPath
 *
 * @param {import('./normalise-dag-node').NormalizedDagNode} node - a `normalisedDagNode`
 * @param {string} linkPath - an IPLD path string
 * @returns {import('./normalise-dag-node').NormalizedDagLink} the link object for `linkPath`
 */
export function findLink (node: NormalizedDagNode, linkPath: string | null): NormalizedDagLink | null {
  if (isFalsy(linkPath)) return null
  if (isFalsy(node)) return null
  const { links } = node
  const link = links.find((link) => link.path === linkPath)
  return link ?? null
}

export function findLinkPath (fullPath: string, remainderPath: string): string | null {
  if (isFalsy(fullPath) || fullPath === '/') return null
  if (isFalsy(remainderPath)) return trimSlashes(fullPath)
  if (!fullPath.endsWith(remainderPath)) {
    throw new Error(`Requested IPLD path should end with the remainder path: fullPath=${fullPath}, remainderPath=${remainderPath}`)
  }
  // Remove remainder path from end of full path to get link path
  const linkPath = fullPath.substring(0, fullPath.length - remainderPath.length)
  return trimSlashes(linkPath)
}

export function trimSlashes (str: string): string {
  if (str.startsWith('/')) {
    str = str.substring(1)
  }
  if (str.endsWith('/')) {
    str = str.substring(0, str.length - 1)
  }
  return str
}
