import { type CID } from 'multiformats/cid'
import React, { type PropsWithChildren } from 'react'
import { getCodecOrNull } from '../../lib/cid.js'
import Cid from '../cid/Cid.js'
import { colorForNode } from '../object-info/ObjectInfo.js'

export interface PathBoundary {
  path: string
  source: CID
  target: CID
}

export interface GraphCrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  cid: CID
  pathBoundaries: PathBoundary[]
  /**
   * Used to represent the current path segment that is being explored or displayed within the component. This path
   * segment is typically appended to the existing path boundaries to form the complete path that the user is navigating
   * through.
   */
  localPath?: string

  /**
   * used to construct the base URL for the links generated within the breadcrumb navigation. This property is essential
   * for creating the correct URLs that users can click on to navigate through different segments of the path.
   */
  hrefBase?: string
  className?: string
}

const GraphCrumb: React.FC<GraphCrumbProps> = ({ cid, pathBoundaries, localPath, hrefBase = '#/explore', className = '', ...props }) => {
  const [first, ...rest] = pathBoundaries
  const last = pathBoundaries[pathBoundaries.length - 1]
  const firstHrefBase = calculateHrefBase(hrefBase, cid, pathBoundaries, 0)
  return (
    <div {...props}>
      <div className={`sans-serif ${className}`}>
        <NodeUnderline cid={cid}>
          <a href={firstHrefBase} className='monospace no-underline dark-gray o-50 glow'>
            <Cid value={cid} />
          </a>
          {first != null
            ? (
            <div className='dib'>
              <Divider />
              <Path path={first.path} hrefBase={firstHrefBase} sourceCid={cid} />
            </div>
              )
            : null}
          {localPath != null && pathBoundaries.length === 0
            ? (
            <div className='dib'>
              <Divider />
              <Path path={localPath} sourceCid={cid} hrefBase={firstHrefBase} />
            </div>
              )
            : null}
        </NodeUnderline>
        {rest.map((link, i) => {
          if (i === pathBoundaries.length - 1) return null
          const nextHrefBase = calculateHrefBase(hrefBase, cid, pathBoundaries, i + 1)
          return (
            <div className='dib' key={i}>
              <Divider />
              <NodeUnderline cid={link.source}>
                <Path
                  path={link.path}
                  sourceCid={link.source}
                  hrefBase={nextHrefBase}
                />
              </NodeUnderline>
            </div>
          )
        })}
        {localPath != null && pathBoundaries.length > 0
          ? (
          <div className='dib'>
            <Divider />
            <NodeUnderline cid={last.target}>
              <Path
                path={localPath}
                sourceCid={last.target}
                hrefBase={calculateHrefBase(hrefBase, cid, pathBoundaries, pathBoundaries.length)}
              />
            </NodeUnderline>
          </div>
            )
          : null}
      </div>
    </div>
  )
}

function calculateHrefBase (hrefBase: string, cid: CID, boundaries: any, boundaryIndex: any): string {
  const relPath: string = boundaries.slice(0, boundaryIndex).map((b: any) => b.path).join('/')
  const cidHref = hrefBase + '/' + cid.toString()
  return relPath != null ? cidHref + '/' + relPath : cidHref
}

const NodeUnderline: React.FC<PropsWithChildren<{ cid: CID }>> = ({ cid, children }) => {
  const type = getCodecOrNull(cid)
  // @ts-expect-error - todo: resolve this type error
  const color = colorForNode(type)
  return (
    <div className='dib overflow-hidden'>
      <div className='bb bw1 pb1' style={{ borderColor: color }}>{children}</div>
    </div>
  )
}

const Path: React.FC<{ path: string, hrefBase: string, sourceCid: CID }> = ({ path, hrefBase, sourceCid }) => {
  const parts = [path]

  return (
    <div className='dib'>
      {parts.map((p, i) => {
        const relPath = parts.slice(0, i + 1).join('/')
        const href = `${hrefBase}/${relPath}`
        return (
          <div className='dib' key={href}>
            {i !== 0 && <Divider />}
            <a
              className='dib no-underline dark-gray o-50 glow'
              title={sourceCid.toString() + '/' + relPath}
              href={href}
            >
              {p}
            </a>
          </div>
        )
      })}
    </div>
  )
}

const Divider: React.FC = () => <div className='dib ph2 gray v-top'>/</div>

export default GraphCrumb
