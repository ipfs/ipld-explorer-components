
import type { PBLink } from '@ipld/dag-pb'
export type { CID } from 'multiformats/cid'

export type CodecType = number;
export type NodeData = string | any;
export type UnixFsNodeTypes = 'raw' | 'directory' | 'file' | 'metadata' | 'symlink' | 'hamt-sharded-directory'
export type UnixFsNodeDirTypes = 'directory' | 'hamt-sharded-directory'
export type NormalizedDagPbNodeFormat = 'unixfs' | 'unknown'
export interface UnixFsNodeData {
  type: UnixFsNodeTypes;
  data: NodeData;
  blockSizes: number[];
}

// /**
//  * @typedef {object} NormalizedDagLink
//  * @property {string} path
//  * @property {string} source
//  * @property {string} target
//  * @property {number} size
//  * @property {number} index
//  */
export interface NormalizedDagLink {
  path: string;
  source: string;
  target: string;
  size: number;
  index: number;
}

// /**
//  * @typedef {object} NormalizedDagNode
//  * @property {string} cid
//  * @property {CodecType} type
//  * @property {UnixFsNodeData | NodeData} data
//  * @property {NormalizedDagLink[]} links
//  * @property {number} size
//  * @property {NormalizedDagPbNodeFormat} format
//  */
export interface NormalizedDagNode {
  cid: string;
  type: CodecType;
  data: UnixFsNodeData | NodeData;
  links: NormalizedDagLink[];
  size: number;
  format: NormalizedDagPbNodeFormat;
}
// /**
//  * @typedef {object} NormalizedDagPbNode
//  * @property {string} cid
//  * @property {CodecType} type
//  * @property {UnixFsNodeData | NodeData} data
//  * @property {NormalizedDagLink[]} links
//  * @property {number} size
//  * @property {NormalizedDagPbNodeFormat} format
//  */
export interface NormalizedDagPbNode {
  cid: string;
  type: CodecType;
  data: UnixFsNodeData | NodeData;
  links: NormalizedDagLink[];
  size: number;
  format: NormalizedDagPbNodeFormat;
}

// /**
//  *
//  * @typedef {object} NormalizedDagNodeAsJson
//  * @property {NodeTypes} type
//  * @property {number} size
//  * @property {NodeData} data
//  * @property {NormalizedDagLink[]} links
//  */
export interface NormalizedDagNodeAsJson {
  type: UnixFsNodeTypes;
  size: number;
  data: NodeData;
  links: NormalizedDagLink[];
}

// /**
//  *
//  * @typedef {object} DagPbNodeAsJson
//  * @property {NodeTypes} type
//  * @property {number} size
//  * @property {NodeData} data
//  * @property {import('@ipld/dag-pb').PBLink[]} links
//  * @returns
//  */

export interface DagPbNodeAsJson {
  type: UnixFsNodeTypes | UnixFsNodeDirTypes | 'unknown';
  size: number;
  data: NodeData;
  links: PBLink[]
}

export interface DagPbRawValue {
  Data: Uint8Array;
  Links: PBLink[];
}
