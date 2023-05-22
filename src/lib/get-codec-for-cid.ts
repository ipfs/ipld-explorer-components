import { CID } from 'multiformats'
import multicodecs from 'multicodec'
import { convert } from 'blockcodec-to-ipld-format'
import type { CodecCode } from 'ipld'
import * as mh from 'multiformats/hashes/digest'
import codecImporter from './codec-importer'
import { UnixFS } from 'ipfs-unixfs'
import type { PBLink } from '@ipld/dag-pb'
import { getRawBlock } from './get-raw-block'


interface ResolveType<DecodedType = any> {
  value: DecodedType,
  remainderPath: string
}

interface CodecWrapper<DecodedType = any> {
  decode: (bytes: Uint8Array) => DecodedType,
  resolve: (path: string) => Promise<ResolveType<DecodedType>>,
}

const pbLinkToPbNode = async (link: PBLink, codec: typeof import('@ipld/dag-pb')) => {
  try {
    // first, we need to fetch the content of the link via link.Hash
    // then, we need to decode the content of the link
    const linkCid = link.Hash
    const linkBytes = await getRawBlock

    // console.log(`UnixFS.unmarshal(link.Hash['/']): `, UnixFS.unmarshal(link.Hash['/']));
    // console.log('link value', codec.decode(link.Hash['/']))
  } catch (err) {
    console.error('error decoding link', err)
  }
}

const codecResolverMap: Record<string, any> = {
  // [multicodecs.DAG_CBOR]: (cid: CID, path: string, codec: typeof import('@ipld/dag-cbor')) => {

  // },
  [multicodecs.DAG_PB]: async (cid: CID, node: any, path: string, codec: typeof import('@ipld/dag-pb'), decodeFn: any) => {
    const pathSegments = path.split('/')
    const firstPathSegment = pathSegments.splice(1, 1)[0]
    let remainderPath = pathSegments.join('/')
    // sha256.sha256.digest(cid.multihash.digest)
    // console.log('decodeFn(cid.multihash.digest): ', mh.decode(cid.multihash.bytes));
    const link = node.Links.find((link: any) => link.Name === firstPathSegment)

    let value = node
    if (link) {
        value = link
    } else {
      // we didn't find a link, add the firstPathSegment back to remainderPath.
      remainderPath = [firstPathSegment, ...pathSegments].join('/').replace('//', '/')
    }

    return {
      value,
      remainderPath
    }

  },
}

export default async function getCodecForCid (cid: CID): Promise<CodecWrapper> {
  // determine the codec code for the CID
  const codecCode = cid.code
  console.log(`cid.code: `, cid.code);
  if (codecCode === undefined) {
    // console.warn('codec code for cid is undefined', cid)
    console.warn('codec code for cid is undefined', cid)
    throw new Error('codec code for cid is undefined')
  }

  const codecName: string = multicodecs.codeToName[codecCode as CodecCode]
  const codec = await codecImporter(codecCode);
  console.log(`codecName: `, codecName);

  // match the codecCode to the codec

  console.log('codec: ', codec)

  const convertedCodec = convert({...codec, code: codecCode, name: codec.name ?? codecName})
  console.log(`convertedCodec: `, convertedCodec);
  const decode = (bytes: Uint8Array) => {
    if (codec.decode != null) {
      return codec.decode(bytes)
    }
    // if (codec.util?.deserialize != null) {
    //   return codec.util.deserialize(bytes)
    // }
    if (convertedCodec.util.deserialize != null) {
      return convertedCodec.util.deserialize(bytes)
    }
    throw new Error('codec does not have a decode function')
  }
  return {
    decode,
    resolve: async (path: string, bytes?: any) => {
      console.log('codecWrapper.resolving for %s at path %s', cid.toString(), path)
      // debugger;
      let result: ResolveType | undefined
      // if the codec has util.resolve, use that
      if (codec.util?.resolve) {
        console.log('using codec util resolve')
        result = codec.util.resolve(cid, path)
        return result as ResolveType
      }
      if (codecResolverMap[codecCode]) {
        console.log('using codecResolverMap')
        result = await codecResolverMap[codecCode](cid, decode(bytes), path, codec, decode)
        console.log(`codecResolverMap result: `, result);
        return result as ResolveType
      }
      if (convertedCodec.resolver?.resolve) {
        console.log('using converted codec resolver for codec', codec)
        console.log('cid', cid)
        try {
          console.log(`codec: `, codec);
          const resolveBytes = bytes ? convertedCodec.util.serialize(bytes) : cid.multihash.digest

          result = convertedCodec.resolver?.resolve(resolveBytes, path)
          return result as ResolveType
        } catch (err) {
          console.error('error resolving path for cid', cid, path)
          throw err
        }
      }
      console.log(`result: `, result)
      // console.groupEnd()
      if (result == null) {
        throw new Error('codec does not have a resolve function')
      }
      return result
    }
  }
}
