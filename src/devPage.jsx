import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { composeBundles, createRouteBundle } from 'redux-bundler'
import { Provider as ReduxStoreProvider, connect } from 'redux-bundler-react'
import ReactDOM from 'react-dom';
import i18n from './i18n'
import { exploreBundle, ExplorePage, StartExploringPage } from './index.js'
// import ipfsBundle from './bundles/ipfs'
import heliaBundle from './bundles/helia'

import {Buffer} from 'buffer'
globalThis.Buffer = Buffer

// import i18nDecorator from './i18n-decorator.jsx'

import 'tachyons'
import 'ipfs-css'
import 'react-virtualized/styles.css'
import './components/object-info/LinksTable.css'
import './components/loader/Loader.css'


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
  // ipfsBundle,
  heliaBundle,
)

const PageRenderer = connect(
  'selectRoute',
  'selectQueryObject',
  'doUpdateUrl',
  'doInitIpfs',
  (props) => {
    console.log(`props: `, props);
    const Page = props?.route
    console.log(`Page: `, Page);
    const { embed } = props.queryObject
    console.log(`embed: `, embed);
    useEffect(() => {
      props.doInitIpfs()
    }, [])

    return (
      // <span>test</span>
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
// root.render(<App />);
