import React from 'react';
import { getCodecOrNull } from '../../lib/cid';
import Cid from '../cid/Cid';
import { colorForNode } from '../object-info/ObjectInfo';
const GraphCrumb = _ref => {
  let {
    cid,
    pathBoundaries,
    localPath,
    hrefBase = '#/explore',
    className = '',
    ...props
  } = _ref;
  const [first, ...rest] = pathBoundaries;
  const last = pathBoundaries[pathBoundaries.length - 1];
  const firstHrefBase = calculateHrefBase(hrefBase, cid, pathBoundaries, 0);
  return /*#__PURE__*/React.createElement("div", props, /*#__PURE__*/React.createElement("div", {
    className: `sans-serif ${className}`
  }, /*#__PURE__*/React.createElement(NodeUnderline, {
    cid: cid
  }, /*#__PURE__*/React.createElement("a", {
    href: firstHrefBase,
    className: "monospace no-underline dark-gray o-50 glow"
  }, /*#__PURE__*/React.createElement(Cid, {
    value: cid
  })), first ? /*#__PURE__*/React.createElement("div", {
    className: "dib"
  }, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Path, {
    path: first.path,
    hrefBase: firstHrefBase,
    sourceCid: cid
  })) : null, localPath && pathBoundaries.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "dib"
  }, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Path, {
    path: localPath,
    sourceCid: cid,
    hrefBase: firstHrefBase
  })) : null), rest.map((link, i) => {
    const nextHrefBase = calculateHrefBase(hrefBase, cid, pathBoundaries, i + 1);
    return /*#__PURE__*/React.createElement("div", {
      className: "dib",
      key: i
    }, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(NodeUnderline, {
      cid: link.source
    }, /*#__PURE__*/React.createElement(Path, {
      path: link.path,
      sourceCid: link.source,
      hrefBase: nextHrefBase
    })));
  }), localPath && pathBoundaries.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "dib"
  }, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(NodeUnderline, {
    cid: last.target
  }, /*#__PURE__*/React.createElement(Path, {
    path: localPath,
    sourceCid: last.target,
    hrefBase: calculateHrefBase(hrefBase, cid, pathBoundaries, pathBoundaries.length)
  }))) : null));
};
function calculateHrefBase(hrefBase, cid, boundaries, boundaryIndex) {
  const relPath = boundaries.slice(0, boundaryIndex).map(b => b.path).join('/');
  const cidHref = hrefBase + '/' + cid;
  return relPath ? cidHref + '/' + relPath : cidHref;
}
const NodeUnderline = _ref2 => {
  let {
    cid,
    children
  } = _ref2;
  const type = getCodecOrNull(cid);
  const color = colorForNode(type);
  return /*#__PURE__*/React.createElement("div", {
    className: "dib overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bb bw1 pb1",
    style: {
      borderColor: color
    }
  }, children));
};
const Path = _ref3 => {
  let {
    path,
    hrefBase,
    sourceCid
  } = _ref3;
  const parts = [path];
  return /*#__PURE__*/React.createElement("div", {
    className: "dib"
  }, parts.map((p, i) => {
    const relPath = parts.slice(0, i + 1).join('/');
    const href = `${hrefBase}/${relPath}`;
    return /*#__PURE__*/React.createElement("div", {
      className: "dib",
      key: href
    }, i !== 0 && /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("a", {
      className: "dib no-underline dark-gray o-50 glow",
      title: sourceCid + '/' + relPath,
      href: href
    }, p));
  }));
};
const Divider = () => /*#__PURE__*/React.createElement("div", {
  className: "dib ph2 gray v-top"
}, "/");
export default GraphCrumb;