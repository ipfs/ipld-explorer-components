import getCodecNameFromCode from './get-codec-name-from-code';
import { decodeCid } from '../components/cid-info/decode-cid';
const toHex = bytes => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('hex').toUpperCase();
export default async function extractInfo(cid) {
  const cidInfo = await decodeCid(cid);
  if (cidInfo == null) {
    throw new Error(`CID could not be decoded for CID '${cid.toString()}'`);
  }
  const hashFn = cidInfo.multihash.name;
  const hashFnCode = cidInfo.multihash.code.toString(16);
  const hashLengthCode = cidInfo.multihash.size;
  const hashLengthInBits = cidInfo.multihash.size * 8;
  const hashValue = toHex(cidInfo.multihash.digest);
  const hashValueIn32CharChunks = hashValue.split('').reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 32);
    if (resultArray[chunkIndex] == null) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  const codecName = getCodecNameFromCode(cidInfo.cid.code);
  const humanReadable = `${cidInfo.multibase.name} - cidv${cidInfo.cid.version} - ${codecName} - ${hashFn}~${hashLengthInBits}~${hashValue}`;
  return {
    base: cidInfo.multibase.name,
    codecName,
    hashFn,
    hashFnCode,
    hashLengthCode,
    hashLengthInBits,
    hashValue,
    hashValueIn32CharChunks,
    humanReadable
  };
}