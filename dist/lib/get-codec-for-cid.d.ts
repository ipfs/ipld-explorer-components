import { CID } from 'multiformats';
import type { ResolveType } from '../types';
interface CodecWrapper<DecodedType = any> {
    decode(bytes: Uint8Array): DecodedType;
    resolve(path: string, bytes: Uint8Array): Promise<ResolveType<DecodedType>>;
}
export default function getCodecForCid(cid: CID): Promise<CodecWrapper>;
export {};
