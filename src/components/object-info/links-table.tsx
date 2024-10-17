import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import './links-table.css'

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

interface LargeLinksTableProps {
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
  const stripedBgColor = key % 2 === 0 ? 'bg-light-gray' : 'bg-white'
  const pathRef = useRef<HTMLDivElement>(null)

  const onResize = useCallback(() => {
    if (pathRef.current != null) {
      const pathWidth = pathRef.current.offsetWidth
      console.log('pathWidth: ', pathWidth)
      console.log('path clientWidth: ', pathRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize) }
  }, [onResize])

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      key={key}
      className={`${stripedBgColor} pv2 flex pointer items-center bb b--near-white f7 links-table--row`}
      style={{ position: 'absolute', top: key * rowHeight, width: '100%' }}
      onClick={() => { onLinkClick(link as any) }}
    >
      <div className="links-table--row--cell mid-gray tr pr1 f7">
        {startIndex + index}
      </div>
      <div className="links-table--row--cell pl3 navy tl tracked f7" ref={pathRef}>
        {link.path}
      </div>
      <div className="links-table--row--cell mid-gray tl f7 pl1 pl3-m pl3-l">
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
    <div className="mid-gray flex items-center pv2 fw1 tracked links-table--row">
      <div className="links-table--row--cell mid-gray tr pr1 f7">
        #
      </div>
      <div className="links-table--row--cell pl3 navy tl tracked f7">
        PATH
      </div>
      <div className="links-table--row--cell mid-gray tl f7">
        CID
      </div>
    </div>
  )
}

const LargeLinksTable: React.FC<LargeLinksTableProps> = ({ onLinkClick, links, rowHeight = 29, tableHeight = 650, cidRowStyle, maxRows = 50 }) => {
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
    console.log('resize event. Width=', window.innerWidth)
    const container = containerRef.current
    if (container != null) {
      console.log('table container width: ', container.clientWidth)
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
    <div className="collapse br2 pv2 ph3 mv2 nl3 nr3 mh0-l f7">
      <Header cidRowStyle={cidRowStyle ?? { width: tableWidth }} />
      <div
        ref={containerRef}
        style={{ height: tableHeight, overflowY: 'auto', position: 'relative' }}
      >
        <div className="flex items-center" style={{ width: tableWidth, height: links.length * rowHeight, position: 'relative' }}>
          {visibleLinks.map((link, index) => (
            <Row onLinkClick={onLinkClick} key={startIndex + index} link={link} index={index} startIndex={startIndex} rowHeight={rowHeight} cidRowStyle={cidRowStyle ?? {}} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LargeLinksTable
