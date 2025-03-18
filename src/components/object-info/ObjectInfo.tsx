import { partial } from 'filesize'
import theme from 'ipfs-css/theme.json'
import { CID } from 'multiformats'
import React, { type HTMLProps } from 'react'
import { useTranslation } from 'react-i18next'
import { ObjectInspector, chromeLight } from 'react-inspector'
import getCodecNameFromCode from '../../lib/get-codec-name-from-code'
import { type NormalizedDagNode, type UnixFsNodeDataWithNumbers } from '../../types.js'
import LargeLinksTable, { type LinkObject, type LargeLinksTableProps } from './links-table'

const humansize = partial({ round: 0 })

const objectInspectorTheme = {
  ...chromeLight,
  BASE_FONT_FAMILY: 'Consolas, Menlo, monospace',
  TREENODE_FONT_FAMILY: 'Consolas, Menlo, monospace',
  BASE_FONT_SIZE: '13px',
  BASE_LINE_HEIGHT: '19px',
  TREENODE_FONT_SIZE: '13px',
  TREENODE_LINE_HEIGHT: '19px'
}

// Use https://github.com/multiformats/multicodec/blob/master/table.csv to get full name.
const nodeStyles = {
  // most-common
  'dag-cbor': { shortName: 'DAG-CBOR', name: 'dag-cbor', color: theme.colors.aqua },
  'dag-json': { shortName: 'DAG-JSON', name: 'dag-json', color: theme.colors.green },
  raw: { shortName: 'RAW', name: 'Raw Block', color: theme.colors.red }, // red because it's special
  'dag-pb': { shortName: 'DAG-PB', name: 'dag-pb', color: theme.colors.teal },

  // exciting
  'dag-jose': { shortName: 'DAG-JOSE', name: 'dag-jose', color: theme.colors.yellow },

  // less common
  json: { shortName: 'JSON', name: 'JSON', color: theme.colors['green-muted'] },
  'hamt-sharded-directory': { shortName: 'HAMT\nDAG-PB', name: 'HAMT-Sharded dag-pb Directory', color: theme.colors['teal-muted'] },

  // rare
  'eth-block': { shortName: 'ETH', name: 'Ethereum Block', color: theme.colors.charcoal },
  'eth-block-list': { shortName: 'ETH', name: 'Ethereum Block List', color: theme.colors.charcoal },
  'eth-tx-trie': { shortName: 'ETH', name: 'Ethereum Tx Trie', color: theme.colors.charcoal },
  'eth-tx': { shortName: 'ETH', name: 'Ethereum Tx', color: theme.colors.charcoal },
  'eth-state-trie': { shortName: 'ETH', name: 'Ethereum State Trie', color: theme.colors.charcoal },

  // fallback
  unknown: { shortName: 'DAG', name: 'DAG Node', color: theme.colors.red }
}

export type NodeStyle = keyof typeof nodeStyles

export function shortNameForNode (type: NodeStyle = 'unknown'): string {
  const style = nodeStyles[type]
  return style?.shortName ?? 'DAG'
}

export function nameForNode (type: NodeStyle = 'unknown'): string {
  const style = nodeStyles[type]
  return style?.name ?? 'DAG Node'
}

export function colorForNode (type: NodeStyle = 'unknown'): string {
  const style = nodeStyles[type]
  return style?.color ?? '#ea5037'
}

// '/a/b' => ['$', '$.a', '$.a.b']
// See: https://github.com/xyc/react-inspector#api
export function toExpandPathsNotation (localPath: string): string[] {
  if (localPath == null) return []
  const parts = localPath.split('/')
  const expandPaths = parts.map((part: any, i: any) => {
    if (part == null) return '$'
    const relPath = parts.slice(0, i).join('.')
    return `$${relPath}.${part}`
  })
  return expandPaths.slice(0, expandPaths.length - 1)
}

interface DagNodeIconProps extends React.HTMLProps<SVGSVGElement>, React.SVGProps<SVGSVGElement> {
  type: NodeStyle
}

const DagNodeIcon: React.FC<DagNodeIconProps> = ({ type, ...props }) => (
  <svg {...props} data-title={nameForNode(type)} width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='15' cy='15' r='15' fillRule='evenodd' fill={colorForNode(type)} />
  </svg>
)

/**
 * replace bigint or other non-JSON-serializable values with appropriate values for the react-inspector
 * Note that data for some blocks (e.g. bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq) currently do not
 * look like NormalizedDagNode['data']
 */
const getObjectInspectorData = (data?: NormalizedDagNode['data']): NormalizedDagNode['data'] | UnixFsNodeDataWithNumbers => {
  if (data == null || data instanceof Uint8Array || data.blockSizes == null) {
    return data
  }

  return {
    ...data,
    blockSizes: data.blockSizes.map(Number)
  }
}

export interface ObjectInfoProps extends Omit<HTMLProps<HTMLElement>, 'data' | 'size' | 'type'> {
  className: string
  type: string | number
  cid: string
  localPath: string
  size: bigint | undefined
  data: NormalizedDagNode['data']
  links: LinkObject[]
  format: string
  onLinkClick: LargeLinksTableProps['onLinkClick']
  gatewayUrl: string
  publicGatewayUrl: string
}

// eslint-disable-next-line complexity
export const ObjectInfo: React.FC<ObjectInfoProps> = ({ className, type, cid, localPath, size, data, links, format, onLinkClick, gatewayUrl, publicGatewayUrl, ...props }) => {
  const { t, ready: tReady } = useTranslation('explore')
  if (!tReady) return null
  const isUnixFs = format === 'unixfs' && !(data instanceof Uint8Array) && data?.type != null && ['directory', 'file'].some(x => x === data.type)
  // TODO: we are piping up various codec codes, types, and strings as the type prop, we need to fix it.
  let nodeStyleType: NodeStyle = type as NodeStyle

  // if (!isNaN(type) || isUnixFs || nameForNode(type) === 'DAG Node') {
  if (isUnixFs || nameForNode(nodeStyleType) === 'DAG Node') {
    nodeStyleType = getCodecNameFromCode(CID.parse(cid).code) ?? type
  }

  return (
    <section className={`pa4 sans-serif ${className}`} {...props}>
      <h2 className='ma0 lh-title f4 fw4 montserrat pb2' title={nodeStyleType}>
        <DagNodeIcon type={nodeStyleType} className='mr3' style={{ verticalAlign: -8 }} />
        <span className='v-mid'>
          {nameForNode(nodeStyleType)}
        </span>
        {format === 'unixfs'
          ? (
          <a className='dn di-ns no-underline charcoal ml2' href='https://docs.ipfs.io/concepts/glossary/#unixfs' rel='external' target='_external'>UnixFS</a>
            )
          : null}
        {isUnixFs
          ? (
          <span className='dib'>
            {gatewayUrl != null && gatewayUrl !== publicGatewayUrl && (
              <a className='no-underline avenir ml2 pa2 fw5 f6 navy dib' href={`${gatewayUrl}/ipfs/${cid}`} rel='external nofollow' target='_external'>
                {t('ObjectInfo.privateGateway')}
              </a>)}
            {publicGatewayUrl != null && (
              <a className='no-underline avenir ml2 pa2 fw5 f6 navy dib' href={`${publicGatewayUrl}/ipfs/${cid}`} rel='external nofollow' target='_external'>
                {t('ObjectInfo.publicGateway')}
              </a>)}
          </span>
            )
          : null}
      </h2>
      <div className='f6'>
        {cid == null
          ? null
          : (
          <div className='dt dt--fixed pt2'>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className='dtc silver tracked ttu f7' style={{ width: 48 }}>CID</label>
            <div className='dtc truncate charcoal monospace' data-id='ObjectInfo-cid'>{cid}</div>
          </div>
            )}
        {size == null
          ? null
          : (
          <div className='dt dt--fixed pt2'>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className='dtc silver tracked ttu f7' style={{ width: 48 }}>Size</label>
            <div className='dtc truncate charcoal monospace'>{humansize(Number(size))}</div>
          </div>
            )}
        <div className='dt dt--fixed pt2'>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className='dtc silver tracked ttu f7' style={{ width: 48 }}>Links</label>
          <div className='dtc truncate charcoal'>
            {links != null ? (<code>{links.length}</code>) : 'No Links'}
          </div>
        </div>
        <div className='dt dt--fixed pt2' style={{ height: 26 }}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className='dtc silver tracked ttu f7 v-mid' style={{ width: 48 }}>Data</label>
          <div className='dtc truncate mid-gray'>
            {data != null ? null : 'No data'}
          </div>
        </div>
        {data == null
          ? null
          : (
          <div className='pa3 mt2 r-inspector bg-white f5 nl3 nr3 mh0-l overflow-x-auto' style={{ background: 'var(--gray-muted)' }}>
            {/* @ts-expect-error - object inspector types are wrong. see https://www.npmjs.com/package/react-inspector#theme  */}
            <ObjectInspector showMaxKeys={100} data={getObjectInspectorData(data)} theme={objectInspectorTheme} expandPaths={toExpandPathsNotation(localPath)} />
          </div>
            )}
      </div>
      {links?.length == null || links.length === 0
        ? null
        : (
        <div className='mv2 nl3 nr3 mh0-l'>
          <LargeLinksTable links={links} onLinkClick={onLinkClick} />
        </div>
          )}
    </section>
  )
}

export default ObjectInfo
