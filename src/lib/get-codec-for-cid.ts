import { CID } from 'multiformats'
import multicodecs from 'multicodec'
import { convert } from 'blockcodec-to-ipld-format'
import type { CodecCode } from 'ipld'

interface ResolveType<DecodedType = any> {
  value: DecodedType,
  remainderPath: string
}

interface CodecWrapper<DecodedType = any> {
  decode: (bytes: Uint8Array) => DecodedType,
  resolve: (path: string) => Promise<ResolveType<DecodedType>>,
}

export default async function getCodecForCid (cid: CID): Promise<CodecWrapper> {
  // determine the codec code for the CID
  const codecCode = cid.code
  console.log(`cid.code: `, cid.code);
  if (codecCode === undefined) {
    console.log('codec code for cid is undefined', cid)
  }

  let codec: any;
  const codecName: string = multicodecs.codeToName[codecCode as CodecCode]
  console.log(`codecName: `, codecName);

  // match the codecCode to the codec
  switch (codecCode) {
    case multicodecs.DAG_CBOR:
      codec = await import('@ipld/dag-cbor')
      break;
    case multicodecs.DAG_PB:
      codec = await import('@ipld/dag-pb')
      break;
    case multicodecs.GIT_RAW:
      // @ts-expect-error - no ipld-git types
      codec = (await import('ipld-git')).default
      break;
    case multicodecs.RAW:
      codec = await import('multiformats/codecs/raw')
      break;
    case multicodecs.JSON:
      codec = await import('multiformats/codecs/json')
      break;
    case multicodecs.ETH_ACCOUNT_SNAPSHOT:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-account-snapshot')
      break;
    case multicodecs.ETH_BLOCK:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-block')
      break;
    case multicodecs.ETH_BLOCK_LIST:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-block-list')
      break;
    case multicodecs.ETH_STATE_TRIE:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-state-trie')
      break;
    case multicodecs.ETH_STORAGE_TRIE:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-storage-trie')
      break;
    case multicodecs.ETH_TX:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-tx')
      break;
    case multicodecs.ETH_TX_TRIE:
      // @ts-expect-error - no ipld-ethereum types
      codec = await import('ipld-ethereum/eth-tx-trie')
      break;
    default:
      throw new Error(`unsupported codec: ${codecName} = ${codecCode}`)
  }
  console.log('codec: ', codec)

  const convertedCodec = convert({...codec, code: codecCode, name: codec.name ?? codecName})
  console.log(`convertedCodec: `, convertedCodec);

  return {
    decode: (bytes: Uint8Array) => {
      if (codec.decode != null) {
        return codec.decode(bytes)
      }
      if (codec.util?.deserialize != null) {
        return codec.util.deserialize(bytes)
      }
      if (convertedCodec.util.deserialize != null) {
        return convertedCodec.util.deserialize(bytes)
      }
      throw new Error('codec does not have a decode function')
    },
    resolve: async (path: string) => {
      console.group('codecWrapper.resolve')
      let result: ResolveType | undefined
      // if the codec has util.resolve, use that
      if (codec.util?.resolve) {
        console.log('using codec util resolve')
        const result = codec.util.resolve(cid, path)
      }
      if (convertedCodec.resolver?.resolve) {
        console.log('using converted codec resolver for codec', codec)
        console.log('cid', cid)
        result = convertedCodec.resolver?.resolve(cid.bytes, path)
      }
      console.log(`result: `, result)
      console.groupEnd()
      if (result == null) {
        throw new Error('codec does not have a resolve function')
      }
      return result
    }
  }
}
