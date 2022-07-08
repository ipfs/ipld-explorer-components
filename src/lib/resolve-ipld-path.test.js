
/* global it expect jest */
import { CID } from 'multiformats'
import * as dagPb from '@ipld/dag-pb'
import * as dagCbor from '@ipld/dag-cbor'

import resolveIpldPath, { findLinkPath } from './resolve-ipld-path'
// console.log('cid: ', cid)
// cid

// base58btc - cidv1 - dag-cbor - sha2-256~256~63C300F377227B01B45396434D0AB912F2511A09BDFFFD61CB06E9765F76BFE8)
// const testCidString = 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4zrvSs'
// base32 - cidv1 - dag-cbor - sha2-256~256~63C300F377227B01B45396434D0AB912F2511A09BDFFFD61CB06E9765F76BFE8)
const testCidString = 'bafyreiddymapg5zcpma3iu4wingqvois6jirucn5776wdsyg5f3f65v75a'

const testCID = CID.asCID(testCidString)

// const { createLink, createNode, code } = codec
it('resolves all nodes traversed along a path', async () => {
  const ipldMock = {
    get: jest.fn(),
    resolve: jest.fn()
  }
  const path = '/a/b/a'
  // base58btc - cidv1 - dag-cbor - sha2-256~256~C99DE73243D54ECD30FCD93D94C6BE23D017D627139BE62653A27ECD5CB014D8)
  const linkCid = 'zdpuAyzU5ahAKr5YV24J5TqrDX8PhzHLMkxx69oVzkBDWHnjq'
  const dagGetRes1 = {
    a: {
      b: CID.asCID(linkCid)
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

  const res = await resolveIpldPath(ipldMock, testCID, path)

  expect(ipldMock.get.mock.calls.length).toBe(2)
  expect(ipldMock.resolve.mock.calls.length).toBe(2)
  expect(res.canonicalPath).toBe(`${linkCid}/a`)
  expect(res.nodes.length).toBe(2)
  expect(res.nodes[0].type).toBe('dag-cbor')
  expect(res.nodes[0].cid).toBe(cid)
  expect(res.nodes[1].type).toBe('dag-cbor')
  expect(res.nodes[1].cid).toBe(linkCid)
  expect(res.pathBoundaries.length).toBe(1)
  expect(res.pathBoundaries[0]).toEqual({
    path: 'a/b',
    source: testCidString,
    target: linkCid
  })
})

it('resolves thru dag-cbor to dag-pb to dag-pb', async () => {
  const ipldMock = {
    get: jest.fn(),
    resolve: jest.fn()
  }

  const path = '/a/b/pb1'

  const dagNode3 = await createDagPbNode('the second pb node', [])
  const dagNode3CID = 'QmRLacjo71FTzKFELa7Yf5YqMwdftKNDNFq7EiE13uohar'

  const dagNode2 = await createDagPbNode('the first pb node', [{
    name: 'pb1',
    cid: dagNode3CID,
    size: 101
  }])
  const dagNode2CID = 'QmW4sMkvHnTnVPkBJYToRW4burdMk9DHP5qGE4CYGUtHiQ'

  const dagNode1 = {
    a: {
      b: CID.asCID(dagNode2CID)
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

  const res = await resolveIpldPath(ipldMock, testCID, path)

  expect(ipldMock.get.mock.calls.length).toBe(3)
  expect(ipldMock.resolve.mock.calls.length).toBe(3)
  expect(res.targetNode.cid).toEqual(dagNode3CID)
  expect(res.canonicalPath).toBe(dagNode3CID)
  expect(res.nodes.length).toBe(3)
  expect(res.nodes[0].type).toBe('dag-cbor')
  expect(res.nodes[0].cid).toBe(testCidString)
  expect(res.nodes[0].links.length).toBe(1)
  expect(res.nodes[1].type).toBe('dag-pb')
  expect(res.nodes[1].cid).toBe(dagNode2CID)
  expect(res.nodes[1].links.length).toBe(1)
  expect(res.nodes[2].type).toBe('dag-pb')
  expect(res.nodes[2].cid).toBe(dagNode3CID)
  expect(res.nodes[2].links.length).toBe(0)
  expect(res.pathBoundaries.length).toBe(2)
  expect(res.pathBoundaries[0]).toEqual({
    path: 'a/b',
    source: testCidString,
    target: dagNode2CID
  })
  expect(res.pathBoundaries[1]).toEqual({
    index: 0,
    path: 'pb1',
    size: dagNode2.toJSON().links[0].size,
    source: dagNode2CID,
    target: dagNode3CID
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
 * @param {*} data
 * @param {OldDagPbLinkLiteral[]} links
 * @returns
 */
function createDagPbNode (data, links) {
  if (typeof data === 'string') {
    data = new Uint8Array(Buffer.from(data))
  }

  const newLinks = links.map(({ name, cid, size }) => {
    const cidInstance = CID.asCID(cid)
    console.log('cidInstance: ', cidInstance)
    return dagPb.createLink(name, size, cidInstance)
  })

  return dagPb.createNode(data, newLinks)
}

it('finds the linkPath from a fullPath and a remainderPath', () => {
  expect(findLinkPath('', '')).toBe(null)
  expect(findLinkPath('/', '')).toBe(null)
  expect(findLinkPath('/foo/bar', 'bar')).toBe('foo')
  expect(findLinkPath('/a/b/c/a', 'b/c/a')).toBe('a')
  expect(findLinkPath('/a/b/c/a', '/b/c/a')).toBe('a')
  expect(findLinkPath('a/b/c/a', '/b/c/a')).toBe('a')
  expect(() => findLinkPath('/foo', 'wat')).toThrow()
})
