function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import extractInfo from '../../lib/extract-info';
export const CidInfo = _ref => {
  let {
    t,
    tReady,
    cid,
    className,
    ...props
  } = _ref;
  const [cidErr, setCidErr] = useState(null);
  const [cidInfo, setCidInfo] = useState(null);
  useEffect(() => {
    const asyncFn = async () => {
      try {
        if (cid) {
          setCidInfo(await extractInfo(cid));
        }
      } catch (err) {
        console.error(err);
        setCidErr(err);
      }
    };
    asyncFn();
  }, [cid]);
  return !cid ? null : /*#__PURE__*/React.createElement("section", _extends({
    className: `ph3 pv4 sans-serif ${className}`
  }, props), /*#__PURE__*/React.createElement("label", {
    className: "db pb2"
  }, /*#__PURE__*/React.createElement("a", {
    className: "tracked ttu f5 fw2 teal-muted hover-aqua link",
    href: "https://docs.ipfs.io/concepts/glossary/#cid",
    rel: "external",
    target: "_external"
  }, t('CidInfo.header'))), !cidInfo ? null : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "f7 monospace fw4 ma0 pb2 truncate mid-gray force-select",
    title: cid
  }, cid), /*#__PURE__*/React.createElement("div", {
    className: "f6 sans-serif fw4 ma0 pb2 truncate",
    id: "CidInfo-human-readable-cid"
  }, cidInfo.humanReadable), /*#__PURE__*/React.createElement("label", {
    htmlFor: "CidInfo-human-readable-cid",
    className: "db fw2 ma0 mid-gray ttu f7 tracked"
  }, t('base'), " - ", t('version'), " - ", t('codec'), " - ", t('multihash')), /*#__PURE__*/React.createElement("a", {
    href: "https://docs.ipfs.io/concepts/glossary/#multihash",
    rel: "external",
    target: "_external",
    className: "dib tracked ttu f6 fw2 teal-muted hover-aqua link mt4"
  }, t('multihash')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dib monospace f6 pt2 tr dark-gray lh-title ph2"
  }, /*#__PURE__*/React.createElement("code", {
    className: "gray"
  }, "0x"), /*#__PURE__*/React.createElement("span", {
    className: "orange force-select"
  }, cidInfo.hashFnCode), /*#__PURE__*/React.createElement("span", {
    className: "green force-select"
  }, cidInfo.hashLengthCode), /*#__PURE__*/React.createElement("span", {
    id: "CidInfo-multihash",
    className: "force-select"
  }, cidInfo.hashValueIn32CharChunks.map(chunk => /*#__PURE__*/React.createElement("span", {
    key: chunk.join('')
  }, chunk.join(''), /*#__PURE__*/React.createElement("br", null)))), /*#__PURE__*/React.createElement("label", {
    htmlFor: "CidInfo-multihash",
    className: "sans-serif fw2 ma0 mid-gray ttu f7 tracked"
  }, t('CidInfo.hashDigest')), /*#__PURE__*/React.createElement("div", {
    className: "tl lh-copy"
  }, /*#__PURE__*/React.createElement("a", {
    className: "db orange no-underline pt2",
    href: "https://docs.ipfs.io/concepts/glossary/#multicodec",
    rel: "external",
    target: "_external",
    title: "Multicodec"
  }, /*#__PURE__*/React.createElement("code", {
    className: "gray"
  }, "0x"), /*#__PURE__*/React.createElement("code", null, cidInfo.hashFnCode), " = ", cidInfo.hashFn), /*#__PURE__*/React.createElement("div", {
    id: "CidInfo-multihash",
    className: "green"
  }, /*#__PURE__*/React.createElement("code", {
    className: "gray"
  }, "0x"), /*#__PURE__*/React.createElement("code", null, cidInfo.hashLengthCode), " = ", cidInfo.hashLengthInBits, " bits"))))), !cidErr ? null : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "f5 sans-serif fw5 ma0 pv2 truncate navy"
  }, cid), /*#__PURE__*/React.createElement("div", {
    className: "red fw2 ma0 f7"
  }, cidErr.message)));
};
export default withTranslation('explore')(CidInfo);