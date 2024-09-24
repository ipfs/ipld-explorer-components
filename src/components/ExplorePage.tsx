import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation, withTranslation } from 'react-i18next'
import ReactJoyride from 'react-joyride'
import { explorerTour } from '../lib/tours.jsx'
import { useExplore } from '../providers/explore.jsx'
import CidInfo from './cid-info/CidInfo.jsx'
import ErrorBoundary from './error/ErrorBoundary'
import { IpldExploreErrorComponent } from './explore/IpldExploreErrorComponent'
import IpldGraph from './graph/LoadableIpldGraph'
import GraphCrumb from './graph-crumb/GraphCrumb.jsx'
import ComponentLoader from './loader/ComponentLoader.jsx'
import { ObjectInfo } from './object-info/ObjectInfo.jsx'

export const ExplorePage = ({
  // explore,
  // exploreIsLoading,
  explorePathFromHash,
  doExploreLink,
  runTour = false,
  joyrideCallback,
  gatewayUrl,
  publicGatewayUrl = 'https://dweb.link'
}: {
  // explore: any
  // exploreIsLoading: any
  explorePathFromHash: any
  doExploreLink: any
  runTour?: boolean
  joyrideCallback: any
  gatewayUrl: any
  publicGatewayUrl?: string
}): null | JSX.Element => {
  const { t, ready: tReady } = useTranslation('explore')

  const { exploreState, selectExplorePathFromHash } = useExplore()

  if (selectExplorePathFromHash() == null) {
    // No IPLD path to explore so show the intro page
    console.warn('[IPLD Explorer] ExplorePage loaded without a path to explore')
    return null
  }

  // Hide the old data while we navigate to the new. We can get much fancier
  // with showing that the request is loading, but for now, this'l hide the
  // now stale info and show a loading spinner.
  // explore = explore ?? {}
  // explore = exploreIsLoading != null ? {} : explore

  const { error, targetNode, localPath, nodes, pathBoundaries } = exploreState
  const sourceNode = nodes?.[0] ?? null

  if (!tReady) {
    return null
  }

  return (
    <div className='nt4-l'>
      <Helmet>
        <title>{t('ExplorePage.title')}</title>
      </Helmet>

      {pathBoundaries != null && targetNode != null
        ? (
        <GraphCrumb
          className='joyride-explorer-crumbs'
          style={{ padding: '15px 0 10px' }}
          cid={sourceNode.cid}
          pathBoundaries={pathBoundaries}
          localPath={localPath}
        />
          )
        : (
        <div style={{ height: 54 }} />
          )}

      <div className='dt-l dt--fixed'>
        <div className='dtc-l w-100 w-two-thirds-l pr3-l v-top'>
          <IpldExploreErrorComponent error={error} />

          {targetNode != null
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
            : (
            <ComponentLoader pastDelay />
              )}
        </div>
        <div className='dtc-l w-100 w-third-l v-top'>
          <ErrorBoundary>
            <IpldGraph
              className='joyride-explorer-graph'
              style={{ height: '100%' }}
              path={explorePathFromHash}
              links={targetNode?.links}
              onLinkClick={doExploreLink}
            />
          </ErrorBoundary>
        </div>
      </div>

      <ReactJoyride
        run={runTour}
        steps={explorerTour.getSteps({ t })}
        styles={explorerTour.styles}
        callback={joyrideCallback}
        scrollToFirstStep
      />
    </div>
  )
}

export default ExplorePage
