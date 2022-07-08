/* global describe it expect */
// @ts-check
import { toCidOrNull, getCodecOrNull, getCodeOrNull, toCidStrOrNull } from './cid'
import * as multiformats from 'multiformats'
// import * as multiformatHashes from 'multiformats/hashes/sha2'
import * as dagCbor from '@ipld/dag-cbor'
import * as dagPb from '@ipld/dag-pb'
import * as dagJson from 'multiformats/codecs/json'
import crypto from 'crypto'

import { TextEncoder } from 'util'
// import * as codecs from 'multiformats/codecs'
// console.log('multiformatHashes: ', multiformatHashes)
console.log('multiformats: ', multiformats)
const { CID, hasher, bytes } = multiformats
// const { sha256 } = multiformatHashes.default
// console.log(`default: `, default);
// console.log('sha256: ', Object.keys(sha256))
console.log('hasher.from: ', hasher.from)
const textEncoder = new TextEncoder()
export const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => bytes.coerce(crypto.createHash('sha256').update(input).digest())
})
/**
 *
 * @template {number} Code
 * @param {any} value
 * @param {import('multiformats/block').BlockEncoder<Code, any>} codec
 * @param {import('multiformats/hashes/interface').MultihashHasher<Code>} hasher
 * @returns
 */
const createCID = async (value, codec, hasher) => {
  try {
    console.log(`${codec.name} codec.encode(value): `, codec.encode(value))
    const digest = await hasher.digest(codec.encode(value))
    console.log(`${codec.name} digest: `, digest)
    return CID.create(1, codec.code, digest)
  } catch (err) {
    console.log('Failed to create CID', value, err)
    return null
  }
}

describe('cid.js', () => {
  describe('toCidOrNull', () => {
    it('Returns CID instance for valid CID string', () => {
      // arrange
      // base58btc - cidv1 - dag-cbor - sha2-256~256~63C300F377227B01B45396434D0AB912F2511A09BDFFFD61CB06E9765F76BFE8)
      const cidStr = 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4zrvSs'
      // act
      const cid = toCidOrNull(cidStr)
      // assert
      expect(cid).toBeInstanceOf(CID)
      expect(cid?.code).toBe(dagCbor.code)
    })

    it('Returns null instance for invalid CID string', () => {
      // arrange
      const cidStr = 'abc123'
      // act
      const cid = toCidOrNull(cidStr)
      // assert
      expect(cid).not.toBeInstanceOf(CID)
      expect(cid).toBe(null)
    })
  })

  describe('getCodecOrNull', () => {
    it('CID with `dag-cbor` codec returns `dag-cbor`', async () => {
      // arrange
      const cid = await createCID({ foo: 'abc' }, dagCbor, sha256)
      expect(cid).toBeInstanceOf(CID)
      console.log('cid: ', cid)
      // act
      const codec = getCodecOrNull(cid)
      // assert
      expect(codec).toBe('dag-cbor')
    })

    it('CID with `dag-pb` codec returns `dag-pb`', async () => {
      // arrange
      const cid = await createCID({
        Data: new Uint8Array(Buffer.from('hello world')),
        Links: []
      }, dagPb, sha256)
      expect(cid).toBeInstanceOf(CID)
      console.log('cid: ', cid)
      // act
      const codec = getCodecOrNull(cid)
      // assert
      expect(codec).toBe('dag-pb')
    })

    it('CID with any other codec returns null', async () => {
      // arrange
      const cid = await qcreateCID({ foo: 'abc' }, dagJson, sha256)
      console.log('cid: ', cid)
      // act
      const codec = getCodecOrNull(cid)
      // assert
      expect(codec).toBe(null)
    })
  })

  describe('getCodeOrNull', () => {
    it('test', () => {
      // arrange
      // act
      // assert
      expect(true).toBe(false)
    })
  })

  describe('toCidStrOrNull', () => {
    it('test', () => {
      // arrange
      // act
      // assert
      expect(true).toBe(false)
    })
  })
})
