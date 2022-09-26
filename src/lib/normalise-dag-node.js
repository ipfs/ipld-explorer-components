// @ts-check
import { UnixFS } from 'ipfs-unixfs'
import * as dagPb from '@ipld/dag-pb'
import * as dagCbor from '@ipld/dag-cbor'

import { toCidOrNull, getCodeOrNull, toCidStrOrNull } from './cid'

const utf8Decoder = new TextDecoder()

/**
 * Provide a uniform shape for all^ node types.
 *
 * Spare the rest of the codebase from having to cope with all possible node
 * shapes.
 *
 * ^: currently dag-cbor and dag-pb are supported.
 *
 * @function normaliseDagNode
 * @param {Object} node the `value` prop from `ipfs.dag.get` response.
 * @param {string} cidStr the cid string passed to `ipfs.dag.get`
 */
export default function normaliseDagNode (node, cidStr) {
  const code = getCodeOrNull(cidStr)
  if (code === dagPb.code) {
    return normaliseDagPb(node, cidStr, code)
  }
  // try cbor style if we don't know any better
  return normaliseDagCbor(node, cidStr, code ?? dagCbor.code)
}

/**
 *
 * @param {import('@ipld/dag-pb').PBNode} node
 * @returns {import('../types').DagPbNodeAsJson}
 */
export function convertDagPbNodeToJson (node) {
  const pbData = /** @type {Uint8Array} */(node.Data)
  let data = String.fromCharCode(...pbData)
  try {
    data = JSON.parse(data)
  } catch {
    // ignore
  }

  return {
    type: node.Links.length > 0 ? 'directory' : 'file',
    data,
    size: node.Links.reduce((acc, { Tsize }) => acc + (Tsize ?? 0), 0),
    links: node.Links
  }
}

/**
 * Normalize links and add type info. Add unixfs info where available
 *
 * @param {import('@ipld/dag-pb').PBNode} node
 * @param {string} cid
 * @param {import('../types').CodecType} type
 * @returns {import('../types').NormalizedDagPbNode}
 */
export function normaliseDagPb (node, cid, type) {
  // NOTE: Use the requested cid rather than the internal one.
  // The multihash property on a DAGNode is always cidv0, regardless of request cid.
  // SEE: https://github.com/ipld/js-ipld-dag-pb/issues/84

  // if (toCidStrOrNull(node.multihash) !== cid) {
  //   throw new Error('dag-pb multihash should match provided cid')
  // }

  const nodeAsJson = convertDagPbNodeToJson(node)
  /**
   * @type {import('../types').NormalizedDagPbNodeFormat}
   */
  let format = 'unknown'
  try {
    // it's a unix system?
    const { type, data, blockSizes } = UnixFS.unmarshal(nodeAsJson.data)
    nodeAsJson.data = { type, data, blockSizes }
    format = 'unixfs'
  } catch (err) {
    // dag-pb but not a unixfs.
    // console.log(err)
  }
  const cidStr = toCidStrOrNull(cid)
  if (cidStr == null) {
    throw new Error(`cidStr is null for cid: ${cid}`)
  }

  return {
    cid: cidStr,
    type,
    data: nodeAsJson.data,
    links: normaliseDagPbLinks(nodeAsJson, cid),
    size: nodeAsJson.size,
    format
  }
}

/**
 * Convert DagLink shape into normalized form that can be used interchangeably
 * with links found in dag-cbor
 *
 * @param {import('../types').DagPbNodeAsJson} node
 * @param {string} sourceCid
 * @returns {import('../types').NormalizedDagLink[]}
 */
export function normaliseDagPbLinks (node, sourceCid) {
  return node.links.map((link, index) => {
    const { Name: name, Tsize: size, Hash: cid } = link

    return ({
      path: name || `Links/${index}`,
      source: sourceCid,
      target: cid.toString(),
      size: size ?? 0,
      index
    })
  })
}

/**
 * Find links and add type and cid info
 *
 * @function normaliseDagCbor
 * @param {unknown} obj - The data object
 * @param {string} cid - The string representation of the CID
 * @param {number} code - multicodec code, see https://github.com/multiformats/multicodec/blob/master/table.csv
 * @returns {import('../types').NormalizedDagNode}
 */
export function normaliseDagCbor (obj, cid, code) {
  const links = findAndReplaceDagCborLinks(obj, cid)
  return {
    cid,
    type: code,
    data: obj,
    links,
    size: links.reduce((acc, { size }) => acc + size, 0),
    format: 'unknown'
  }
}

/**
 * A valid IPLD link in a dag-cbor node is an object with single "/" property.
 *
 * @param {unknown} obj
 * @param {string} sourceCid
 * @param {string} path
 * @returns {import('../types').NormalizedDagLink[]}
 */
export function findAndReplaceDagCborLinks (obj, sourceCid, path = '') {
  if (!obj || typeof obj !== 'object' || Buffer.isBuffer(obj) || typeof obj === 'string') {
    return []
  }

  const cid = toCidOrNull(obj)
  if (cid) {
    return [{ path, source: sourceCid, target: cid.toString(), size: 0, index: 0 }]
  }

  if (Array.isArray(obj)) {
    if (!obj.length) return []

    return obj
      .map((val, i) => findAndReplaceDagCborLinks(val, sourceCid, path ? `${path}/${i}` : `${i}`))
      .reduce((a, b) => a.concat(b))
      .filter(a => !!a)
  }

  const keys = Object.keys(obj)

  // Support older `{ "/": Buffer } style links until all the IPLD formats are updated.
  if (keys.length === 1 && keys[0] === '/') {
    const targetCid = toCidOrNull(obj['/'])

    if (!targetCid) return []

    const target = targetCid.toString()
    obj['/'] = target

    return [{ path, source: sourceCid, target, size: 0, index: 0 }]
  }

  if (keys.length > 0) {
    return keys
      .map(key => findAndReplaceDagCborLinks(obj[key], sourceCid, path ? `${path}/${key}` : `${key}`))
      .reduce((a, b) => a.concat(b))
      .filter(a => !!a)
  } else {
    return []
  }
}
