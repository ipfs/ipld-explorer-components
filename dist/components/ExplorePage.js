import React from 'react';
import { Helmet } from 'react-helmet';
import { withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import { connect } from 'redux-bundler-react';
import CidInfo from './cid-info/CidInfo';
import ErrorBoundary from './error/ErrorBoundary';
import { IpldExploreErrorComponent } from './explore/IpldExploreErrorComponent';
import IpldGraph from './graph/LoadableIpldGraph';
import GraphCrumb from './graph-crumb/GraphCrumb';
import ComponentLoader from './loader/ComponentLoader';
import ObjectInfo from './object-info/ObjectInfo';
import { explorerTour } from '../lib/tours';
export class ExplorePage extends React.Component {
  render() {
    let {
      t,
      explore,
      exploreIsLoading,
      explorePathFromHash,
      doExploreLink,
      runTour = false,
      joyrideCallback,
      gatewayUrl,
      publicGatewayUrl = 'https://dweb.link'
    } = this.props;
    if (!explorePathFromHash) {
      // No IPLD path to explore so show the intro page
      console.warn('[IPLD Explorer] ExplorePage loaded without a path to explore');
      return null;
    }

    // Hide the old data while we navigate to the new. We can get much fancier
    // with showing that the request is loading, but for now, this'l hide the
    // now stale info and show a loading spinner.
    explore = explore || {};
    explore = exploreIsLoading ? {} : explore;
    const {
      error,
      targetNode,
      localPath,
      nodes,
      pathBoundaries
    } = explore;
    const sourceNode = nodes && nodes[0] || null;
    return /*#__PURE__*/React.createElement("div", {
      className: "nt4-l"
    }, /*#__PURE__*/React.createElement(Helmet, null, /*#__PURE__*/React.createElement("title", null, t('ExplorePage.title'))), pathBoundaries && targetNode ? /*#__PURE__*/React.createElement(GraphCrumb, {
      className: "joyride-explorer-crumbs",
      style: {
        padding: '15px 0 10px'
      },
      cid: sourceNode.cid,
      pathBoundaries: pathBoundaries,
      localPath: localPath
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        height: 54
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "dt-l dt--fixed"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dtc-l w-100 w-two-thirds-l pr3-l v-top"
    }, /*#__PURE__*/React.createElement(IpldExploreErrorComponent, {
      error: error
    }), targetNode ? /*#__PURE__*/React.createElement(ObjectInfo, {
      className: "joyride-explorer-node",
      style: {
        background: '#FBFBFB'
      },
      cid: targetNode.cid,
      localPath: localPath,
      size: targetNode.size,
      links: targetNode.links,
      data: targetNode.data,
      type: targetNode.type,
      format: targetNode.format,
      onLinkClick: doExploreLink,
      gatewayUrl: gatewayUrl,
      publicGatewayUrl: publicGatewayUrl
    }) : null, !error && !targetNode ? /*#__PURE__*/React.createElement(ComponentLoader, {
      pastDelay: true
    }) : null), /*#__PURE__*/React.createElement("div", {
      className: "dtc-l w-third-l v-top pt3 pt0-l"
    }, targetNode ? /*#__PURE__*/React.createElement(CidInfo, {
      className: "joyride-explorer-cid",
      style: {
        background: '#FBFBFB',
        overflow: 'hidden'
      },
      cid: targetNode.cid
    }) : null, targetNode ? /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(IpldGraph, {
      className: "joyride-explorer-graph",
      style: {
        width: '100%',
        height: 300
      },
      path: targetNode.cid,
      links: targetNode.links,
      onNodeClick: doExploreLink
    })) : null)), /*#__PURE__*/React.createElement(ReactJoyride, {
      run: runTour,
      steps: explorerTour.getSteps({
        t
      }),
      styles: explorerTour.styles,
      callback: joyrideCallback,
      continuous: true,
      scrollToFirstStep: true,
      showProgress: true
    }));
  }
}
export default connect('selectExplore', 'selectExploreIsLoading', 'selectExplorePathFromHash', 'doExploreLink', withTranslation('explore')(ExplorePage));