/* global describe it expect beforeEach */
// @ts-check
import { type Helia } from '@helia/interface'
import * as dagCbor from '@ipld/dag-cbor'
import * as dagPb from '@ipld/dag-pb'
import { type PBNode } from '@ipld/dag-pb'
import { type CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { createHeliaMock } from '../../test/unit/helia-mock.js'
import { addDagNodeToHelia } from './helpers.js'
import { resolveIpldPath, findLinkPath, ipldGetNodeAndRemainder } from './resolve-ipld-path.js'

// #WhenAddingNewCodec
describe('resolveIpldPath', () => {
  let helia: Helia
  beforeEach(async () => {
    helia = await createHeliaMock()
  })
  it('resolves all nodes traversed along a path', async () => {
    const node4Cid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('4th node', []))
    const node3Cid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('3rd node', [{
      name: 'a',
      cid: node4Cid.toString(),
      size: 101
    }]))
    const node2Cid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('2nd node', [{
      name: 'b',
      cid: node3Cid.toString(),
      size: 101
    }]))
    const rootNodeCid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('root node', [{
      name: 'a',
      cid: node2Cid.toString(),
      size: 101
    }]))
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
    const path = '/a/b/pb1'

    const dagNode3 = createDagPbNode('the second pb node', [])
    const dagNode3CID = await addDagNodeToHelia(helia, 'dag-pb', dagNode3)

    const dagNode2 = createDagPbNode('the first pb node', [{
      name: 'pb1',
      cid: dagNode3CID.toString(),
      size: 101
    }])
    const dagNode2CID = await addDagNodeToHelia(helia, 'dag-pb', dagNode2)

    const dagNode1 = {
      a: {
        b: dagNode2CID
      }
    }
    const dagNode1Cid = await addDagNodeToHelia(helia, 'dag-cbor', dagNode1)

    const res = await resolveIpldPath(helia, dagNode1Cid.toString(), path)

    expect(res.targetNode.cid).toEqual(dagNode3CID.toString())
    expect(res.canonicalPath).toBe(dagNode3CID.toString())
    expect(res.nodes.length).toBe(3)
    expect(res.nodes[0].type).toBe(dagCbor.code)
    expect(res.nodes[0].cid).toBe(dagNode1Cid.toString())
    expect(res.nodes[0].links.length).toBe(1)
    expect(res.nodes[1].type).toBe(dagPb.code)
    expect(res.nodes[1].cid).toBe(dagNode2CID.toString())
    expect(res.nodes[1].links.length).toBe(1)
    expect(res.nodes[2].type).toBe(dagPb.code)
    expect(res.nodes[2].cid).toBe(dagNode3CID.toString())
    expect(res.nodes[2].links.length).toBe(0)
    expect(res.pathBoundaries.length).toBe(2)
    expect(res.pathBoundaries[0]).toEqual(expect.objectContaining({
      path: 'a/b',
      source: dagNode1Cid.toString(),
      target: dagNode2CID.toString()
    }))
    expect(res.pathBoundaries[1]).toEqual(expect.objectContaining({
      index: 0,
      path: 'pb1',
      source: dagNode2CID.toString(),
      target: dagNode3CID.toString()
    }))
  })

  /**
   * This test proves that an error ("Requested IPLD path should end with the remainder path") discovered when viewing
   * the dag-cbor example from the start exploring page when loading path
   * `bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq/cheese/0` does not occur.
   *
   * The CIDs of the below objects should be:
   *
   * rootNode: bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq
   * childNode: bafkreifvxooyaffa7gy5mhrb46lnpdom34jvf4r42mubf5efbodyvzeujq
   *
   * but it doesn't necessarily matter, this was just an edgecase discovered accidentally.
   */
  it('resolves dag-cbor node with children all pointing to raw node', async () => {
    const path = '/cheese/0'
    const textEncoder = new TextEncoder()
    const childNode = await addDagNodeToHelia(helia, 'raw', textEncoder.encode('foo\n'))
    const rootNode = await addDagNodeToHelia(helia, 'dag-cbor', {
      cats: 'not cats',
      cheese: [
        childNode,
        childNode,
        childNode,
        childNode
      ],
      something: childNode
    })

    const res = await resolveIpldPath(helia, rootNode.toString(), path)

    expect(res.targetNode.cid.toString()).toBe(childNode.toString())
    expect(res.canonicalPath).toBe(childNode.toString())
    expect(res.nodes.length).toBe(2)
    expect(res.nodes[0].cid.toString()).toBe(rootNode.toString())
    expect(res.nodes[0].type).toBe(dagCbor.code)
    expect(res.nodes[0].links.length).toBe(5)
    expect(res.nodes[1].cid.toString()).toBe(childNode.toString())
    expect(res.nodes[1].type).toBe(raw.code)
    expect(res.nodes[1].links.length).toBe(0)
    expect(res.pathBoundaries.length).toBe(1)
    expect(res.pathBoundaries[0]).toEqual(expect.objectContaining({
      path: 'cheese/0',
      source: rootNode.toString(),
      target: childNode.toString()
    }))
  })
})

describe('ipldGetNodeAndRemainder', () => {
  let helia: Helia
  let node4Cid: CID
  let node3Cid: CID
  let node2Cid: CID
  let rootNodeCid: CID
  beforeEach(async () => {
    helia = await createHeliaMock()
    node4Cid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('4th node', []))
    node3Cid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('3rd node', [{
      name: 'a',
      cid: node4Cid.toString(),
      size: 101
    }]))
    node2Cid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('2nd node', [{
      name: 'b',
      cid: node3Cid.toString(),
      size: 101
    }]))
    rootNodeCid = await addDagNodeToHelia(helia, 'dag-pb', createDagPbNode('root node', [{
      name: 'a',
      cid: node2Cid.toString(),
      size: 101
    }]))
  })

  it('should return correct remainder path for rootNodeCid', async () => {
    let res = await ipldGetNodeAndRemainder(helia, rootNodeCid.toString(), '')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, rootNodeCid.toString(), '/')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, rootNodeCid.toString(), '/a')
    expect(res.remainderPath).toBe('')

    res = await ipldGetNodeAndRemainder(helia, rootNodeCid.toString(), '/a/b')
    expect(res.remainderPath).toBe('/b')

    res = await ipldGetNodeAndRemainder(helia, rootNodeCid.toString(), '/a/b/c')
    expect(res.remainderPath).toBe('/b/c')
  })

  it('should return correct remainder path for node2Cid', async () => {
    let res = await ipldGetNodeAndRemainder(helia, node2Cid.toString(), '')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, node2Cid.toString(), '/')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, node2Cid.toString(), '/a')
    expect(res.remainderPath).toBe('a/')

    res = await ipldGetNodeAndRemainder(helia, node2Cid.toString(), '/a/b')
    expect(res.remainderPath).toBe('a/b')

    res = await ipldGetNodeAndRemainder(helia, node2Cid.toString(), '/a/b/c')
    expect(res.remainderPath).toBe('a/b/c')
  })

  it('should return correct remainder path for node3Cid', async () => {
    let res = await ipldGetNodeAndRemainder(helia, node3Cid.toString(), '')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, node3Cid.toString(), '/')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, node3Cid.toString(), '/a')
    expect(res.remainderPath).toBe('')

    res = await ipldGetNodeAndRemainder(helia, node3Cid.toString(), '/a/b')
    expect(res.remainderPath).toBe('/b')

    res = await ipldGetNodeAndRemainder(helia, node3Cid.toString(), '/a/b/c')
    expect(res.remainderPath).toBe('/b/c')
  })

  it('should return correct remainder path for node4Cid', async () => {
    let res = await ipldGetNodeAndRemainder(helia, node4Cid.toString(), '')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, node4Cid.toString(), '/')
    expect(res.remainderPath).toBe('/')

    res = await ipldGetNodeAndRemainder(helia, node4Cid.toString(), '/a')
    expect(res.remainderPath).toBe('a/')

    res = await ipldGetNodeAndRemainder(helia, node4Cid.toString(), '/a/b')
    expect(res.remainderPath).toBe('a/b')

    res = await ipldGetNodeAndRemainder(helia, node4Cid.toString(), '/a/b/c')
    expect(res.remainderPath).toBe('a/b/c')
  })
})

interface OldDagPbLinkLiteral {
  name: string
  cid: string
  size: number
}

function createDagPbNode (data: string | Uint8Array, links: OldDagPbLinkLiteral[]): PBNode {
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
