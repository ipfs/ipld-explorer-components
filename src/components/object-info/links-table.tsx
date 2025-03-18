import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './links-table.module.css'

export interface LinkObject {
  index: number
  size: bigint

  /**
   * The path to the target CID from the current path
   * This should be appended to the current path in order to get the target CID
   */
  path: string
  /**
   * string representation of the CID the row represents
   */
  source: string
  /**
   * string representation of the CID the row represents
   */
  target: string

}

export interface LargeLinksTableProps {
  links: LinkObject[]
  /**
   * The maximum rows to render at a time. This may or may not be the actual number of rows rendered depending on the height of the table.
   * i.e. this is the "window" of rows that are attached to the DOM at any given time.
   */
  maxRows?: number
  rowHeight?: number
  tableHeight?: number
  headerHeight?: number
  cidRowStyle?: React.CSSProperties
  onLinkClick(link: LinkObject): void
}

interface RowProps {
  link: LinkObject
  index: number
  startIndex: number
  rowHeight: number
  cidRowStyle: React.CSSProperties
  onLinkClick(link: LinkObject): void
}

const Row: React.FC<RowProps> = ({ onLinkClick, startIndex, index, rowHeight, link }) => {
  const key = startIndex + index
  const backgroundColor = key % 2 === 0 ? '#fff' : 'rgb(251, 251, 251)'

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      key={key}
      className={`pv2 pointer items-center f7 ${styles.rowGrid} bb b--near-white`}
      style={{ position: 'absolute', top: key * rowHeight, width: '100%', backgroundColor }}
      onClick={() => { onLinkClick(link) }}
    >
      <div className={`mid-gray tr pr1 f7 ${styles.gridCellRow} monospace}`}>
        {key}
      </div>
      <div className={`navy f6-ns f7 ${styles.gridCellRow}`}>
        {link.path}
      </div>
      <div className={`mid-gray tl ${styles.gridCellRow} ml1 f7 monospace}`}>
        {link.target}
      </div>
    </div>
  )
}

interface HeaderProps {
  cidRowStyle?: React.CSSProperties
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className={`mid-gray ${styles.headerGrid} items-center pv2 fw1 tracked bb b--near-white`}>
      <div className={`mid-gray tr pr1 f7 ${styles.gridCellHeader}`}>
        #
      </div>
      <div className={`navy tl tracked f7 ${styles.gridCellHeader}`}>
        PATH
      </div>
      <div className={`mid-gray tl tracked ${styles.gridCellHeader}`}>
        CID
      </div>
    </div>
  )
}

const LargeLinksTable: React.FC<LargeLinksTableProps> = ({ onLinkClick, links, rowHeight = 35, tableHeight = 650, cidRowStyle, maxRows = 50 }) => {
  const [startIndex, setStartIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tableWidth, setTableWidth] = useState(0)

  const handleScroll = useCallback((evt: Event) => {
    // prevent scrolling the table from scrolling the entire page
    evt.preventDefault()
    if (containerRef.current != null) {
      const scrollTop = containerRef.current.scrollTop
      const newStartIndex = Math.floor(scrollTop / rowHeight)
      setStartIndex(newStartIndex)
    }
  }, [rowHeight])

  const handleWindowResize = useCallback(() => {
    const container = containerRef.current
    if (container != null) {
      setTableWidth(container.clientWidth)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container != null) {
      container.addEventListener('scroll', handleScroll)
      return () => { container.removeEventListener('scroll', handleScroll) }
    }
  }, [handleScroll])

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [handleWindowResize, containerRef.current?.clientWidth])

  const endIndex = Math.min(startIndex + maxRows, links.length)
  const visibleLinks = links.slice(startIndex, endIndex)

  return (
    <div className={`collapse links-table br2 pv2 ph3 mv2 nl3 nr3 mh0-l f7 ${styles.linksTable}`} style={{ backgroundColor: 'red' }}>
      <Header cidRowStyle={cidRowStyle ?? { width: tableWidth }} />
      <div
        ref={containerRef}
        style={{ height: tableHeight, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}
      >
        <div style={{ width: tableWidth, height: links.length * rowHeight }}>
          {visibleLinks.map((link, index) => (
            <Row onLinkClick={onLinkClick} key={startIndex + index} link={link} index={index} startIndex={startIndex} rowHeight={rowHeight} cidRowStyle={cidRowStyle ?? {}} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LargeLinksTable
