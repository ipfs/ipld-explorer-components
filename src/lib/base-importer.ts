import { bases } from 'multiformats/basics'

export default async function baseImporter<T extends string> (prefix: T): Promise<typeof bases[keyof typeof bases]> {
  // handle for CIDv0
  if (prefix === 'Q') {
    return bases.base58btc
  }

  const base = Object.values(bases).find((base) => {
    if (base.prefix === prefix) {
      return true
    }
    return false
  })

  if (base != null) {
    return base
  }

  throw new Error(`unknown multibase prefix '${prefix}'`)
}
