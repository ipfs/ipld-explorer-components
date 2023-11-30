/**
 * @typedef dagNodeLink
 * @property {string} cid
 * @property {string} name
 * @property {number} size
 */
/**
 * @typedef dagNodeData
 * @property {unknown[]} blockSizes
 * @property {unknown} data
 * @property {string} type
 */
/**
 * @typedef dagNode
 * @property {dagNodeData} data
 * @property {dagNodeLink[]} links
 * @property {number} size
 */
/**
 * Provide a uniform shape for all^ node types.
 *
 * Spare the rest of the codebase from having to cope with all possible node
 * shapes.
 *
 * ^: currently dag-cbor and dag-pb are supported.
 *
 * @function normaliseDagNode
 * @param {dagNode|import('@ipld/dag-pb').PBNode} node - the `value` prop from `ipfs.dag.get` response.
 * @param {string} cidStr - the cid string passed to `ipfs.dag.get`
 * @returns {import('../types').NormalizedDagNode}
 */
export default function normaliseDagNode(node: dagNode | import('@ipld/dag-pb').PBNode, cidStr: string): import('../types').NormalizedDagNode;
/**
 * Normalize links and add type info. Add unixfs info where available
 *
 * @param {import('@ipld/dag-pb').PBNode} node
 * @param {string} cid
 * @param {import('../types').CodecType} type
 * @returns {import('../types').NormalizedDagNode}
 */
export function normaliseDagPb(node: import('@ipld/dag-pb').PBNode, cid: string, type: import('../types').CodecType): import('../types').NormalizedDagNode;
/**
 * Convert DagLink shape into normalized form that can be used interchangeably
 * with links found in dag-cbor
 *
 * @param {import('@ipld/dag-pb').PBLink[]} links
 * @param {string} sourceCid
 * @returns {import('../types').NormalizedDagLink[]}
 */
export function normaliseDagPbLinks(links: import('@ipld/dag-pb').PBLink[], sourceCid: string): import('../types').NormalizedDagLink[];
/**
 * Find links and add type and cid info
 *
 * @function normaliseDagCbor
 * @param {import('../types').NormalizedDagNode['data']} data - The data object
 * @param {string} cid - The string representation of the CID
 * @param {number} code - multicodec code, see https://github.com/multiformats/multicodec/blob/master/table.csv
 * @returns {import('../types').NormalizedDagNode}
 */
export function normaliseDagCbor(data: import('../types').NormalizedDagNode['data'], cid: string, code: number): import('../types').NormalizedDagNode;
/**
 * A valid IPLD link in a dag-cbor node is an object with single "/" property.
 *
 * @param {unknown} obj
 * @param {string} sourceCid
 * @param {string} path
 * @returns {import('../types').NormalizedDagLink[]}
 */
export function findAndReplaceDagCborLinks(obj: unknown, sourceCid: string, path?: string): import('../types').NormalizedDagLink[];
export type dagNodeLink = {
    cid: string;
    name: string;
    size: number;
};
export type dagNodeData = {
    blockSizes: unknown[];
    data: unknown;
    type: string;
};
export type dagNode = {
    data: dagNodeData;
    links: dagNodeLink[];
    size: number;
};
