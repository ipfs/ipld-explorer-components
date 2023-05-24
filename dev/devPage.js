/* globals globalThis */
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { composeBundles, createRouteBundle } from 'redux-bundler';
import { Provider as ReduxStoreProvider, connect } from 'redux-bundler-react';
import ReactDOM from 'react-dom';
import i18n from '../dist/i18n';
import { exploreBundle, ExplorePage, StartExploringPage } from '../dist/index.js';
// import ipfsBundle from './bundles/ipfs'
import heliaBundle from '../dist/bundles/helia';
import { Buffer } from 'buffer';
import 'tachyons';
import 'ipfs-css';
import 'react-virtualized/styles.css';
import '../dist/components/object-info/LinksTable.css';
import '../dist/components/loader/Loader.css';
globalThis.Buffer = Buffer;
// import i18nDecorator from './i18n-decorator.js'
const routesBundle = createRouteBundle({
    '/explore*': ExplorePage,
    '/': StartExploringPage,
    '': StartExploringPage
}, {
    routeInfoSelector: 'selectHash'
});
const getStore = composeBundles(exploreBundle(), routesBundle, 
// ipfsBundle,
heliaBundle);
const PageRenderer = connect('selectRoute', 'selectQueryObject', 'doUpdateUrl', 'doInitIpfs', (props) => {
    console.log(`props: `, props);
    const Page = props?.route;
    console.log(`Page: `, Page);
    const { embed } = props.queryObject;
    console.log(`embed: `, embed);
    useEffect(() => {
        props.doInitIpfs();
    }, []);
    return (
    // <span>test</span>
    React.createElement("div", { style: { margin: '5vh 10vw' } },
        React.createElement(Page, { embed: embed })));
});
const App = () => {
    return (React.createElement(ReduxStoreProvider, { store: getStore() },
        React.createElement(I18nextProvider, { i18n: i18n },
            React.createElement(PageRenderer, null))));
};
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
// root.render(<App />);
