import React from 'react';
import { Trans, withTranslation } from 'react-i18next';
import ipldLogoSrc from './ipld.svg';
import Box from '../box/Box';
export const AboutIpld = _ref => {
  let {
    t
  } = _ref;
  return /*#__PURE__*/React.createElement(Box, {
    className: "tl dib pa4 avenir measure-wide-l lh-copy dark-gray ba-l b--black-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tc"
  }, /*#__PURE__*/React.createElement("a", {
    className: "link",
    href: "https://ipld.io"
  }, /*#__PURE__*/React.createElement("img", {
    src: ipldLogoSrc,
    alt: "IPLD",
    style: {
      height: 60
    }
  }))), /*#__PURE__*/React.createElement(Trans, {
    i18nKey: "AboutIpld.paragraph1",
    t: t
  }, /*#__PURE__*/React.createElement("p", null, "IPLD is ", /*#__PURE__*/React.createElement("strong", null, "the data model of the content-addressable web."), " It allows us to treat all hash-linked data structures as subsets of a unified information space, unifying all data models that link data with hashes as instances of IPLD.")), /*#__PURE__*/React.createElement(Trans, {
    i18nKey: "AboutIpld.paragraph2",
    t: t
  }, /*#__PURE__*/React.createElement("p", null, "Content addressing through hashes has become a widely-used means of connecting data in distributed systems, from the blockchains that run your favorite cryptocurrencies, to the commits that back your code, to the web\u2019s content at large. Yet, whilst all of these tools rely on some common primitives, their specific underlying data structures are not interoperable.")), /*#__PURE__*/React.createElement(Trans, {
    i18nKey: "AboutIpld.paragraph3",
    t: t
  }, /*#__PURE__*/React.createElement("p", null, "Enter IPLD: a single namespace for all hash-inspired protocols. Through IPLD, links can be traversed across protocols, allowing you to explore data regardless of the underlying protocol.")));
};
export default withTranslation('explore')(AboutIpld);