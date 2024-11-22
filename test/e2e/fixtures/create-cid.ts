import { CID } from 'multiformats/cid'
import { type BlockEncoder, type MultihashHasher, type Version } from 'multiformats/interface'

export const createCID = async <T extends number>(value: any, codec: BlockEncoder<T, any>, hasher: MultihashHasher<T>, version: Version = 1): Promise<CID> => {
  try {
    const digest = await hasher.digest(codec.encode(value))
    return CID.create(version, codec.code, digest)
  } catch (err) {
    console.error('Failed to create CID', value, err)
    throw err
  }
}
