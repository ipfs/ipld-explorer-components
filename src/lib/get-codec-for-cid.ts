import { CID } from 'multiformats'
import multicodecs from 'multicodec'
import { convert } from 'blockcodec-to-ipld-format'
import type { CodecCode } from 'ipld'
import codecImporter from './codec-importer'


interface ResolveType<DecodedType = any> {
  value: DecodedType,
  remainderPath: string
}

interface CodecWrapper<DecodedType = any> {
  decode: (bytes: Uint8Array) => DecodedType,
  resolve: (path: string) => Promise<ResolveType<DecodedType>>,
}

interface DecodeFn<T = any> {
  (bytes: Uint8Array): T
}


/**
 * Resolve a path in a decoded object
 *
 * @see https://github.com/ipld/js-blockcodec-to-ipld-format/blob/13ad9bc518e232527078e27f0807ad3392b33698/src/index.js#L38-L55
 * @param decodeFn
 * @returns
 */
const resolveFn = (decodeFn: DecodeFn) => (buf: Uint8Array, path: string): ResolveType => {
  let value = decodeFn(buf)
  const entries = path.split('/').filter(x => x)

  while (entries.length) {
    // @ts-ignore
    value = value[/** @type {string} */(entries.shift())]
    if (typeof value === 'undefined') {
      throw new Error('Not found')
    }

    if (CID.asCID(value)) {
      return { value, remainderPath: entries.join('/') }
    }
  }

  return { value, remainderPath: '' }
}

const codecResolverMap: Record<string, any> = {
  [multicodecs.DAG_PB]: async (node: any, path: string, codec: typeof import('@ipld/dag-pb')) => {
    const pathSegments = path.split('/')
    let firstPathSegment = pathSegments.splice(1, 1)[0]
    if (firstPathSegment === 'Links') {
      firstPathSegment = `${firstPathSegment}/${pathSegments.splice(1, 1)[0]}`
    }
    let remainderPath = pathSegments.join('/')

    let link = node.Links.find((link: any) => link.Name === firstPathSegment)
    if (!link && firstPathSegment.includes('Links')) {
      const linkIndex = Number(firstPathSegment.split('/')[1])
      link = node.Links[linkIndex]
    }

    let value = node
    if (link) {
        value = link
    } else {
      // we didn't find a link, add the firstPathSegment back to remainderPath.
      remainderPath = [firstPathSegment, ...pathSegments].join('/').replace('//', '/')
    }
    console.log(`remainderPath: `, remainderPath);

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
    if (codec.util?.deserialize != null) {
      return codec.util.deserialize(bytes)
    }
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
        result = await codecResolverMap[codecCode](decode(bytes), path)
        console.log(`codecResolverMap result: `, result);
        return result as ResolveType
      }
      try {
        const resolverFn = resolveFn(decode)
        return resolverFn(bytes, path)
      } catch (err) {
        console.error('error resolving path for cid with resolveFn', cid, path)
        // throw err
      }
      // if (convertedCodec.resolver?.resolve) {
      //   console.log('using converted codec resolver for codec', codec)
      //   console.log('cid', cid)
      //   try {
      //     console.log(`codec: `, codec);
      //     const value = decode(bytes)
      //     console.log(`value: `, value);
      //     console.log(`path: `, path);
      //     // const resolveBytes = bytes ? convertedCodec.util.serialize(bytes) : cid.multihash.digest
      //     debugger;
      //     result = convertedCodec.resolver?.resolve(bytes, path ?? '/')
      //     return result as ResolveType
      //   } catch (err) {
      //     console.error('error resolving path for cid', cid, path)
      //     throw err
      //   }
      // }
      console.log(`result: `, result)
      // console.groupEnd()
      if (result == null) {
        throw new Error('codec does not have a resolve function')
      }
      return result
    }
  }
}
