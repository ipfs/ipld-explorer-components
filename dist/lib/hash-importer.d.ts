import { type Hasher } from 'multiformats/hashes/hasher';
import * as sha2 from 'multiformats/hashes/sha2';
export type SupportedHashers = typeof sha2.sha256 | typeof sha2.sha512 | Hasher<'keccak-256', 27> | Hasher<'sha1', 17> | Hasher<'blake2b-512', 45632> | Hasher<'sha3-512', 20> | Hasher<'blake3', 30>;
export declare function getHashersForCodes(code: number, ...codes: number[]): Promise<SupportedHashers[]>;
export declare function getHasherForCode(code: number): Promise<SupportedHashers>;
