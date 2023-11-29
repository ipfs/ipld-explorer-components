import type { PBNode } from '@ipld/dag-pb'
import { type BlockCodec } from 'multiformats/codecs/interface'

import getCodecNameFromCode from './get-codec-name-from-code'

type CodecDataTypes = PBNode | Uint8Array
interface CodecImporterResponse<T> extends Pick<BlockCodec<number, T | unknown>, 'decode'> {
}

export default async function codecImporter<T extends CodecDataTypes = CodecDataTypes> (codeOrName: number | string): Promise<CodecImporterResponse<T>> {
  let codecName: string
  if (typeof codeOrName === 'string') {
    codecName = codeOrName
  } else {
    codecName = getCodecNameFromCode(codeOrName)
  }

  switch (codecName) {
    case 'dag-cbor':
      return import('@ipld/dag-cbor')
    case 'dag-pb':
      return import('@ipld/dag-pb')
    case 'git-raw':
      throw new Error('git-raw is unsupported until https://github.com/ipld/js-ipld-git is updated.')
    case 'raw':
      return import('multiformats/codecs/raw')
    case 'json':
      return import('multiformats/codecs/json')
    case 'dag-json':
      return import('@ipld/dag-json')
    case 'dag-jose':
      return {
        decode: (await import('dag-jose')).decode as unknown as
          ((bytes: Uint8Array) => Promise<unknown>)
      }
    default:
      throw new Error(`unsupported codec: ${codeOrName}=${codecName}`)
  }
}
