import { type Helia } from '@helia/interface';
import { CID } from 'multiformats';
export declare function ensureLeadingSlash(str: string): string;
export declare function addDagNodeToHelia<T>(helia: Helia, codecName: string, node: T, hasherCode?: number): Promise<CID>;
