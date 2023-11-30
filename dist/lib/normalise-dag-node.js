// @ts-check
import * as dagCbor from '@ipld/dag-cbor';
import * as dagPb from '@ipld/dag-pb';
import { UnixFS } from 'ipfs-unixfs';
import { toCidOrNull, getCodeOrNull, toCidStrOrNull } from './cid';

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
export default function normaliseDagNode(node, cidStr) {
  const code = getCodeOrNull(cidStr);
  if (code === dagPb.code) {
    return normaliseDagPb( /** @type {import('@ipld/dag-pb').PBNode} */node, cidStr, code);
  }
  // try cbor style if we don't know any better
  // @ts-expect-error - todo: resolve this type error
  return normaliseDagCbor(node, cidStr, code ?? dagCbor.code);
}

/**
 * Normalize links and add type info. Add unixfs info where available
 *
 * @param {import('@ipld/dag-pb').PBNode} node
 * @param {string} cid
 * @param {import('../types').CodecType} type
 * @returns {import('../types').NormalizedDagNode}
 */
export function normaliseDagPb(node, cid, type) {
  // NOTE: Use the requested cid rather than the internal one.
  // The multihash property on a DAGNode is always cidv0, regardless of request cid.
  // SEE: https://github.com/ipld/js-ipld-dag-pb/issues/84

  // if (toCidStrOrNull(node.multihash) !== cid) {
  //   throw new Error('dag-pb multihash should match provided cid')
  // }

  const cidStr = toCidStrOrNull(cid);
  if (cidStr == null) {
    throw new Error(`cidStr is null for cid: ${cid}`);
  }
  /**
   * @type {import('../types').NormalizedDagPbNodeFormat}
   */
  let format = 'non-unixfs';
  const data = node.Data;
  if (data != null) {
    try {
      // it's a unix system?
      const unixFsObj = UnixFS.unmarshal(data);
      const {
        type,
        data: unixFsData,
        blockSizes
      } = unixFsObj;
      format = 'unixfs';
      return {
        cid: cidStr,
        type,
        // @ts-expect-error - type is a string and not assignable to `UnixFsNodeTypes`
        data: {
          type,
          data: unixFsData,
          blockSizes
        },
        links: normaliseDagPbLinks(node.Links, cid),
        size: unixFsObj.fileSize(),
        format
      };
    } catch (err) {
      // dag-pb but not a unixfs.
      // console.error(err)
    }
  }
  return {
    cid: cidStr,
    type,
    data,
    links: normaliseDagPbLinks(node.Links, cid),
    format
  };
}

/**
 * Convert DagLink shape into normalized form that can be used interchangeably
 * with links found in dag-cbor
 *
 * @param {import('@ipld/dag-pb').PBLink[]} links
 * @param {string} sourceCid
 * @returns {import('../types').NormalizedDagLink[]}
 */
export function normaliseDagPbLinks(links, sourceCid) {
  return links.map((link, index) => ({
    path: link.Name || `Links/${index}`,
    source: sourceCid,
    target: toCidStrOrNull(link.Hash) ?? '',
    size: BigInt(link.Tsize ?? 0),
    index
  }));
}

/**
 * Find links and add type and cid info
 *
 * @function normaliseDagCbor
 * @param {import('../types').NormalizedDagNode['data']} data - The data object
 * @param {string} cid - The string representation of the CID
 * @param {number} code - multicodec code, see https://github.com/multiformats/multicodec/blob/master/table.csv
 * @returns {import('../types').NormalizedDagNode}
 */
export function normaliseDagCbor(data, cid, code) {
  const links = findAndReplaceDagCborLinks(data, cid);
  return {
    cid,
    type: code,
    data,
    links,
    size: links.reduce((acc, _ref) => {
      let {
        size
      } = _ref;
      return acc + size;
    }, BigInt(0)),
    format: 'unknown'
  };
}

/**
 * A valid IPLD link in a dag-cbor node is an object with single "/" property.
 *
 * @param {unknown} obj
 * @param {string} sourceCid
 * @param {string} path
 * @returns {import('../types').NormalizedDagLink[]}
 */
export function findAndReplaceDagCborLinks(obj, sourceCid) {
  let path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (!obj || typeof obj !== 'object' || Buffer.isBuffer(obj) || typeof obj === 'string') {
    return [];
  }
  const cid = toCidOrNull(obj);
  if (cid) {
    return [{
      path,
      source: sourceCid,
      target: cid.toString(),
      size: BigInt(0),
      index: 0
    }];
  }
  if (Array.isArray(obj)) {
    if (!obj.length) return [];
    return obj.map((val, i) => findAndReplaceDagCborLinks(val, sourceCid, path ? `${path}/${i}` : `${i}`)).reduce((a, b) => a.concat(b)).filter(a => Boolean(a));
  }
  const keys = Object.keys(obj);

  // Support older `{ "/": Buffer } style links until all the IPLD formats are updated.
  if (keys.length === 1 && keys[0] === '/') {
    // @ts-expect-error - todo: resolve this type error
    const targetCid = toCidOrNull(obj['/']);
    if (!targetCid) return [];
    const target = targetCid.toString();
    // @ts-expect-error - todo: resolve this type error
    obj['/'] = target;
    return [{
      path,
      source: sourceCid,
      target,
      size: BigInt(0),
      index: 0
    }];
  }
  if (keys.length > 0) {
    return keys
    // @ts-expect-error - todo: resolve this type error
    .map(key => findAndReplaceDagCborLinks(obj[key], sourceCid, path ? `${path}/${key}` : `${key}`)).reduce((a, b) => a.concat(b)).filter(a => Boolean(a));
  } else {
    return [];
  }
}