/**
 * @template {string} Prefix
 * @param {any} value
 * @param {import('multiformats/bases/interface').MultibaseDecoder<Prefix>} [base]
 * @returns
 */
export function toCidOrNull<Prefix extends string>(value: any, base?: import("multiformats/cid").MultibaseDecoder<Prefix> | undefined): CID<unknown, number, number, import("multiformats/cid").Version> | null;
/**
 * This function is deprecated, use `getCodeOrNull` instead.
 *
 * `cid.codec` is deprecated, use integer "code" property instead
 *
 * @param {any} value
 * @returns {string}
 * @deprecated
 */
export function getCodecOrNull(value: any): string;
export function getCodeOrNull(value: any): number | null;
export function toCidStrOrNull(value: any): string | null;
import { CID } from 'multiformats/cid';
