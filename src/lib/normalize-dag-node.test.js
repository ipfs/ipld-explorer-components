/* global it expect */
import * as dagCbor from '@ipld/dag-cbor'
import { CID } from 'multiformats'

import normaliseDagNode from './normalise-dag-node'

const cid1 = 'bafyreifiioc5v7xh3xbqjkdvgcz5ywo2vnhzd2gdnybfogxajjnchzzhei'
const cid2 = 'bafyreigej5njyhiye4rlhntifea6uwzkuwhkxvm2nxyyufnedzqqhhokpi'
const cid3 = 'bafyreidyyt24wtr7q5plglwroysqzn3ph42nvna4iswllnha7xrwogme3q'

it('normalizes a simple cbor node', () => {
  const obj = { foo: 'bar' }
  const res = normaliseDagNode(obj, cid1, dagCbor.code)

  expect(res).toEqual(expect.objectContaining({
    cid: cid1,
    data: obj,
    type: dagCbor.code,
    links: []
  }))
})

it('normalizes a cbor node with an empty array', () => {
  const obj = { foo: [] }
  const res = normaliseDagNode(obj, cid1, dagCbor.code)

  expect(res).toEqual(expect.objectContaining({
    cid: cid1,
    data: obj,
    type: dagCbor.code,
    links: []
  }))
})

it('normalizes a cbor node with links', () => {
  const obj = {
    foo: CID.parse(cid2),
    bar: [CID.parse(cid2), CID.parse(cid3)]
  }

  const res = normaliseDagNode(obj, cid1, dagCbor.code)

  expect(res).toEqual({
    cid: cid1,
    data: obj,
    type: dagCbor.code,
    format: 'unknown',
    size: 0,
    links: [
      {
        path: 'foo',
        source: cid1,
        target: cid2,
        index: 0,
        size: 0
      },
      {
        path: 'bar/0',
        source: cid1,
        target: cid2,
        index: 0,
        size: 0
      },
      {
        path: 'bar/1',
        source: cid1,
        target: cid3,
        index: 0,
        size: 0
      }
    ]
  })
})
