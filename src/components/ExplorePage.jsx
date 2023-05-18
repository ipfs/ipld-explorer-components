import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'redux-bundler-react'
import ErrorBoundary from './error/ErrorBoundary'
import CidInfo from './cid-info/CidInfo'
import ObjectInfo from './object-info/ObjectInfo'
import IpldGraph from './graph/LoadableIpldGraph'
import GraphCrumb from './graph-crumb/GraphCrumb'
import ComponentLoader from './loader/ComponentLoader'
import ReactJoyride from 'react-joyride'
import { explorerTour } from '../lib/tours'

export class ExplorePage extends React.Component {
  render () {
    let { t, explore, exploreIsLoading, explorePathFromHash, doExploreLink, runTour = false, joyrideCallback, gatewayUrl, publicGatewayUrl = 'https://dweb.link' } = this.props

    if (!explorePathFromHash) {
      // No IPLD path to explore so show the intro page
      console.log('[IPLD Explorer] ExplorePage loaded without a path to explore')
      return null
    }

    // Hide the old data while we navigate to the new. We can get much fancier
    // with showing that the request is loading, but for now, this'l hide the
    // now stale info and show a loading spinner.
    explore = explore || {}
    explore = exploreIsLoading ? {} : explore

    const { error, targetNode, localPath, nodes, pathBoundaries } = explore
    const sourceNode = (nodes && nodes[0]) || null

    return (
      <div className='nt4-l'>
        <Helmet>
          <title>{t('ExplorePage.title')}</title>
        </Helmet>

        {pathBoundaries && targetNode
          ? (
            <GraphCrumb
              className='joyride-explorer-crumbs'
              style={{ padding: '15px 0 10px' }}
              cid={sourceNode.cid}
              pathBoundaries={pathBoundaries}
              localPath={localPath}
            />
          )
          : <div style={{ height: 54 }} />}

        <div className='dt-l dt--fixed'>
          <div className='dtc-l w-100 w-two-thirds-l pr3-l v-top'>
            {error ? (
              <div className='bg-red white pa3 lh-copy'>
                {error}
              </div>
            ) : null}

            {targetNode
              ? (
                <ObjectInfo
                  className='joyride-explorer-node'
                  style={{ background: '#FBFBFB' }}
                  cid={targetNode.cid}
                  localPath={localPath}
                  size={targetNode.size}
                  links={targetNode.links}
                  data={targetNode.data}
                  type={targetNode.type}
                  format={targetNode.format}
                  onLinkClick={doExploreLink}
                  gatewayUrl={gatewayUrl}
                  publicGatewayUrl={publicGatewayUrl}
                />
              )
              : null}

            {!error && !targetNode
              ? <ComponentLoader pastDelay />
              : null}
          </div>

          <div className='dtc-l w-third-l v-top pt3 pt0-l'>
            {targetNode
              ? (
                <CidInfo
                  className='joyride-explorer-cid'
                  style={{ background: '#FBFBFB', overflow: 'hidden' }}
                  cid={targetNode.cid}
                />
              )
              : null}

            {targetNode
              ? (
                <ErrorBoundary>
                  <IpldGraph
                    className='joyride-explorer-graph'
                    style={{ width: '100%', height: 300 }}
                    path={targetNode.cid}
                    links={targetNode.links}
                    onNodeClick={doExploreLink}
                  />
                </ErrorBoundary>
              )
              : null}
          </div>
        </div>

        <ReactJoyride
          run={runTour}
          steps={explorerTour.getSteps({ t })}
          styles={explorerTour.styles}
          callback={joyrideCallback}
          continuous
          scrollToFirstStep
          showProgress
        />
      </div>
    )
  }
}

export default connect(
  'selectExplore',
  'selectExploreIsLoading',
  'selectExplorePathFromHash',
  'doExploreLink',
  withTranslation('explore')(ExplorePage)
)
