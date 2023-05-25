import multicodecs from 'multicodec'
import { BlockCodec } from 'multiformats/codecs/interface'
import type { PBNode } from '@ipld/dag-pb'
import type { IPLDFormat } from 'blockcodec-to-ipld-format'

export default async function codecImporter<T extends any = unknown>(codecCode: number): Promise<BlockCodec<any, any> | IPLDFormat<any>> {
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
      // @ts-ignore - no ipld-ethereum types
      return (await import('ipld-ethereum/eth-block')).default as IPLDFormat<T>
    case multicodecs.ETH_BLOCK_LIST:
      // @ts-ignore - no ipld-ethereum types
      return (await import('ipld-ethereum/eth-block-list')).default as IPLDFormat<T>
    case multicodecs.ETH_STATE_TRIE:
      // @ts-ignore - no ipld-ethereum types
      return (await import('ipld-ethereum/eth-state-trie')).default as IPLDFormat<T>
    case multicodecs.ETH_STORAGE_TRIE:
      // @ts-ignore - no ipld-ethereum types
      return (await import('ipld-ethereum/eth-storage-trie')).default as IPLDFormat<T>
    case multicodecs.ETH_TX:
      // @ts-ignore - no ipld-ethereum types
      return (await import('ipld-ethereum/eth-tx')).default as IPLDFormat<T>
    case multicodecs.ETH_TX_TRIE:
      // @ts-ignore - no ipld-ethereum types
      return (await import('ipld-ethereum/eth-tx-trie')).default as IPLDFormat<T>
    default:
      // @ts-expect-error - CodecCode & multicodecs.codeToName typings are borked.
      const codecName: string = multicodecs.codeToName[codecCode as CodecCode]
      throw new Error(`unsupported codec: ${codecCode}=${codecName}`)
  }
}
