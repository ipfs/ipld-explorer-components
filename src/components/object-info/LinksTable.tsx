import React, { useCallback } from 'react'
import { Table, Column, AutoSizer, type RowMouseEventHandlerParams } from 'react-virtualized'

import './LinksTable.css'

export interface LinksTableProps {
  links: any[]
  onLinkClick(link: any): void
}

export const LinksTable: React.FC<LinksTableProps> = ({ links, onLinkClick }) => {
  const headerClassName = 'mid-gray fw2 tracked'
  const cidRowStyle = {
    overflow: 'auto'
  }
  const rowHeight = 29
  const headerHeight = 32
  const tableHeight = Math.max(370, (Math.min(window.innerHeight - 500, links.length * rowHeight + headerHeight)))

  // eslint-disable-next-line no-console
  console.log('onLinkClick', onLinkClick)

  const handleOnRowClick = useCallback(({ rowData }: RowMouseEventHandlerParams) => {
    onLinkClick(rowData)
  }, [onLinkClick])

  return (
      <div>
        <AutoSizer disableHeight>
          {({ width }) => (
            <Table
              className='tl fw4 LinksTable'
              rowClassName='pointer bb b--near-white f7'
              width={width}
              height={tableHeight}
              headerHeight={32}
              rowHeight={rowHeight}
              rowCount={links.length}
              rowGetter={({ index }) => ({ index, ...links[index] })}
              onRowClick={handleOnRowClick}
            >
              <Column dataKey='index' width={34} className='pv2 mid-gray monospace tr pr1' />
              <Column label='Path' dataKey='path' width={150} flexGrow={1} className='pv2 navy f6-ns' headerClassName={headerClassName} />
              <Column label='CID' dataKey='target' width={420} className='pv2 mid-gray monospace no-ellipsis' headerClassName={headerClassName} style={cidRowStyle} />
            </Table>
          )}
        </AutoSizer>
      </div>
  )
}

export default LinksTable
