import type { PBLink, PBNode } from '@ipld/dag-pb'
import type { CodecCode } from 'ipld'
import multicodecs from 'multicodec'
import { CID } from 'multiformats'

import codecImporter from './codec-importer.js'
import { isPBNode } from './guards'
import { ensureLeadingSlash } from './helpers'
import type { ResolveType } from '../types'

interface CodecWrapper<DecodedType = any> {
  decode: (bytes: Uint8Array) => DecodedType
  resolve: (path: string, bytes: Uint8Array) => Promise<ResolveType<DecodedType>>
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

  while (entries.length > 0) {
    const entry = entries.shift()
    if (entry == null) {
      throw new Error('Not found')
    }
    value = value[entry]
    if (typeof value === 'undefined') {
      throw new Error('Not found')
    }

    if (CID.asCID(value) != null) {
      const remainderPath = entries.length > 0 ? ensureLeadingSlash(entries.join('/')) : ''
      return { value, remainderPath }
    }
  }

  return { value, remainderPath: '' }
}

interface CodecResolverFn {
  (node: PBNode | unknown, path: string): Promise<ResolveType<PBNode | PBLink>>
}

const codecResolverMap: Record<string, CodecResolverFn> = {
  [multicodecs.DAG_PB]: async (node, path) => {
    if (!isPBNode(node)) {
      throw new Error('node is not a PBNode')
    }
    const pathSegments = path.split('/')
    let firstPathSegment = pathSegments.splice(1, 1)[0]
    if (firstPathSegment === 'Links') {
      firstPathSegment = `${firstPathSegment}/${pathSegments.splice(1, 1)[0]}`
    }
    let remainderPath = pathSegments.join('/')

    let link = node.Links.find((link: PBLink) => link.Name === firstPathSegment)
    if ((link == null) && firstPathSegment?.includes('Links')) {
      const linkIndex = Number(firstPathSegment.split('/')[1])
      link = node.Links[linkIndex]
    }

    let value = node as PBNode | PBLink
    if (link != null) {
      value = link
    } else {
      // we didn't find a link, add the firstPathSegment back to remainderPath.
      remainderPath = [firstPathSegment, ...pathSegments].join('/').replace('//', '/')
    }

    return {
      value,
      remainderPath
    }
  }
}

export default async function getCodecForCid (cid: CID): Promise<CodecWrapper> {
  // determine the codec code for the CID
  const codecCode = cid.code
  if (codecCode === undefined) {
    throw new Error(`CID codec code is undefined for CID '${cid.toString()}'`)
  }

  const codecName: string = multicodecs.codeToName[codecCode as CodecCode]
  const codec = await codecImporter(codecCode)

  const decode = (bytes: Uint8Array): unknown => {
    if (codec.decode != null) {
      return codec.decode(bytes)
    }

    throw new Error(`codec ${codecCode}=${codecName} does not have a decode function`)
  }

  return {
    decode,
    resolve: async (path: string, bytes: Uint8Array) => {
      if (codecResolverMap[codecCode] != null) {
        try {
          return await codecResolverMap[codecCode](decode(bytes), path)
        } catch (err) {
          console.error(err)
          console.error('error resolving path for cid with codecResolverMap', cid, path)
          // allow the resolver to fail and fall through to the next resolver
        }
      }
      try {
        const resolverFn = resolveFn(decode)
        return resolverFn(bytes, path)
      } catch (err) {
        console.error('error resolving path for cid with resolveFn', cid, path)
      }

      throw new Error(`codec ${codecCode}=${codecName} does not have a resolve function`)
    }
  }
}
