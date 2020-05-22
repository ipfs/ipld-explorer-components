import React from 'react'
import { Table, Column, AutoSizer } from 'react-virtualized'
import './LinksTable.css'

class LinksTable extends React.Component {
  handleOnRowClick = ({ rowData }) => {
    const { onLinkClick } = this.props
    onLinkClick(rowData)
  }

  render () {
    const { links } = this.props
    const headerClassName = 'mid-gray fw2 tracked silver'
    const rowHeight = 29
    const headerHeight = 32
    const tableHeight = Math.max(370, (Math.min(window.innerHeight - 500, links.length * rowHeight + headerHeight)));
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
              onRowClick={this.handleOnRowClick}
            >
              <Column dataKey='index' width={34} className='pv2 silver monospace tr pr1' />
              <Column label='Path' dataKey='path' width={210} flexGrow={1} className='pv2 navy f6-ns' headerClassName={headerClassName} />
              <Column label='CID' dataKey='target' width={360} className='pv2 mid-gray monospace' headerClassName={headerClassName} />
            </Table>
          )}
        </AutoSizer>
      </div>
    )
  }
}

export default LinksTable
