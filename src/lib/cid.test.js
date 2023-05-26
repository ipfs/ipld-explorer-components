/* global describe it expect */
// @ts-check
import crypto from 'crypto'

import * as dagCbor from '@ipld/dag-cbor'
import * as dagPb from '@ipld/dag-pb'
import * as multiformats from 'multiformats'

import { toCidOrNull, getCodecOrNull, getCodeOrNull, toCidStrOrNull } from './cid'

const { CID, hasher, bytes } = multiformats

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
    const digest = await hasher.digest(codec.encode(value))
    return CID.create(1, codec.code, digest)
  } catch (err) {
    console.log('Failed to create CID', value, err)
    return null
  }
}

const cidStr = 'bafyreiddymapg5zcpma3iu4wingqvois6jirucn5776wdsyg5f3f65v75a'

describe('cid.js', () => {
  describe('toCidOrNull', () => {
    it('Returns CID instance for valid CID string', () => {
      // arrange
      // act
      const cid = toCidOrNull(cidStr)
      // assert
      expect(cid).toBeInstanceOf(CID)
      expect(cid?.code).toBe(dagCbor.code)
    })

    it('Returns null for invalid CID string', () => {
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
      // act
      const codec = getCodecOrNull(cid)
      // assert
      expect(codec).toBe('dag-pb')
    })

    it('CID with any other codec returns null', async () => {
      // arrange
      /**
       * @type {import('multiformats/block').BlockEncoder<99999, any>}
       */
      const fakeCodec = {
        name: 'fake',
        code: 99999,
        encode: () => new Uint8Array(Buffer.from('NOTHING'))
      }

      const cid = await createCID({ foo: 'abc' }, fakeCodec, sha256)
      expect(cid).toBeInstanceOf(CID)
      // act
      const codec = getCodecOrNull(cid)
      // assert
      expect(codec).toBe(null)
    })
  })

  describe('getCodeOrNull', () => {
    it(`CID with 'dag-cbor' codec returns '${dagCbor.code}'`, async () => {
      // arrange
      const cid = await createCID({ foo: 'abc' }, dagCbor, sha256)
      expect(cid).toBeInstanceOf(CID)
      // act
      const codec = getCodeOrNull(cid)
      // assert
      expect(codec).toBe(dagCbor.code)
    })

    it(`CID with 'dag-pb' codec returns '${dagPb.code}'`, async () => {
      // arrange
      const cid = await createCID({
        Data: new Uint8Array(Buffer.from('hello world')),
        Links: []
      }, dagPb, sha256)
      expect(cid).toBeInstanceOf(CID)
      // act
      const codec = getCodeOrNull(cid)
      // assert
      expect(codec).toBe(dagPb.code)
    })

    it('CID with any other codec returns the correct code', async () => {
      // arrange
      /**
       * @type {import('multiformats/block').BlockEncoder<99999, any>}
       */
      const fakeCodec = {
        name: 'fake',
        code: 99999,
        encode: () => new Uint8Array(Buffer.from('NOTHING'))
      }

      const cid = await createCID({ foo: 'abc' }, fakeCodec, sha256)
      expect(cid).toBeInstanceOf(CID)
      // act
      const codec = getCodeOrNull(cid)
      // assert
      expect(codec).toBe(fakeCodec.code)
    })
  })

  describe('toCidStrOrNull', () => {
    it('Returns correct string for valid CID', () => {
      // arrange
      // act
      const tempCidStr = toCidStrOrNull(toCidOrNull(cidStr))
      // assert
      expect(tempCidStr).toBe(cidStr)
    })

    it('Returns null for invalid CID string', () => {
      // arrange
      // act
      const tempCidStr = toCidStrOrNull('abc123')
      // assert
      expect(tempCidStr).toBe(null)
    })
  })
})
