// @ts-expect-error - borked types
import { bases } from 'multiformats/basics'

export default async function baseImporter<T extends string> (prefix: T) {
  console.log(`bases: `, bases);
  for (const base in bases) {
    const multibase = bases[base];
    if (multibase.prefix === prefix) {
      return multibase;
    }
  }
  // handle for CIDv0
  if (prefix === 'Q') {
    return bases.base58btc;
  }

  throw new Error(`unknown multibase prefix '${prefix}'`)
}
