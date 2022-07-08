/* global it expect */
import { CID } from 'multiformats'
import * as dagCbor from '@ipld/dag-cbor'
import normaliseDagNode from './normalise-dag-node'
import { toCidStrOrNull } from './cid'

const cid1Old = 'zdpuAwkGh9cLskW5z7pH8V2uC5nwtSXd76L7ZTEXs5f8V89db'
const cid1 = toCidStrOrNull(cid1Old)
const cid2Old = 'zdpuAydka8ZEXd9UgWF1s4pVFcF4U1GEgtdNQFxKNt9tyKQxR'
const cid2 = toCidStrOrNull(cid2Old)
const cid3Old = 'zdpuAtYsbfdkVazNyWcS97cWKVzR99huDzNxMmoRb349jyUTD'
const cid3 = toCidStrOrNull(cid3Old)

it('normalizes a simple cbor node', () => {
  const obj = { foo: 'bar' }
  const res = normaliseDagNode(obj, cid1, dagCbor.code)

  expect(res).toEqual({
    cid: cid1,
    data: obj,
    type: dagCbor.code,
    links: []
  })
})

it('normalizes a cbor node with an empty array', () => {
  const obj = { foo: [] }
  const res = normaliseDagNode(obj, cid1, dagCbor.code)

  expect(res).toEqual({
    cid: cid1,
    data: obj,
    type: dagCbor.code,
    links: []
  })
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
    links: [
      {
        path: 'foo',
        source: cid1,
        target: cid2
      },
      {
        path: 'bar/0',
        source: cid1,
        target: cid2
      },
      {
        path: 'bar/1',
        source: cid1,
        target: cid3
      }
    ]
  })
})
