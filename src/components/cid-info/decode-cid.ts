import { type CID } from 'multiformats'
import baseImporter from '../../lib/base-importer'
import { toCidOrNull } from '../../lib/cid.js'
import { getHasherForCode } from '../../lib/hash-importer'
import type { DecodedCidMultihash, DecodedCidMulticodec } from '../../types.js'

export interface DecodedCid {
  cid: CID
  multibase: Awaited<ReturnType<typeof baseImporter>>
  multicodec: DecodedCidMulticodec
  multihash: DecodedCidMultihash
}

export async function decodeCid (value: string | CID): Promise<DecodedCid | undefined> {
  const cid = toCidOrNull(value)
  try {
    if (cid == null) {
      throw new Error(`Failed to parse CID from value '${value}'`)
    }
    const multihasher = await getHasherForCode(cid.multihash.code)
    const multibase = await baseImporter(cid.toString().substring(0, 1))
    const multicodecName = cid.code
    let multicodecCode
    if (cid.version === 0) {
      multicodecCode = 'implicit'
    } else {
      multicodecCode = `0x${cid.code.toString(16)}`
    }

    return {
      cid,
      multibase,
      multicodec: {
        name: multicodecName,
        code: multicodecCode
      },
      multihash: {
        name: multihasher.name,
        ...cid.multihash
      }
    }
  } catch (err) {
    console.error('Failed to decode CID', err)
  }
}
