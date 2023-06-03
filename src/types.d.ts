export type { CID } from 'multiformats/cid'

export type CodecType = number
export type NodeData = Uint8Array
export type UnixFsNodeTypes = 'raw' | 'directory' | 'file' | 'metadata' | 'symlink' | 'hamt-sharded-directory'
export type UnixFsNodeDirTypes = 'directory' | 'hamt-sharded-directory'
export type NormalizedDagPbNodeFormat = 'unixfs' | 'non-unixfs'
export type NormalizedDagNodeFormat = NormalizedDagPbNodeFormat | 'unknown'
export interface UnixFsNodeData {
  type: UnixFsNodeTypes
  data: NodeData | undefined
  blockSizes: number[]
}

export interface NormalizedDagLink {
  path: string
  source: string
  target: string
  size: number
  index: number
}

export interface NormalizedDagNode {
  cid: string
  type: CodecType | string
  data: UnixFsNodeData | NodeData | undefined
  links: NormalizedDagLink[]
  size?: number
  format: NormalizedDagNodeFormat
}

export interface ResolveType<DecodedType = any> {
  value: DecodedType
  remainderPath: string
}
