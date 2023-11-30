import type { PBNode } from '@ipld/dag-pb';
import { type BlockCodec } from 'multiformats/codecs/interface';
type CodecDataTypes = PBNode | Uint8Array;
interface CodecImporterResponse<T> extends Pick<BlockCodec<number, T | unknown>, 'decode' | 'encode' | 'code'> {
}
export default function codecImporter<T extends CodecDataTypes = CodecDataTypes>(codeOrName: number | string): Promise<CodecImporterResponse<T>>;
export {};
