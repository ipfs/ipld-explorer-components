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
 * const res = resolveIpldPath(getHelia, 'zdpuHash' '/favourites/0/a/css')
 * const {targetNode, canonicalPath, localPath, nodes, pathBoundaries} = res
 * ```
 * Where:
 * - `targetNode` is the normalised node that the path lands in.
 * - `canonicalPath` is the shortest cid + path that can be used to locate the targetNode
 * - `localPath` is the tail part of the path that is local to the targetNode. May be ''
 * - `nodes` is the array of nodes that the path traverses.
 * - `pathBoundaries` is the array of links that the path traverses.
 *
 * @param {import('@helia/interface').Helia} helia
 * @param {string} sourceCid - the root hash
 * @param {string} path - everything after the hash
 * @param {object[]} nodes - accumulated node info
 * @param {object[]} pathBoundaries - accumulated path boundary info
 * @returns {ResolvedIpldPathInfo} resolved path info
 */
export default function resolveIpldPath(helia: import('@helia/interface').Helia, sourceCid: string, path: string, nodes?: object[], pathBoundaries?: object[]): ResolvedIpldPathInfo;
/**
 * @function ipldGetNodeAndRemainder
 * @param {typeof import('@helia/interface').Helia} helia
 * @param {string} sourceCid
 * @param {string} path
 * @returns
 */
export function ipldGetNodeAndRemainder(helia: any, sourceCid: string, path: string): any;
/**
 * Find the link object that matches linkPath
 *
 * @param {import('./normalise-dag-node').NormalizedDagNode} node - a `normalisedDagNode`
 * @param {string} linkPath - an IPLD path string
 * @returns {import('./normalise-dag-node').NormalizedDagLink} the link object for `linkPath`
 */
export function findLink(node: any, linkPath: string): any;
export function findLinkPath(fullPath: any, remainderPath: any): any;
export function trimSlashes(str: any): any;
export type ResolvedIpldPathInfo = {
    targetNode: object;
    canonicalPath: string;
    localPath: string;
    nodes: object[];
    pathBoundaries: object[];
};
export type IpldInterface = {
    get: () => Promise<unknown>;
    resolve: () => Promise<unknown>;
};
