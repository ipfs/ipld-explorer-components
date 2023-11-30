function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import filesize from 'filesize';
import theme from 'ipfs-css/theme.json';
import { CID } from 'multiformats';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { ObjectInspector, chromeLight } from 'react-inspector';
import LinksTable from './LinksTable';
import getCodecNameFromCode from '../../lib/get-codec-name-from-code';
const humansize = filesize.partial({
  round: 0
});
const objectInspectorTheme = {
  ...chromeLight,
  BASE_FONT_FAMILY: 'Consolas, Menlo, monospace',
  TREENODE_FONT_FAMILY: 'Consolas, Menlo, monospace',
  BASE_FONT_SIZE: '13px',
  BASE_LINE_HEIGHT: '19px',
  TREENODE_FONT_SIZE: '13px',
  TREENODE_LINE_HEIGHT: '19px'
};

// Use https://github.com/multiformats/multicodec/blob/master/table.csv to get full name.
const nodeStyles = {
  // most-common
  'dag-cbor': {
    shortName: 'DAG-CBOR',
    name: 'dag-cbor',
    color: theme.colors.aqua
  },
  'dag-json': {
    shortName: 'DAG-JSON',
    name: 'dag-json',
    color: theme.colors.green
  },
  raw: {
    shortName: 'RAW',
    name: 'Raw Block',
    color: theme.colors.red
  },
  // red because it's special
  'dag-pb': {
    shortName: 'DAG-PB',
    name: 'dag-pb',
    color: theme.colors.teal
  },
  // exciting
  'dag-jose': {
    shortName: 'DAG-JOSE',
    name: 'dag-jose',
    color: theme.colors.yellow
  },
  // less common
  json: {
    shortName: 'JSON',
    name: 'JSON',
    color: theme.colors['green-muted']
  },
  'hamt-sharded-directory': {
    shortName: 'HAMT\nDAG-PB',
    name: 'HAMT-Sharded dag-pb Directory',
    color: theme.colors['teal-muted']
  },
  // rare
  'eth-block': {
    shortName: 'ETH',
    name: 'Ethereum Block',
    color: theme.colors.charcoal
  },
  'eth-block-list': {
    shortName: 'ETH',
    name: 'Ethereum Block List',
    color: theme.colors.charcoal
  },
  'eth-tx-trie': {
    shortName: 'ETH',
    name: 'Ethereum Tx Trie',
    color: theme.colors.charcoal
  },
  'eth-tx': {
    shortName: 'ETH',
    name: 'Ethereum Tx',
    color: theme.colors.charcoal
  },
  'eth-state-trie': {
    shortName: 'ETH',
    name: 'Ethereum State Trie',
    color: theme.colors.charcoal
  }
};
export function shortNameForNode(type) {
  const style = nodeStyles[type];
  return style && style.shortName || 'DAG';
}
export function nameForNode(type) {
  const style = nodeStyles[type];
  return style && style.name || 'DAG Node';
}
export function colorForNode(type) {
  const style = nodeStyles[type];
  return style && style.color || '#ea5037';
}

// '/a/b' => ['$', '$.a', '$.a.b']
// See: https://github.com/xyc/react-inspector#api
export function toExpandPathsNotation(localPath) {
  if (!localPath) return [];
  const parts = localPath.split('/');
  const expandPaths = parts.map((part, i) => {
    if (!part) return '$';
    const relPath = parts.slice(0, i).join('.');
    return `$${relPath}.${part}`;
  });
  return expandPaths.slice(0, expandPaths.length - 1);
}
const DagNodeIcon = _ref => {
  let {
    type,
    ...props
  } = _ref;
  return /*#__PURE__*/React.createElement("svg", _extends({}, props, {
    title: nameForNode(type),
    width: "30",
    height: "30",
    viewBox: "0 0 30 30",
    xmlns: "http://www.w3.org/2000/svg"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "15",
    r: "15",
    fillRule: "evenodd",
    fill: colorForNode(type)
  }));
};

/**
 * replace bigint or other non-JSON-serializable values with appropriate values for the react-inspector
 * Note that data for some blocks (e.g. bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq) currently do not
 * look like NormalizedDagNode['data']
 *
 * @param {import('../../types').NormalizedDagNode['data']} data
 */
const getObjectInspectorData = data => {
  if (data == null) return data;
  if (data.blockSizes != null) {
    data.blockSizes = data.blockSizes.map(Number);
  }
  return data;
};

/**
 * @param {object} props
 * @param {import('react-i18next').TFunction} props.t
 * @param {boolean} props.tReady
 * @param {string} props.className
 * @param {string} props.type
 * @param {string} props.cid
 * @param {string} props.localPath
 * @param {bigint} props.size
 * @param {import('../../types').NormalizedDagNode['data']} props.data
 * @param {object[]} props.links
 * @param {string} props.format
 * @param {Function} props.onLinkClick
 * @param {string} props.gatewayUrl
 * @param {string} props.publicGatewayUrl
 */
const ObjectInfo = _ref2 => {
  let {
    t,
    tReady,
    className,
    type,
    cid,
    localPath,
    size,
    data,
    links,
    format,
    onLinkClick,
    gatewayUrl,
    publicGatewayUrl,
    ...props
  } = _ref2;
  if (!tReady) return null;
  const isUnixFs = format === 'unixfs' && data.type && ['directory', 'file'].some(x => x === data.type);
  let nodeStyleType = type;
  if (!isNaN(type) || isUnixFs || nameForNode(type) === 'DAG Node') {
    nodeStyleType = getCodecNameFromCode(CID.parse(cid).code) ?? type;
  }
  return /*#__PURE__*/React.createElement("section", _extends({
    className: `pa4 sans-serif ${className}`
  }, props), /*#__PURE__*/React.createElement("h2", {
    className: "ma0 lh-title f4 fw4 montserrat pb2",
    title: nodeStyleType
  }, /*#__PURE__*/React.createElement(DagNodeIcon, {
    type: nodeStyleType,
    className: "mr3",
    style: {
      verticalAlign: -8
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "v-mid"
  }, nameForNode(nodeStyleType)), format === 'unixfs' ? /*#__PURE__*/React.createElement("a", {
    className: "dn di-ns no-underline charcoal ml2",
    href: "https://docs.ipfs.io/concepts/glossary/#unixfs",
    rel: "external",
    target: "_external"
  }, "UnixFS") : null, isUnixFs ? /*#__PURE__*/React.createElement("span", {
    className: "dib"
  }, gatewayUrl && gatewayUrl !== publicGatewayUrl && /*#__PURE__*/React.createElement("a", {
    className: "no-underline avenir ml2 pa2 fw5 f6 navy dib",
    href: `${gatewayUrl}/ipfs/${cid}`,
    rel: "external nofollow",
    target: "_external"
  }, t('ObjectInfo.privateGateway')), publicGatewayUrl && /*#__PURE__*/React.createElement("a", {
    className: "no-underline avenir ml2 pa2 fw5 f6 navy dib",
    href: `${publicGatewayUrl}/ipfs/${cid}`,
    rel: "external nofollow",
    target: "_external"
  }, t('ObjectInfo.publicGateway'))) : null), /*#__PURE__*/React.createElement("div", {
    className: "f6"
  }, !cid ? null : /*#__PURE__*/React.createElement("div", {
    className: "dt dt--fixed pt2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "dtc silver tracked ttu f7",
    style: {
      width: 48
    }
  }, "CID"), /*#__PURE__*/React.createElement("div", {
    className: "dtc truncate charcoal monospace",
    "data-id": "ObjectInfo-cid"
  }, cid)), !size ? null : /*#__PURE__*/React.createElement("div", {
    className: "dt dt--fixed pt2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "dtc silver tracked ttu f7",
    style: {
      width: 48
    }
  }, "Size"), /*#__PURE__*/React.createElement("div", {
    className: "dtc truncate charcoal monospace"
  }, humansize(Number(size)))), /*#__PURE__*/React.createElement("div", {
    className: "dt dt--fixed pt2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "dtc silver tracked ttu f7",
    style: {
      width: 48
    }
  }, "Links"), /*#__PURE__*/React.createElement("div", {
    className: "dtc truncate charcoal"
  }, links ? /*#__PURE__*/React.createElement("code", null, links.length) : 'No Links')), /*#__PURE__*/React.createElement("div", {
    className: "dt dt--fixed pt2",
    style: {
      height: 26
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "dtc silver tracked ttu f7 v-mid",
    style: {
      width: 48
    }
  }, "Data"), /*#__PURE__*/React.createElement("div", {
    className: "dtc truncate mid-gray"
  }, data ? null : 'No data')), !data ? null : /*#__PURE__*/React.createElement("div", {
    className: "pa3 mt2 bg-white f5 nl3 nr3 mh0-l overflow-x-auto"
  }, /*#__PURE__*/React.createElement(ObjectInspector, {
    showMaxKeys: 100,
    data: getObjectInspectorData(data),
    theme: objectInspectorTheme,
    expandPaths: toExpandPathsNotation(localPath)
  }))), !links || !links.length ? null : /*#__PURE__*/React.createElement("div", {
    className: "mv2 nl3 nr3 mh0-l"
  }, /*#__PURE__*/React.createElement(LinksTable, {
    links: links,
    onLinkClick: onLinkClick
  })));
};
export default withTranslation('explore')(ObjectInfo);