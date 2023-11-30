import { type CID } from 'multiformats';
interface ExtractedInfo {
    base: string;
    codecName: string;
    hashFn: string;
    hashFnCode: string;
    hashLengthCode: number;
    hashLengthInBits: number;
    hashValue: string;
    hashValueIn32CharChunks: string[][];
    humanReadable: string;
}
export default function extractInfo(cid: CID): Promise<ExtractedInfo>;
export {};
