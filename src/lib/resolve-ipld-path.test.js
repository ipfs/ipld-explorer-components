
/* global describe it expect jest */
// @ts-check
import * as dagPb from '@ipld/dag-pb'
import * as dagCbor from '@ipld/dag-cbor'

import resolveIpldPath, { findLinkPath } from './resolve-ipld-path'
import { toCidOrNull } from './cid'
import { convertDagPbNodeToJson } from './normalise-dag-node'

const testCidString = 'bafyreiddymapg5zcpma3iu4wingqvois6jirucn5776wdsyg5f3f65v75a'

describe('resolveIpldPath', () => {
  it('resolves all nodes traversed along a path', async () => {
    const testCidString = 'bafyreiddymapg5zcpma3iu4wingqvois6jirucn5776wdsyg5f3f65v75a'

    const testCID = /** @type {import('multiformats').CID} */(toCidOrNull(testCidString))
    const ipldMock = {
      get: jest.fn(),
      resolve: jest.fn()
    }
    const path = '/a/b/a'
    const linkCid = 'bafyreigjtxtteq6vj3gtb7gzhwkmnprd2al5mjyttptcmu5cp3gvzmau3a'

    const dagGetRes1 = {
      a: {
        b: toCidOrNull(linkCid)
      }
    }
    const dagGetRes2 = {
      first: () => Promise.resolve({ remainderPath: '/a' })
    }
    const dagGetRes3 = {
      a: 'hello world'
    }
    const dagGetRes4 = {
      first: () => Promise.resolve({ remainderPath: '/a' })
    }

    ipldMock.get.mockReturnValueOnce(Promise.resolve(dagGetRes1))
    ipldMock.resolve.mockReturnValueOnce(dagGetRes2)
    ipldMock.get.mockReturnValueOnce(Promise.resolve(dagGetRes3))
    ipldMock.resolve.mockReturnValueOnce(dagGetRes4)

    const res = await resolveIpldPath(ipldMock, testCID.toString(), path)

    expect(ipldMock.get.mock.calls.length).toBe(2)
    expect(ipldMock.resolve.mock.calls.length).toBe(2)
    expect(res.canonicalPath).toBe(`${linkCid}/a`)
    expect(res.nodes.length).toBe(2)
    expect(res.nodes[0].type).toBe(dagCbor.code)
    expect(res.nodes[0].cid).toBe(testCidString)
    expect(res.nodes[1].type).toBe(dagCbor.code)
    expect(res.nodes[1].cid).toBe(linkCid)
    expect(res.pathBoundaries.length).toBe(1)
    expect(res.pathBoundaries[0]).toEqual(expect.objectContaining({
      path: 'a/b',
      source: testCidString,
      target: linkCid
    }))
  })

  it('resolves thru dag-cbor to dag-pb to dag-pb', async () => {
    const ipldMock = {
      get: jest.fn(),
      resolve: jest.fn()
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
    expect(res.pathBoundaries[1]).toEqual({
      index: 0,
      path: 'pb1',
      size: convertDagPbNodeToJson(dagNode2).links[0].Tsize,
      source: dagNode2CID,
      target: dagNode3CID
    })
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
