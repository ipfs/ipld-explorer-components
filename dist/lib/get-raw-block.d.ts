import type { Helia } from '@helia/interface';
import { type CID } from 'multiformats';
/**
 * Method for getting a raw block either with helia from trustless gateways or a local Kubo gateway.
 */
export declare function getRawBlock(helia: Helia, cid: CID, timeout?: number): Promise<Uint8Array>;
