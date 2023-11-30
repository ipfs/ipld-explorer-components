import React from 'react';
import { Helmet } from 'react-helmet';
import { withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import AboutIpld from './about/AboutIpld';
import IpldExploreForm from './explore/IpldExploreForm';
import { colorForNode, nameForNode, shortNameForNode } from './object-info/ObjectInfo';
import { projectsTour } from '../lib/tours';
const ExploreSuggestion = _ref => {
  let {
    cid,
    name,
    type
  } = _ref;
  return /*#__PURE__*/React.createElement("a", {
    className: "flex items-center lh-copy pl3 pl0-l pv3 bb b--black-10 link focus-outline",
    href: `#/explore/${cid}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center justify-center w3 h3 w3-m h3-m w3-l h3-l flex-none br-100 tc",
    style: {
      background: colorForNode(type)
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "montserrat fw3 f6 snow",
    title: nameForNode(type)
  }, shortNameForNode(type))), /*#__PURE__*/React.createElement("span", {
    className: "pl3 truncate"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ma0 fw4 f5 db black montserrat"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "f7 db blue truncate monospace"
  }, cid)));
};
const StartExploringPage = _ref2 => {
  let {
    t,
    embed,
    runTour = false,
    joyrideCallback
  } = _ref2;
  return /*#__PURE__*/React.createElement("div", {
    className: "mw9 center explore-sug-2"
  }, /*#__PURE__*/React.createElement(Helmet, null, /*#__PURE__*/React.createElement("title", null, t('StartExploringPage.title'))), /*#__PURE__*/React.createElement("div", {
    className: "flex-l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-auto-l mr3-l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl3 pl0-l pt4 pt2-l"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "f3 f2-l ma0 fw4 montserrat charcoal"
  }, t('StartExploringPage.header')), /*#__PURE__*/React.createElement("p", {
    className: "lh-copy f5 avenir charcoal-muted"
  }, t('StartExploringPage.leadParagraph'))), embed ? /*#__PURE__*/React.createElement(IpldExploreForm, null) : null, /*#__PURE__*/React.createElement("ul", {
    className: "list pl0 ma0 mt4 mt0-l bt bn-l b--black-10"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "Project Apollo Archives",
    cid: "QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D",
    type: "dag-pb"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "XKCD Archives",
    cid: "QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm",
    type: "dag-pb"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "HAMT-sharded Wikipedia mirror (>20M files)",
    cid: "bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze",
    type: "hamt-sharded-directory"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "B-tree search index from ipfs-geoip",
    cid: "bafyreif3tfdpr5n4jdrbielmcapwvbpcthepfkwq2vwonmlhirbjmotedi",
    type: "dag-cbor"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "DAG-CBOR Block",
    cid: "bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq",
    type: "dag-cbor"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "dag-cbor hello world (keccak-256)",
    cid: "bafyrwigbexamue2ba3hmtai7hwlcmd6ekiqsduyf5avv7oz6ln3radvjde",
    type: "dag-cbor"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "Ceramic LogEntry for sgb.chat Ambassador proposal",
    cid: "bagcqcerarvdwmhvk73mze3e2n6yvpt5h7fh3eae7n6y3hizsflz5grpyeczq",
    type: "dag-jose"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "hello world (blake3)",
    cid: "bagaaihraf4oq2kddg6o5ewlu6aol6xab75xkwbgzx2dlot7cdun7iirve23a",
    type: "dag-json"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "hello world",
    cid: "baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea",
    type: "dag-json"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "hello world (sha3-512)",
    cid: "bagaaifcavabu6fzheerrmtxbbwv7jjhc3kaldmm7lbnvfopyrthcvod4m6ygpj3unrcggkzhvcwv5wnhc5ufkgzlsji7agnmofovc2g4a3ui7ja",
    type: "json"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "Raw Block for \"hello\"",
    cid: "bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq",
    type: "raw"
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ExploreSuggestion, {
    name: "Raw Block for \"hello\" (blake3)",
    cid: "bafkr4ihkr4ld3m4gqkjf4reryxsy2s5tkbxprqkow6fin2iiyvreuzzab4",
    type: "raw"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pt2-l"
  }, /*#__PURE__*/React.createElement(AboutIpld, null))), /*#__PURE__*/React.createElement(ReactJoyride, {
    run: runTour,
    steps: projectsTour.getSteps({
      t
    }),
    styles: projectsTour.styles,
    callback: joyrideCallback,
    scrollToFirstStep: true
  }));
};
export default withTranslation('explore')(StartExploringPage);