import type { PBLink, PBNode } from '@ipld/dag-pb';
export declare function isNotNullish<T>(value: T): value is NonNullable<T>;
export declare function isPBNode(value: unknown): value is PBNode;
export declare function isPBLink(value: unknown): value is PBLink;
