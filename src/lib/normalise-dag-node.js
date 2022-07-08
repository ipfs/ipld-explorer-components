// @ts-check
import { UnixFS } from 'ipfs-unixfs'
// import CID from 'cids'
import { CID } from 'multiformats'
import { toCidOrNull, getCodeOrNull } from './cid'
import * as dagPb from '@ipld/dag-pb'
import * as dagCbor from '@ipld/dag-cbor'

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
 * @param {String} cidStr the cid string passed to `ipfs.dag.get`
 */
export default function normaliseDagNode (node, cidStr) {
  const code = getCodeOrNull(cidStr)
  if (code === dagPb.code) {
    return normaliseDagPb(node, cidStr, code)
  }
  // try cbor style if we don't know any better
  return normaliseDagCbor(node, cidStr, code ?? dagCbor.code)
}

/*
 * Normalize links and add type info. Add unixfs info where available
 *
 * @param {*} node
 * @param {*} cid
 * @param {*} type
 * @returns
 */
export function normaliseDagPb (node, cid, type) {
  // NOTE: Use the requested cid rather than the internal one.
  // The multihash property on a DAGNode is always cidv0, regardless of request cid.
  // SEE: https://github.com/ipld/js-ipld-dag-pb/issues/84

  // if (toCidStrOrNull(node.multihash) !== cid) {
  //   throw new Error('dag-pb multihash should match provided cid')
  // }
  node = node.toJSON()
  let format
  try {
    // it's a unix system?
    const { type, data, blockSizes } = UnixFS.unmarshal(node.data)
    node.data = { type, data, blockSizes }
    format = 'unixfs'
  } catch (err) {
    // dag-pb but not a unixfs.
    // console.log(err)
  }

  return {
    cid,
    type,
    data: node.data,
    links: normaliseDagPbLinks(node, cid),
    size: node.size,
    format
  }
}

/*
 * Convert DagLink shape into normalized form that can be used interchangeably
 * with links found in dag-cbor
 *
 * @param {*} node
 * @param {*} sourceCid
 * @returns
 */
export function normaliseDagPbLinks (node, sourceCid) {
  return node.links.map(({ name, size, cid }, index) => ({
    path: name || `Links/${index}`,
    source: sourceCid,
    target: cid,
    size,
    index
  }))
}

/*
 * Find links and add type and cid info
 *
 * @function normaliseDagCbor
 * @param {unknown} obj - The data object
 * @param {string} cid - The string representation of the CID
 * @param {number} code - multicodec code, see https://github.com/multiformats/multicodec/blob/master/table.csv
 * @returns
 */
export function normaliseDagCbor (obj, cid, code) {
  const links = findAndReplaceDagCborLinks(obj, cid)
  return {
    cid,
    type: code,
    data: obj,
    links: links
  }
}

/**
 * A valid IPLD link in a dag-cbor node is an object with single "/" property.
 *
 * @param {*} obj
 * @param {*} sourceCid
 * @param {*} path
 * @returns
 */
export function findAndReplaceDagCborLinks (obj, sourceCid, path = '') {
  if (!obj || !typeof obj === 'object' || Buffer.isBuffer(obj) || typeof obj === 'string') {
    return []
  }

  const cid = CID.asCID(obj)
  if (cid) {
    return [{ path, source: sourceCid, target: cid.toString() }]
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

    return [{ path, source: sourceCid, target }]
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
