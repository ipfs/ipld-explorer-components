/* global it expect */
import * as dagCbor from '@ipld/dag-cbor'
import * as dagPb from '@ipld/dag-pb'
import { CID } from 'multiformats'
import { normaliseDagNode, normaliseDagPb, findAndReplaceDagCborLinks } from './normalise-dag-node'

const cid1 = 'bafyreifiioc5v7xh3xbqjkdvgcz5ywo2vnhzd2gdnybfogxajjnchzzhei'
const cid2 = 'bafyreigej5njyhiye4rlhntifea6uwzkuwhkxvm2nxyyufnedzqqhhokpi'
const cid3 = 'bafyreidyyt24wtr7q5plglwroysqzn3ph42nvna4iswllnha7xrwogme3q'
const cid4 = 'bafyrwigbexamue2ba3hmtai7hwlcmd6ekiqsduyf5avv7oz6ln3radvjde'

describe('normaliseDagNode', () => {
  it('normalizes a simple cbor node', () => {
    const obj: any = { foo: 'bar' }
    const res = normaliseDagNode(obj, cid1)

    expect(res).toEqual(expect.objectContaining({
      cid: cid1,
      data: obj,
      type: dagCbor.code,
      links: []
    }))
  })

  it('normalizes a cbor node with an empty array', () => {
    const obj: any = { foo: [] }
    const res = normaliseDagNode(obj, cid1)

    expect(res).toEqual(expect.objectContaining({
      cid: cid1,
      data: obj,
      type: dagCbor.code,
      links: []
    }))
  })

  it('normalizes a cbor node with links', () => {
    const obj: any = {
      foo: CID.parse(cid2),
      bar: [CID.parse(cid2), CID.parse(cid3)]
    }

    const res = normaliseDagNode(obj, cid1)

    expect(res).toEqual({
      cid: cid1,
      data: obj,
      type: dagCbor.code,
      format: 'unknown',
      size: BigInt(0),
      links: [
        {
          path: 'foo',
          source: cid1,
          target: cid2,
          index: 0,
          size: BigInt(0)
        },
        {
          path: 'bar/0',
          source: cid1,
          target: cid2,
          index: 0,
          size: BigInt(0)
        },
        {
          path: 'bar/1',
          source: cid1,
          target: cid3,
          index: 0,
          size: BigInt(0)
        }
      ]
    })
  })
})

describe('normaliseDagPb', () => {
  it('throws an error when cidStr is null', () => {
    const node = {
      Data: new Uint8Array(),
      Links: []
    }
    expect(() => normaliseDagPb(node, 'invalidCid', dagPb.code)).toThrow('cidStr is null for cid: invalidCid')
  })
})

describe('findAndReplaceDagCborLinks', () => {
  /**
   * Note that the sourceCid's content does not matter for finding links, so these tests are all made up values
   */
  const sourceCid = cid1

  it('should return an empty array for null input', () => {
    const result = findAndReplaceDagCborLinks(null, sourceCid)
    expect(result).toStrictEqual([])
  })

  it('should return an empty array for non-object input', () => {
    const result = findAndReplaceDagCborLinks('notAnObject', sourceCid)
    expect(result).toStrictEqual([])
  })

  it('should return an empty array for an empty object', () => {
    const result = findAndReplaceDagCborLinks({}, sourceCid)
    expect(result).toStrictEqual([])
  })

  it('should return an empty array for an object without "/" property', () => {
    const result = findAndReplaceDagCborLinks({ someKey: 'someValue' }, sourceCid)
    expect(result).toStrictEqual([])
  })

  it('should return a NormalizedDagLink for an object with "/" property containing a valid CID', () => {
    const input = { '/': cid2 }
    const result = findAndReplaceDagCborLinks(input, sourceCid)
    expect(result).toStrictEqual([
      { path: '', source: sourceCid, target: cid2, size: BigInt(0), index: 0 }
    ])
  })

  it('should replace "/" property with CID string in a valid DAG-CBOR link object', () => {
    const input = { '/': cid2 }
    const result = findAndReplaceDagCborLinks(input, sourceCid)
    expect(result).toEqual([{
      index: 0,
      path: '',
      size: BigInt(0),
      source: sourceCid,
      target: cid2
    }])
  })

  it('should handle nested arrays and return appropriate links', () => {
    const input = [{ '/': cid2 }, { someKey: 'value' }]
    const result = findAndReplaceDagCborLinks(input, sourceCid)
    expect(result).toStrictEqual([
      { path: '/0', source: sourceCid, target: cid2, size: BigInt(0), index: 0 }
    ])
  })

  it('should handle deeply nested objects with "/" property', () => {
    const input = { nested: { '/': cid2 } }
    const result = findAndReplaceDagCborLinks(input, sourceCid)
    expect(result).toStrictEqual([
      { path: 'nested', source: sourceCid, target: cid2, size: BigInt(0), index: 0 }
    ])
  })

  it('should return an empty array if the "/" property does not contain a valid CID', () => {
    const input = { '/': 'invalidCid' }
    const result = findAndReplaceDagCborLinks(input, sourceCid)
    expect(result).toStrictEqual([])
  })

  it('should process nested arrays correctly and return all valid links', () => {
    const input = [
      { '/': cid2 },
      [{ '/': cid3 }, { '/': 'invalidCid' }],
      { '/': cid4 }
    ]
    const result = findAndReplaceDagCborLinks(input, sourceCid)
    expect(result).toStrictEqual([
      { path: '/0', source: sourceCid, target: cid2, size: BigInt(0), index: 0 },
      { path: '/1/0', source: sourceCid, target: cid3, size: BigInt(0), index: 0 },
      { path: '/2', source: sourceCid, target: cid4, size: BigInt(0), index: 0 }
    ])
  })

  it('should handle complex nested structures and only replace valid CID links', () => {
    const input = {
      array: [{ '/': cid2 }, { nestedArray: [{ '/': cid3 }] }],
      object: { '/': cid4 }
    }
    const result = findAndReplaceDagCborLinks(input, sourceCid)
    expect(result).toStrictEqual([
      { path: 'array/0', source: sourceCid, target: cid2, size: BigInt(0), index: 0 },
      { path: 'array/1/nestedArray/0', source: sourceCid, target: cid3, size: BigInt(0), index: 0 },
      { path: 'object', source: sourceCid, target: cid4, size: BigInt(0), index: 0 }
    ])
  })
})
