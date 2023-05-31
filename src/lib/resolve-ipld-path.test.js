/* global describe it expect */
// @ts-check
import { unixfs } from '@helia/unixfs'
import * as dagCbor from '@ipld/dag-cbor'
import * as dagPb from '@ipld/dag-pb'
import { CID } from 'multiformats'
import { sha256 } from 'multiformats/hashes/sha2'
import { vi } from 'vitest'

import { toCidOrNull } from './cid'
import resolveIpldPath, { findLinkPath } from './resolve-ipld-path'
import { createHeliaMock } from '../../test/unit/heliaMock'

const testCidString = 'bafyreiddymapg5zcpma3iu4wingqvois6jirucn5776wdsyg5f3f65v75a'

/**
 *
 * @param {import('@helia/interface').Helia} helia
 * @param {string | Uint8Array} data
 * @param {{encode: (n: any) => Uint8Array, code: number }} codec
 * @param {OldDagPbLinkLiteral[]} links
 *
 * @returns {Promise<CID>}
 */
async function addDagNodeToHelia (helia, codec, data, links) {
  const dagPbNode = createDagPbNode(data, links)
  const encodedDagPbNode = codec.encode(dagPbNode)
  const hash = await sha256.digest(encodedDagPbNode)
  const cid = CID.createV1(codec.code, hash)

  return await helia.blockstore.put(cid, encodedDagPbNode)
}

describe('resolveIpldPath', () => {
  it('resolves all nodes traversed along a path', async () => {
    const helia = await createHeliaMock()
    const node4Cid = await addDagNodeToHelia(helia, dagPb, '4th node', [])
    const node3Cid = await addDagNodeToHelia(helia, dagPb, '3rd node', [{
      name: 'a',
      cid: node4Cid.toString(),
      size: 101
    }])
    const node2Cid = await addDagNodeToHelia(helia, dagPb, '2nd node', [{
      name: 'b',
      cid: node3Cid.toString(),
      size: 101
    }])
    const rootNodeCid = await addDagNodeToHelia(helia, dagPb, 'root node', [{
      name: 'a',
      cid: node2Cid.toString(),
      size: 101
    }])
    const res = await resolveIpldPath(helia, rootNodeCid.toString(), '/a/b/a')
    expect(res.canonicalPath).toBe(node4Cid.toString())
    expect(res.nodes.length).toBe(4)
    expect(res.nodes[0].cid).toBe(rootNodeCid.toString())
    expect(res.nodes[1].cid).toBe(node2Cid.toString())
    expect(res.nodes[2].cid).toBe(node3Cid.toString())
    expect(res.nodes[3].cid).toBe(node4Cid.toString())
    expect(res.pathBoundaries.length).toBe(3)
    expect(res.pathBoundaries[0]).toEqual(expect.objectContaining({
      path: 'a',
      source: rootNodeCid.toString(),
      target: node2Cid.toString()
    }))
  })

  it('resolves thru dag-cbor to dag-pb to dag-pb', async () => {
    const ipldMock = {
      get: vi.fn(),
      resolve: vi.fn()
    }

    const path = '/a/b/pb1'

    const dagNode3 = await createDagPbNode('the second pb node', [])
    const dagNode3CID = 'bafybeibmrzxo3u4epqek6xkk2vkjzn4ika5rp4445hdkgi2h3ovsk6iwpm'

    const dagNode2 = await createDagPbNode('the first pb node', [{
      name: 'pb1',
      cid: dagNode3CID,
      size: 101
    }])
    const dagNode2CID = 'bafybeids2kauewqpsenxbaet4ar5sbsaddd24p2yk7a4b2vdwyrnsej45e'

    const dagNode1 = {
      a: {
        b: toCidOrNull(dagNode2CID)
      }
    }

    const dagGetRes1 = dagNode1

    const dagGetRes2 = {
      first: () => Promise.resolve({ remainderPath: 'pb1' })
    }

    const dagGetRes3 = dagNode2

    const dagGetRes4 = {
      first: () => Promise.resolve({ remainderPath: '' })
    }

    const dagGetRes5 = dagNode3

    const dagGetRes6 = {
      first: () => Promise.resolve({ remainderPath: '' })
    }

    ipldMock.get.mockReturnValueOnce(Promise.resolve(dagGetRes1))
    ipldMock.resolve.mockReturnValueOnce(dagGetRes2)
    ipldMock.get.mockReturnValueOnce(Promise.resolve(dagGetRes3))
    ipldMock.resolve.mockReturnValueOnce(dagGetRes4)
    ipldMock.get.mockReturnValueOnce(Promise.resolve(dagGetRes5))
    ipldMock.resolve.mockReturnValueOnce(dagGetRes6)

    const res = await resolveIpldPath(ipldMock, testCidString, path)

    expect(ipldMock.get.mock.calls.length).toBe(3)
    expect(ipldMock.resolve.mock.calls.length).toBe(3)
    expect(res.targetNode.cid).toEqual(dagNode3CID)
    expect(res.canonicalPath).toBe(dagNode3CID)
    expect(res.nodes.length).toBe(3)
    expect(res.nodes[0].type).toBe(dagCbor.code)
    expect(res.nodes[0].cid).toBe(testCidString)
    expect(res.nodes[0].links.length).toBe(1)
    expect(res.nodes[1].type).toBe(dagPb.code)
    expect(res.nodes[1].cid).toBe(dagNode2CID)
    expect(res.nodes[1].links.length).toBe(1)
    expect(res.nodes[2].type).toBe(dagPb.code)
    expect(res.nodes[2].cid).toBe(dagNode3CID)
    expect(res.nodes[2].links.length).toBe(0)
    expect(res.pathBoundaries.length).toBe(2)
    expect(res.pathBoundaries[0]).toEqual(expect.objectContaining({
      path: 'a/b',
      source: testCidString,
      target: dagNode2CID
    }))
    expect(res.pathBoundaries[1]).toEqual(expect.objectContaining({
      index: 0,
      path: 'pb1',
      source: dagNode2CID,
      target: dagNode3CID
    }))
  })
})

/**
 *
 * @typedef {object} OldDagPbLinkLiteral
 * @property {string} name
 * @property {string} cid
 * @property {number} size
 */
/**
 *
 * @param {string|Uint8Array} data
 * @param {OldDagPbLinkLiteral[]} links
 * @returns {import('@ipld/dag-pb').PBNode}
 */
function createDagPbNode (data, links) {
  return dagPb.prepare({
    Data: data,
    Links: links.map(({ cid, name, size }) => {
      return {
        Hash: cid,
        Name: name,
        Tsize: size
      }
    })
  })
}

describe('findLinkPath', () => {
  it('finds the linkPath from a fullPath and a remainderPath', () => {
    expect(findLinkPath('', '')).toBe(null)
    expect(findLinkPath('/', '')).toBe(null)
    expect(findLinkPath('/foo/bar', 'bar')).toBe('foo')
    expect(findLinkPath('/a/b/c/a', 'b/c/a')).toBe('a')
    expect(findLinkPath('/a/b/c/a', '/b/c/a')).toBe('a')
    expect(findLinkPath('a/b/c/a', '/b/c/a')).toBe('a')
    expect(() => findLinkPath('/foo', 'wat')).toThrow()
  })
})
