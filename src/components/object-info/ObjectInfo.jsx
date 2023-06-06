import { ObjectInspector, chromeLight } from '@tableflip/react-inspector'
import filesize from 'filesize'
import { CID } from 'multiformats'
import React from 'react'
import { withTranslation } from 'react-i18next'

import LinksTable from './LinksTable'
import getCodecNameFromCode from '../../lib/get-codec-name-from-code'

const humansize = filesize.partial({ round: 0 })

const objectInspectorTheme = {
  ...chromeLight,
  BASE_FONT_FAMILY: 'Consolas, Menlo, monospace',
  TREENODE_FONT_FAMILY: 'Consolas, Menlo, monospace',
  BASE_FONT_SIZE: '13px',
  BASE_LINE_HEIGHT: '19px',
  TREENODE_FONT_SIZE: '13px',
  TREENODE_LINE_HEIGHT: '19px'
}

// TODO: Use https://github.com/multiformats/multicodec/blob/master/table.csv to get full name.
/**
 * Note that existing colors were added into the "Mass Editor" at colordesigner.io:
 *
 * * #28CA9F
 * * #244e66
 * * #378085
 * * #f14e32
 * * #383838
 *
 * And then hamt-sharded-directory was set to #9f28ca which was listed under "Color Harmonies - Triad" on 2023-05-22
 */
const nodeStyles = {
  'dag-cbor': { shortName: 'CBOR', name: 'dag-cbor', color: '#378085' },
  'dag-json': { shortName: 'JSON', name: 'dag-json', color: '#378065' },
  'dag-pb': { shortName: 'PB', name: 'dag-pb', color: '#244e66' },
  'git-raw': { shortName: 'GIT', name: 'Git', color: '#378085' },
  'raw': { shortName: 'RAW', name: 'Raw Block', color: '#f14e32' }, // eslint-disable-line quote-props
  'eth-block': { shortName: 'ETH', name: 'Ethereum Block', color: '#383838' },
  'eth-block-list': { shortName: 'ETH', name: 'Ethereum Block List', color: '#383838' },
  'eth-tx-trie': { shortName: 'ETH', name: 'Ethereum Tx Trie', color: '#383838' },
  'eth-tx': { shortName: 'ETH', name: 'Ethereum Tx', color: '#383838' },
  'eth-state-trie': { shortName: 'ETH', name: 'Ethereum State Trie', color: '#383838' },
  'hamt-sharded-directory': { shortName: 'PB+H', name: 'HAMT-Sharded dag-pb Directory', color: '#244e66' }
}

export function shortNameForNode (type) {
  const style = nodeStyles[type]
  return (style && style.shortName) || 'DAG'
}

export function nameForNode (type) {
  const style = nodeStyles[type]
  return (style && style.name) || 'DAG Node'
}

export function colorForNode (type) {
  const style = nodeStyles[type]
  return (style && style.color) || '#ea5037'
}

// '/a/b' => ['$', '$.a', '$.a.b']
// See: https://github.com/xyc/react-inspector#api
export function toExpandPathsNotation (localPath) {
  if (!localPath) return []
  const parts = localPath.split('/')
  const expandPaths = parts.map((part, i) => {
    if (!part) return '$'
    const relPath = parts.slice(0, i).join('.')
    return `$${relPath}.${part}`
  })
  return expandPaths.slice(0, expandPaths.length - 1)
}

const DagNodeIcon = ({ type, ...props }) => (
  <svg {...props} title={nameForNode(type)} width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='15' cy='15' r='15' fillRule='evenodd' fill={colorForNode(type)} />
  </svg>
)

const ObjectInfo = ({ t, tReady, className, type, cid, localPath, size, data, links, format, onLinkClick, gatewayUrl, publicGatewayUrl, ...props }) => {
  const isUnixFs = format === 'unixfs' && data.type && ['directory', 'file'].some(x => x === data.type)
  let nodeStyleType = type

  if (!isNaN(type) || isUnixFs || nameForNode(type) === 'DAG Node') {
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
            {gatewayUrl && gatewayUrl !== publicGatewayUrl && (
              <a className='no-underline avenir ml2 pa2 fw5 f6 navy dib' href={`${gatewayUrl}/ipfs/${cid}`} rel='external nofollow' target='_external'>
                {t('ObjectInfo.privateGateway')}
              </a>)}
            {publicGatewayUrl && (
              <a className='no-underline avenir ml2 pa2 fw5 f6 navy dib' href={`${publicGatewayUrl}/ipfs/${cid}`} rel='external nofollow' target='_external'>
                {t('ObjectInfo.publicGateway')}
              </a>)}
          </span>
            )
          : null}
      </h2>
      <div className='f6'>
        {!cid
          ? null
          : (
          <div className='dt dt--fixed pt2'>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className='dtc silver tracked ttu f7' style={{ width: 48 }}>CID</label>
            <div className='dtc truncate charcoal monospace' data-id='ObjectInfo-cid'>{cid}</div>
          </div>
            )}
        {!size
          ? null
          : (
          <div className='dt dt--fixed pt2'>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className='dtc silver tracked ttu f7' style={{ width: 48 }}>Size</label>
            <div className='dtc truncate charcoal monospace'>{humansize(size)}</div>
          </div>
            )}
        <div className='dt dt--fixed pt2'>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className='dtc silver tracked ttu f7' style={{ width: 48 }}>Links</label>
          <div className='dtc truncate charcoal'>
            {links ? (<code>{links.length}</code>) : 'No Links'}
          </div>
        </div>
        <div className='dt dt--fixed pt2' style={{ height: 26 }}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className='dtc silver tracked ttu f7 v-mid' style={{ width: 48 }}>Data</label>
          <div className='dtc truncate mid-gray'>
            {data ? null : 'No data'}
          </div>
        </div>
        {!data
          ? null
          : (
          <div className='pa3 mt2 bg-white f5 nl3 nr3 mh0-l'>
            <ObjectInspector showMaxKeys={100} data={data} theme={objectInspectorTheme} expandPaths={toExpandPathsNotation(localPath)} />
          </div>
            )}
      </div>
      {!links || !links.length
        ? null
        : (
        <div className='mv2 nl3 nr3 mh0-l'>
          <LinksTable links={links} onLinkClick={onLinkClick} />
        </div>
          )}
    </section>
  )
}

export default withTranslation('explore')(ObjectInfo)
