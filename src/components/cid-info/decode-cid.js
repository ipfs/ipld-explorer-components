import { CID } from 'multiformats'

import baseImporter from '../../lib/base-importer'
import hashImporter from '../../lib/hash-importer'

export async function decodeCid (value) {
  const cid = CID.parse(value)
  try {
    const multihasher = await hashImporter(cid.multihash.code)
    const multibase = await baseImporter(value.substring(0, 1))
    const multicodec = {
      name: cid.code
    }
    if (cid.version === 0) {
      multicodec.code = 'implicit'
    } else if (cid.version >= 1) {
      multicodec.code = `0x${cid.code.toString(16)}`
    }

    return {
      cid,
      multibase,
      multicodec,
      multihash: {
        name: multihasher.name,
        ...cid.multihash
      }
    }
  } catch (err) {
    console.error('Failed to decode CID', err)
  }
}
