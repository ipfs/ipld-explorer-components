import type { PBNode } from '@ipld/dag-pb'
import multicodecs from 'multicodec'
import { type BlockCodec } from 'multiformats/codecs/interface'

type CodecDataTypes = PBNode | Uint8Array
interface CodecImporterResponse<T> extends Pick<BlockCodec<number, T | unknown>, 'decode'> {
}

export default async function codecImporter<T extends CodecDataTypes = CodecDataTypes> (codecCode: number): Promise<CodecImporterResponse<T>> {
  // @ts-expect-error - CodecCode & multicodecs.codeToName typings are borked.
  const codecName: string = multicodecs.codeToName[codecCode as CodecCode]
  switch (codecCode) {
    case multicodecs.DAG_CBOR:
      return import('@ipld/dag-cbor')
    case multicodecs.DAG_PB:
      // @ts-expect-error - return types need normalizing
      return await import('@ipld/dag-pb') satisfies BlockCodec<typeof multicodecs.DAG_PB, PBNode>
    case multicodecs.GIT_RAW:
      return {
        decode: (await import('ipld-git')).util.deserialize
      }
    case multicodecs.RAW:
      // @ts-expect-error - return types need normalizing
      return await import('multiformats/codecs/raw') satisfies BlockCodec<typeof multicodecs.RAW, Uint8Array>
    case multicodecs.JSON:
      return await import('multiformats/codecs/json') satisfies BlockCodec<typeof multicodecs.JSON, T>
    case multicodecs.DAG_JSON:
      return await import('@ipld/dag-json') satisfies BlockCodec<typeof multicodecs.DAG_JSON, T>
    default:
      throw new Error(`unsupported codec: ${codecCode}=${codecName}`)
  }
}
