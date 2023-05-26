import { CID } from 'multiformats'

import getCodecForCid from './get-codec-for-cid.js'
import { getRawBlock } from './get-raw-block.js'
import normaliseDagNode from './normalise-dag-node.js'

/**
 * @typedef {object} ResolvedIpldPathInfo
 * @property {object} targetNode
 * @property {string} canonicalPath
 * @property {string} localPath
 * @property {object[]} nodes
 * @property {object[]} pathBoundaries
 */
/**
 * @typedef {object} IpldInterface
 * @property {() => Promise<unknown>} get
 * @property {() => Promise<unknown>} resolve
 */

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
 * const res = resolveIpldPath(getIpfs, 'zdpuHash' '/favourites/0/a/css')
 * const {targetNode, canonicalPath, localPath, nodes, pathBoundaries} = res
 * ```
 * Where:
 * - `targetNode` is the normalised node that the path lands in.
 * - `canonicalPath` is the shortest cid + path that can be used to locate the targetNode
 * - `localPath` is the tail part of the path that is local to the targetNode. May be ''
 * - `nodes` is the array of nodes that the path traverses.
 * - `pathBoundaries` is the array of links that the path traverses.
 *
 * @param {IpldInterface} ipldGet - fn that returns a promise of the ipld data for a (cid, path, options)
 * @param ipfs
 * @param {string} sourceCid - the root hash
 * @param {string} path - everything after the hash
 * @param {object[]} nodes - accumulated node info
 * @param {object[]} pathBoundaries - accumulated path boundary info
 * @returns {ResolvedIpldPathInfo} resolved path info
 */
export default async function resolveIpldPath (ipfs, sourceCid, path, nodes = [], pathBoundaries = []) {
  const { value, remainderPath } = await ipldGetNodeAndRemainder(ipfs, sourceCid, path)
  if (sourceCid == null) {
    throw new Error('sourceCid is null')
  }
  const sourceCidStr = sourceCid.toString()

  const node = normaliseDagNode(value, sourceCidStr)
  nodes.push(node)

  const linkPath = findLinkPath(path, remainderPath)
  const link = findLink(node, linkPath)

  if (link) {
    pathBoundaries.push(link)
    // Go again, using the link.target as the sourceCid, and the remainderPath as the path.
    return resolveIpldPath(ipfs, link.target, remainderPath, nodes, pathBoundaries)
  }
  // we made it to the containing node. Hand back the info
  const canonicalPath = path ? `${sourceCidStr}${path}` : sourceCidStr
  const targetNode = node

  return { targetNode, canonicalPath, localPath: path, nodes, pathBoundaries }
}

/**
 * @function ipldGetNodeAndRemainder
 * @param {typeof import('@helia/interface').Helia} helia
 * @param {string} sourceCid
 * @param {string} path
 * @returns
 */
export async function ipldGetNodeAndRemainder (helia, sourceCid, path) {
  if (sourceCid == null) {
    throw new Error('sourceCid is null')
  }
  let cidInstance = CID.asCID(sourceCid)
  if (cidInstance === null) {
    cidInstance = CID.parse(sourceCid)
  }
  const codecWrapper = await getCodecForCid(cidInstance)
  const encodedValue = await getRawBlock(helia, cidInstance)
  const value = codecWrapper.decode(encodedValue)

  const codecWrapperResolveResult = await codecWrapper.resolve(path || '/', encodedValue)
  const { remainderPath, resolve: resolveValue } = codecWrapperResolveResult

  if (resolveValue?.Hash != null) {
    // This is a PBLink, and we should resolve that link so we're returning PBNodes not PBLinks
    return await ipldGetNodeAndRemainder(helia, value.Hash, remainderPath)
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
export function findLink (node, linkPath) {
  if (!linkPath) return null
  if (!node) return null
  const { links } = node
  const link = links.find(link => link.path === linkPath)
  return link
}

export function findLinkPath (fullPath, remainderPath) {
  if (!fullPath || fullPath === '/') return null
  if (!remainderPath) return trimSlashes(fullPath)
  if (!fullPath.endsWith(remainderPath)) {
    throw new Error('Requested IPLD path should end with the remainder path', { fullPath, remainderPath })
  }
  // Remove remainder path from end of full path to get link path
  const linkPath = fullPath.substring(0, fullPath.length - remainderPath.length)
  return trimSlashes(linkPath)
}

export function trimSlashes (str) {
  if (str.startsWith('/')) {
    str = str.substring(1)
  }
  if (str.endsWith('/')) {
    str = str.substring(0, str.length - 1)
  }
  return str
}
