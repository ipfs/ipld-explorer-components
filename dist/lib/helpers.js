import { CID } from 'multiformats';
import codecImporter from './codec-importer.js';
import { getHasherForCode } from './hash-importer.js';
export function ensureLeadingSlash(str) {
  if (str.startsWith('/')) return str;
  return `/${str}`;
}
export async function addDagNodeToHelia(helia, codecName, node) {
  let hasherCode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 18;
  const codec = await codecImporter(codecName);
  const hasher = await getHasherForCode(hasherCode);
  const encodedNode = codec.encode(node);
  const mhDigest = await hasher.digest(encodedNode);
  const cid = CID.createV1(codec.code, mhDigest);
  return helia.blockstore.put(cid, encodedNode);
}