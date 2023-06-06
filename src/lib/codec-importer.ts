import type { PBNode } from '@ipld/dag-pb'
import { type BlockCodec } from 'multiformats/codecs/interface'

import getCodecNameFromCode from './get-codec-name-from-code'

type CodecDataTypes = PBNode | Uint8Array
interface CodecImporterResponse<T> extends Pick<BlockCodec<number, T | unknown>, 'decode'> {
}

export default async function codecImporter<T extends CodecDataTypes = CodecDataTypes> (codecCode: number): Promise<CodecImporterResponse<T>> {
  const codecName = getCodecNameFromCode(codecCode)
  switch (codecName) {
    case 'dag-cbor':
      return import('@ipld/dag-cbor')
    case 'dag-pb':
      // @ts-expect-error - return types need normalizing
      return import('@ipld/dag-pb')
    case 'git-raw':
      return {
        decode: (await import('ipld-git')).default.util.deserialize
      }
    case 'raw':
      // @ts-expect-error - return types need normalizing
      return import('multiformats/codecs/raw')
    case 'json':
      return import('multiformats/codecs/json')
    case 'dag-json':
      return import('@ipld/dag-json')
    default:
      throw new Error(`unsupported codec: ${codecCode}=${getCodecNameFromCode(codecCode)}`)
  }
}
