import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import ReactJoyride from 'react-joyride'
import { Loader } from '../components/loader/loader.js'
import { explorerTour } from '../lib/tours.js'
import { useExplore } from '../providers/explore.js'
import { useHelia } from '../providers/helia.js'
import CidInfo from './cid-info/CidInfo.js'
import ErrorBoundary from './error/ErrorBoundary'
import { IpldExploreErrorComponent } from './explore/IpldExploreErrorComponent'
import IpldGraph from './graph/IpldGraphCytoscape.js'
import GraphCrumb from './graph-crumb/GraphCrumb.js'
import ComponentLoader from './loader/component-loader.js'
import { ObjectInfo } from './object-info/ObjectInfo.js'

export const ExplorePage = ({
  runTour = false,
  joyrideCallback,
  gatewayUrl,
  publicGatewayUrl = 'https://dweb.link'
}: {
  runTour?: boolean
  joyrideCallback?: any
  gatewayUrl?: any
  publicGatewayUrl?: string
}): null | React.ReactNode => {
  const { t, ready: tReady } = useTranslation('explore')

  const { helia } = useHelia()
  const { exploreState, doExploreLink } = useExplore()
  const { path } = exploreState

  if (path == null) {
    // No IPLD path to explore so show the intro page
    console.warn('[IPLD Explorer] ExplorePage loaded without a path to explore')
    return null
  }

  const { error, targetNode, localPath, nodes, pathBoundaries } = exploreState
  const sourceNode = nodes?.[0] ?? null

  if (!tReady || helia == null) {
    return <Loader color='dark' />
  }

  return (
      // <div className='nt4-l'>
      <div>
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
          : <div style={{ height: 54 }} />}

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
              : null}

            {(error == null) && targetNode == null
              ? <ComponentLoader />
              : null}
          </div>

          <div className='dtc-l w-third-l v-top pt3 pt0-l'>
            {targetNode != null
              ? (
                <CidInfo
                  className='joyride-explorer-cid'
                  style={{ background: '#FBFBFB', overflow: 'hidden' }}
                  cid={targetNode.cid}
                />
                )
              : null}

            {targetNode != null
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

export default ExplorePage
