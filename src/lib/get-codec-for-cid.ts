
// exports.ethAccountSnapshot = require('../eth-account-snapshot')
// exports.ethBlock = require('../eth-block')
// exports.ethBlockList = require('../eth-block-list')
// exports.ethStateTrie = require('../eth-state-trie')
// exports.ethStorageTrie = require('../eth-storage-trie')
// exports.ethTx = require('../eth-tx')
// exports.ethTxTrie = require('../eth-tx-trie')

import {code as dagCborCode} from '@ipld/dag-cbor'
import {code as dagPbCode} from '@ipld/dag-pb'
// @ts-expect-error - no ipld-git types
import {codec as ipldGitCode} from 'ipld-git'
import {code as rawCode} from 'multiformats/codecs/raw'
// @ts-expect-error - no ipld-ethereum types
import ipldEth from 'ipld-ethereum'
// @ts-expect-error - no ipld-ethereum types
import {code as ipldEthAccountSnapshotCode} from 'ipld-ethereum/eth-account-snapshot'
// @ts-expect-error - no ipld-ethereum types
import {code as ethBlockCode} from 'ipld-ethereum/eth-block'
// @ts-expect-error - no ipld-ethereum types
import {code as ethBlockListCode} from 'ipld-ethereum/eth-block-list'
// @ts-expect-error - no ipld-ethereum types
import {code as ethStateTrieCode} from 'ipld-ethereum/eth-state-trie'
// @ts-expect-error - no ipld-ethereum types
import {code as ethStorageTrieCode} from 'ipld-ethereum/eth-storage-trie'
// @ts-expect-error - no ipld-ethereum types
import {code as ethTxCode} from 'ipld-ethereum/eth-tx'
// @ts-expect-error - no ipld-ethereum types
import {code as ethTxTrieCode} from 'ipld-ethereum/eth-tx-trie'
console.log(`ipldEth: `, ipldEth);
import { CID } from 'multiformats'

import { convert } from 'blockcodec-to-ipld-format'

interface CodecWrapper<DecodedType = any> {
  decode: (bytes: Uint8Array) => T,
  resolve: (path: string) => Promise<{ value: DecodedType, remainderPath: string }>,
}

export default async function getCodecForCid (cid: CID): Promise<CodecWrapper> {
  // determine the codec code for the CID
  const codecCode = cid.code
  console.log(`cid.code: `, cid.code);
  if (codecCode === undefined) {
    console.log('codec code for cid is undefined', cid)
  }

  let codec: any;

  // match the codecCode to the codec
  switch (codecCode) {
    case dagCborCode:
      codec = await import('@ipld/dag-cbor')
      break;
    case dagPbCode:
      codec = await import('@ipld/dag-pb')
      break;
    case ipldGitCode:
      // @ts-expect-error - no ipld-git types
      codec = await import('ipld-git')
      break;
    case rawCode:
      codec = await import('multiformats/codecs/raw')
      break;
    case ipldEthAccountSnapshotCode:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-account-snapshot')
      break;
    case ethBlockCode:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-block')
      break;
    case ethBlockListCode:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-block-list')
      break;
    case ethStateTrieCode:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-state-trie')
      break;
    case ethStorageTrieCode:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-storage-trie')
      break;
    case ethTxCode:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-tx')
      break;
    case ethTxTrieCode:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-tx-trie')
      break;
    // case ipldEth.code:
    //   throw new Error('ipld-ethereum is not supported yet')
    default:
      throw new Error(`unsupported codec: ${codecCode}`)
  }
  console.log('codec: ', codec)

  const convertedCodec = convert(codec)
  console.log(`convertedCodec: `, convertedCodec);

  return {
    decode: (bytes: Uint8Array) => {
      if (codec.decode != null) {
        return codec.decode(bytes)
      }
      if (convertedCodec.util.deserialize != null) {
        return convertedCodec.util.deserialize(bytes)
      }
      throw new Error('codec does not have a decode function')
    },
    resolve: async (path: string) => {
      // if the codec has util.resolve, use that
      if (codec.util?.resolve) {
        console.log('using codec util resolve')
        return codec.util.resolve(cid, path)
      }
      if (convertedCodec.resolver?.resolve) {
        console.log('using converted codec resolver')
        return convertedCodec.resolver?.resolve(cid.multihash.bytes, path)
      }
      throw new Error('codec does not have a resolve function')
    }
  }
}
