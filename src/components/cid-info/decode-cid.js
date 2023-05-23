import { CID } from 'multiformats'
import hashImporter from '../../lib/hash-importer'
import baseImporter from '../../lib/base-importer'

export async function decodeCid (value) {
  const cid = CID.parse(value)
  // console.log(`cid: `, cid);
  if (cid.version === 0) {
    return await decodeCidV0(value, cid)
  }
  if (cid.version === 1) {
    return await decodeCidV1(value, cid)
  }
  throw new Error('Unknown CID version', cid.version, cid)
}

// cidv0 ::= <multihash-content-address>
// QmRds34t1KFiatDY6yJFj8U9VPTLvSMsR63y7qdUV3RMmT
export async function decodeCidV0 (value, cid) {
  const multihasher = await hashImporter(cid.multihash.code)

  const multibase = await baseImporter(value.substring(0, 1))
  return {
    cid,
    multibase,
    multicodec: {
      name: cid.code,
      code: 'implicit'
    },
    multihash: {
      name: multihasher.name,
      ...cid.multihash
    }
  }
}

// <cidv1> ::= <multibase-prefix><cid-version><multicodec-content-type><multihash-content-address>
// zb2rhiVd5G2DSpnbYtty8NhYHeDvNkPxjSqA7YbDPuhdihj9L
export async function decodeCidV1 (value, cid) {
  const multihasher = await hashImporter(cid.multihash.code)
  const multibase = await baseImporter(value.substring(0, 1))

    console.log(`cid.code.toString(16): `, cid.code.toString(16));
  return {
    cid,
    multibase,
    multicodec: {
      name: cid.code,
      code: '0x' + cid.code.toString(16)
    },
    multihash: {
      name: multihasher.name,
      ...cid.multihash
    }
  }
}
