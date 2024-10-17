import { type getHasherForCode } from './lib/hash-importer.js'
import type { TrustlessGatewayBlockBrokerInit } from '@helia/block-brokers'
import type { MultihashDigest } from 'multiformats'

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
  blockSizes: bigint[]
}

export interface UnixFsNodeDataWithNumbers extends Omit<UnixFsNodeData, 'blockSizes'> {
  blockSizes: number[]
}

export interface NormalizedDagLink {
  path: string
  source: string
  target: string
  size: bigint
  index: number
}

export interface NormalizedDagNode {
  cid: string
  type: CodecType | string
  data: UnixFsNodeData | NodeData | undefined
  links: NormalizedDagLink[]
  size?: bigint
  format: NormalizedDagNodeFormat
}

export interface ResolveType<DecodedType = any> {
  value: DecodedType
  remainderPath: string
}

export interface KuboGatewayOptions {
  host: string
  port: string
  protocol?: string
  trustlessBlockBrokerConfig?: {
    init?: TrustlessGatewayBlockBrokerInit
  }

}

export interface DecodedCidMulticodec {
  name: number
  code: string
}
export interface DecodedCidMultihash extends MultihashDigest {
  name: Awaited<ReturnType<typeof getHasherForCode>>['name']
}

export interface dagNodeLink {
  cid: string
  name: string
  size: number
}

export interface dagNodeData {
  blockSizes: unknown[]
  data: unknown
  type: string
}

export interface dagNode {
  data: dagNodeData
  links: dagNodeLink[]
  size: number
}
