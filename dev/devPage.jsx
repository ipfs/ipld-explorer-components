/* globals globalThis */
import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { composeBundles, createRouteBundle } from 'redux-bundler'
import { Provider as ReduxStoreProvider, connect } from 'redux-bundler-react'
import ReactDOM from 'react-dom';
import i18n from '../dist/i18n'
import { exploreBundle, ExplorePage, StartExploringPage } from '../dist/index.js'
import heliaBundle from '../dist/bundles/helia'

import { Buffer } from 'buffer'
import 'tachyons'
import 'ipfs-css'
import 'react-virtualized/styles.css'
import '../dist/components/object-info/LinksTable.css'
import '../dist/components/loader/Loader.css'

globalThis.Buffer = Buffer

const routesBundle = createRouteBundle(
  {
    '/explore*': ExplorePage,
    '/': StartExploringPage,
    '': StartExploringPage
  },
  {
    routeInfoSelector: 'selectHash'
  }
)
const getStore = composeBundles(
  exploreBundle(),
  routesBundle,
  heliaBundle,
)

const PageRenderer = connect(
  'selectRoute',
  'selectQueryObject',
  'doUpdateUrl',
  'doInitIpfs',
  (props) => {
    const Page = props?.route
    const { embed } = props.queryObject
    useEffect(() => {
      props.doInitIpfs()
    }, [])

    return (
      <div style={{margin: '5vh 10vw'}}>
        <Page embed={embed}/>
      </div>
    )
  }
)

const App = () => {
  return (
    <ReduxStoreProvider store={getStore()}>
      <I18nextProvider i18n={i18n}>
        <PageRenderer />
      </I18nextProvider>
    </ReduxStoreProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
