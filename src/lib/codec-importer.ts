import multicodecs from 'multicodec'
import { BlockCodec } from 'multiformats/codecs/interface'
import type { PBNode } from '@ipld/dag-pb'
import type { IPLDFormat } from 'blockcodec-to-ipld-format'

export default async function codecImporter<T extends any = unknown>(codecCode: number) {
  // const codecName: string = multicodecs.codeToName[codecCode as CodecCode]
  // console.log(`codecName: `, codecName);
  switch (codecCode) {
    case multicodecs.DAG_CBOR:
      return await import('@ipld/dag-cbor') as BlockCodec<typeof multicodecs.DAG_CBOR, T>
    case multicodecs.DAG_PB:
      return await import('@ipld/dag-pb') as BlockCodec<typeof multicodecs.DAG_PB, PBNode>
    case multicodecs.GIT_RAW:
      // @ts-expect-error - no ipld-git types
      return (await import('ipld-git')).default as BlockCodec<typeof multicodecs.GIT_RAW, T>
    case multicodecs.RAW:
      return await import('multiformats/codecs/raw') as BlockCodec<typeof multicodecs.RAW, Uint8Array>
    case multicodecs.JSON:
      return await import('multiformats/codecs/json') as BlockCodec<typeof multicodecs.JSON, T>
    case multicodecs.ETH_ACCOUNT_SNAPSHOT:
      // @ts-expect-error - no ipld-ethereum types
      return await import('ipld-ethereum/eth-account-snapshot') as BlockCodec<typeof multicodecs.ETH_ACCOUNT_SNAPSHOT, T>
    case multicodecs.ETH_BLOCK:
      // @ts-expect-error - no ipld-ethereum types
      return await import('ipld-ethereum/eth-block') as BlockCodec<typeof multicodecs.ETH_BLOCK, T>
    case multicodecs.ETH_BLOCK_LIST:
      // @ts-expect-error - no ipld-ethereum types
      return await import('ipld-ethereum/eth-block-list') as BlockCodec<typeof multicodecs.ETH_BLOCK_LIST, T>
    case multicodecs.ETH_STATE_TRIE:
      // @ts-expect-error - no ipld-ethereum types
      return await import('ipld-ethereum/eth-state-trie') as BlockCodec<typeof multicodecs.ETH_STATE_TRIE, T>
    case multicodecs.ETH_STORAGE_TRIE:
      // @ts-expect-error - no ipld-ethereum types
      return await import('ipld-ethereum/eth-storage-trie') as BlockCodec<typeof multicodecs.ETH_STORAGE_TRIE, T>
    case multicodecs.ETH_TX:
      // @ts-expect-error - no ipld-ethereum types
      return await import('ipld-ethereum/eth-tx') as BlockCodec<typeof multicodecs.ETH_TX, T>
    case multicodecs.ETH_TX_TRIE:
      // @ts-expect-error - no ipld-ethereum types
      return await import('ipld-ethereum/eth-tx-trie') as BlockCodec<typeof multicodecs.ETH_TX_TRIE, T>
    default:
      throw new Error(`unsupported codec: ${codecCode}`)
  }
}
