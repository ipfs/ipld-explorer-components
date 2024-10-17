import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

export interface LinkObject {
  path: string;
  target: string;
}

export interface RowLinkClickEventData {
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
  links: LinkObject[];
  rowHeight?: number;
  tableHeight?: number;
  headerHeight?: number;
  cidRowStyle?: React.CSSProperties;
  onLinkClick(evt: RowLinkClickEventData): void
}

interface RowProps {
  link: LinkObject;
  index: number;
  startIndex: number;
  rowHeight: number;
  cidRowStyle: React.CSSProperties;
}

const column1WrapperStyle: React.CSSProperties = {
  flex: '0 0 34px'
};
const column2WrapperStyle: React.CSSProperties = {
  flex: '1 1 150px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  // marginRight: '10px',
  // whiteSpaceCollapse: 'collapse'
  minWidth: 0
};
const column3WrapperStyle: React.CSSProperties = {
  flex: '0 1 420px'
};

const Row: React.FC<RowProps> = ({ startIndex, index, rowHeight, link, cidRowStyle }) => {
  const key = startIndex + index;
  const stripedBgColor = key % 2 === 0 ? 'bg-light-gray' : 'bg-white';
  return (
    <div
      key={key}
      className={`${stripedBgColor} pv2 flex pointer bb b--near-white f7`}
      style={{ position: 'absolute', top: key * rowHeight, width: '100%' }}
    >
      <div style={column1WrapperStyle}>
        <span className='mid-gray monospace tr pr1 ml2' style={{ width: '34px', display: 'inline-block' }}>
          {startIndex + index}
        </span>
      </div>
      <div style={column2WrapperStyle} className="f6-ns">
        {/* <span
          className='ph2 navy tl'
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}
        > */}
          {link.path}
        {/* </span> */}
      </div>
      <div style={column3WrapperStyle}>
        <span
          className='pl2 mid-gray tl'
          style={{ ...cidRowStyle, width: '420px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {link.target}
        </span>
      </div>
    </div>
  );
};

interface HeaderProps {
  cidRowStyle: React.CSSProperties;
}

const Header: React.FC<HeaderProps> = ({ cidRowStyle }) => {
  return (
    <div className="mid-gray flex items-center pv2 fw1 tracked">
      <div style={column1WrapperStyle}>
        <span className="mid-gray tr pr1 ml2 f7" style={{ width: '34px', display: 'inline-block' }}>
          #
        </span>
      </div>
      <div style={column2WrapperStyle}>
        <span
          className="ph2 navy tl tracked f7"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}
        >
          PATH
        </span>
      </div>
      <div style={column3WrapperStyle}>
        <span
          className="pl2 mid-gray tl f7"
          style={{ ...cidRowStyle, width: '420px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          CID
        </span>
      </div>
    </div>
  );
};

const LargeLinksTable: React.FC<LargeLinksTableProps> = ({ links, rowHeight = 29, tableHeight = 500, cidRowStyle }) => {
  const [startIndex, setStartIndex] = useState(0);
  // const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxWindowSize = 30;

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const newStartIndex = Math.floor(scrollTop / rowHeight);
      setStartIndex(newStartIndex);
    }
  }, [rowHeight]);

  // const handleWindowSizeChange = useCallback(() => {
  //   setWidth(newWidth);
  // }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // useEffect(() => {
  //   handleWindowSizeChange(window.innerWidth);
  //   window.addEventListener('resize', () => handleWindowSizeChange(window.innerWidth));
  //   return () => window.removeEventListener('resize', () => handleWindowSizeChange(window.innerWidth));
  // }, [handleWindowSizeChange])


  const endIndex = Math.min(startIndex + maxWindowSize, links.length);
  const visibleLinks = links.slice(startIndex, endIndex);

  return (
    // <AutoSizer disableHeight>
      // {({ width }) => (
        <div className="collapse br2 pv2 ph3 mv2 nl3 nr3 mh0-l">
          <Header cidRowStyle={cidRowStyle ?? {}} />
          <div
            ref={containerRef}
            style={{ height: tableHeight, overflowY: 'auto', position: 'relative' }}
          >
            <div className="flex" style={{ height: links.length * rowHeight, position: 'relative' }}>
              {visibleLinks.map((link, index) => (
                <Row key={startIndex + index} link={link} index={index} startIndex={startIndex} rowHeight={rowHeight} cidRowStyle={cidRowStyle} />
              ))}
            </div>
          </div>
        </div>
    //   )}
    // </AutoSizer>
  );
};

export default LargeLinksTable;
