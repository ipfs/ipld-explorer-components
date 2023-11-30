function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import React from 'react';
import { Table, Column, AutoSizer } from 'react-virtualized';
import './LinksTable.css';
class LinksTable extends React.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "handleOnRowClick", _ref => {
      let {
        rowData
      } = _ref;
      const {
        onLinkClick
      } = this.props;
      onLinkClick(rowData);
    });
  }
  render() {
    const {
      links
    } = this.props;
    const headerClassName = 'mid-gray fw2 tracked';
    const cidRowStyle = {
      overflow: 'auto'
    };
    const rowHeight = 29;
    const headerHeight = 32;
    const tableHeight = Math.max(370, Math.min(window.innerHeight - 500, links.length * rowHeight + headerHeight));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AutoSizer, {
      disableHeight: true
    }, _ref2 => {
      let {
        width
      } = _ref2;
      return /*#__PURE__*/React.createElement(Table, {
        className: "tl fw4 LinksTable",
        rowClassName: "pointer bb b--near-white f7",
        width: width,
        height: tableHeight,
        headerHeight: 32,
        rowHeight: rowHeight,
        rowCount: links.length,
        rowGetter: _ref3 => {
          let {
            index
          } = _ref3;
          return {
            index,
            ...links[index]
          };
        },
        onRowClick: this.handleOnRowClick
      }, /*#__PURE__*/React.createElement(Column, {
        dataKey: "index",
        width: 34,
        className: "pv2 mid-gray monospace tr pr1"
      }), /*#__PURE__*/React.createElement(Column, {
        label: "Path",
        dataKey: "path",
        width: 150,
        flexGrow: 1,
        className: "pv2 navy f6-ns",
        headerClassName: headerClassName
      }), /*#__PURE__*/React.createElement(Column, {
        label: "CID",
        dataKey: "target",
        width: 420,
        className: "pv2 mid-gray monospace no-ellipsis",
        headerClassName: headerClassName,
        style: cidRowStyle
      }));
    }));
  }
}
export default LinksTable;