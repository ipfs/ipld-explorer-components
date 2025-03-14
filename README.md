# IPLD Explorer Components

> React components for https://explore.ipld.io (https://github.com/ipfs/explore.ipld.io) and ipfs-webui

![Screenshot of the IPLD explorer](https://user-images.githubusercontent.com/58871/43152632-f310763c-8f66-11e8-9449-2e362a9f3047.png)

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg)](https://protocol.ai/) [![](https://img.shields.io/badge/project-IPFS-blue.svg)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg)](http://webchat.freenode.net/?channels=%23ipfs) [![Build Status](https://img.shields.io/circleci/project/github/ipfs-shipyard/ipld-explorer-components.svg?style=flat-square)](https://circleci.com/gh/ipfs-shipyard/ipld-explorer-components) [![Dependencies Status](https://david-dm.org/ipfs-shipyard/ipld-explorer-components/master/status.svg)](https://david-dm.org/ipfs-shipyard/ipld-explorer-components/master)

## Background

This module was extracted from the [explore.ipld.io](https://github.com/ipfs/explore.ipld.io) so it could be reused from the [IPFS Web UI](https://github.com/ipfs/ipfs-webui).

## Usage

**WARNING: This module is not intended to be re-used in it's current form by other projects.** There is more work to do to make this a nice set of generic components.

Install it from npm:

```console
npm install --save ipld-explorer-components
```

There are `peerDependencies` so that the consuming app can pick the versions of common deps. You'll need to add relevant deps to your project.

### Use it in your project

You can see an example of how to use these components in the [devPage.tsx](./dev/devPage.tsx) file.

```jsx
// index.tsx
import React from 'react'
import {render} from 'react-dom'
import MyHeader from './app'

const PageRenderer = (): React.ReactElement => {
  /**
   * This is a simple example of listening to the hash change event that occurs when the user clicks around in the content rendered by ExplorePage.
   */
  const [route, setRoute] = useState(window.location.hash.slice(1) ?? '/')

  useEffect(() => {
    const onHashChange = (): void => { setRoute(window.location.hash.slice(1) ?? '/') }
    window.addEventListener('hashchange', onHashChange)
    return () => { window.removeEventListener('hashchange', onHashChange) }
  }, [])

  const RenderPage: React.FC = () => {
    switch (true) {
      case route.startsWith('/explore'):
        return <ExplorePage />
      case route === '/':
      default:
        return <StartExploringPage />
    }
  }

  return (
    <RenderPage />
  )
}
const App = (): React.ReactElement => {
  return (
    <HeliaProvider>
      <ExploreProvider>
        <MyHeader />
        <PageRenderer />
      </ExploreProvider>
    </HeliaProvider>
  )
}

const rootEl = document.getElementById('root')
if (rootEl == null) {
  throw new Error('No root element found with the id "root"')
}
const root = createRoot(rootEl)
root.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
)

```

### Exports provided by this library

```js
import { HeliaProvider, ExploreProvider } from 'ipld-explorer-components/providers'
import { StartExploringPage, ExplorePage } from 'ipld-explorer-components/pages'
import { IpldExploreForm, IpldCarExploreForm } from 'ipld-explorer-components/forms'
// or import all components at once
import { HeliaProvider, ExploreProvider, StartExploringPage, ExplorePage, IpldExploreForm, IpldCarExploreForm, CidInfo, ObjectInfo } from 'ipld-explorer-components'
```

The following Components are available:

```js
export {
  /**
   * Helia provider required for IPLD Explorer components
   */
  HeliaProvider,
  /**
   * A hook to gain access to the Helia node
   */
  useHelia,
  /**
   * Explore provider required for IPLD Explorer components. This must be a child  (direct or not) of HeliaProvider.
   */
  ExploreProvider,
  /**
   * A hook to gain access to the Explore state. You can programmatically set the CID or path to explore using the provided functions.
   */
  useExplore,
  /**
   * The page to render when you do not have an explicit CID in the URL to explore yet.
   */
  StartExploringPage,
  /**
   * When there is a #/explore/CID in the URL, this component will render the ExplorePage
   */
  ExplorePage,
  /**
   * The form to use to allow entry of a CID to explore. You can place this anywhere in your app within the ExploreProvider.
   */
  IpldExploreForm,
  /**
   * The form to use to allow uploading of a CAR file to explore. You can place this anywhere in your app within the ExploreProvider.
   */
  IpldCarExploreForm,
  CidInfo,
  ObjectInfo,
}
```


### Styling

And, assuming you are using `create-react-app` or a similar webpack set up, you'll need the following CSS imports:

```js
import 'tachyons'
import 'ipfs-css'
import 'ipld-explorer-components/css'
```

### Customizing the links displayed in the StartExploringPage

To customize the links displayed in the start exploring page, you can pass a `links` property to the `StartExploringPage` component. This property should be an array of objects with the following properties:

```
{
  name: 'Name of your example link',
  cid: 'bafyfoo...',
  type: 'dag-pb' // or dag-json, etc...
}
```

### i18n support

The translations used for this library are provided in `dist/locales`. You can use them in your project by importing them and passing them to the `i18n` instance in your project.

```ts
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'
import ICU from 'i18next-icu'
import LocalStorageBackend from 'i18next-localstorage-backend'
import { version } from '../package.json'
import locales from './lib/languages.json'

export const localesList = Object.values(locales)

await i18n
  .use(ICU)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    backend: {
      backends: [
        LocalStorageBackend,
        HttpBackend
      ],
      backendOptions: [
        { // LocalStorageBackend
          defaultVersion: version,
          expirationTime: (!import.meta.env.NODE_ENV || imObjectInfo.publicGatewayport.meta.env.NODE_ENV === 'development') ? 1 : 7 * 24 * 60 * 60 * 1000
        },
        { // HttpBackend
          // ensure a relative path is used to look up the locales, so it works when loaded from /ipfs/<cid>
          loadPath: (lngs, namespaces) => {
            const lang = lngs[0]
            const ns = namespaces[0]
            if (ns === 'explore') {
              // use the ipld-explorer-components locales
              return 'node_modules/ipld-explorer-components/dist/locales/{{lng}}/{{ns}}.json'
            }

            // you can override keys in the explore namespace with your own translations. If they are not found, the explore translations will be used.
            return `locales/${lang}/${ns}.json`
          }
        }
      ]
    },
    ns: ['explore', 'app'],
    defaultNS: 'app',
    fallbackNS: 'explore', // fallback to explore namespace if the key is not found in the app namespace
    fallbackLng: {
      'zh-Hans': ['zh-CN', 'en'],
      'zh-Hant': ['zh-TW', 'en'],
      zh: ['zh-CN', 'en'],
      default: ['en']
    },
    debug: import.meta.env.DEBUG,
    // react i18next special options (optional)
    react: {
      // wait: true,
      // useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  })
```

## Development

### Adding another codec

**NOTE:** PRs adding an old IPLDFormat codec would need the old `blockcodec-to-ipld-format` tool, which has many out-of-date deps. We will only accept PRs for adding BlockCodec interface codecs.

To add another codec, you will need to update all locations containing the comment `// #WhenAddingNewCodec`:

1. Add a dependency on the codec to this package (if it's not already in multiformats or other package)
1. Add the codec in the switch statement in [./src/lib/codec-importer.ts](./src/lib/codec-importer.ts)
1. Update [./src/lib/get-codec-name-from-code.ts](./src/lib/get-codec-name-from-code.ts) to return the codec name for your codec
1. Add a unit test to [./src/lib/resolve-ipld-path.test.js](./src/lib/resolve-ipld-path.test.js) and ensure that calling `resolveIpldPath` returns the expected results
    * If the default `resolveFn` in [./src/lib/get-codec-for-cid.ts](./src/lib/get-codec-for-cid.ts) doesn't resolve your paths correctly, you will need to add a resolver method for your codec to the `codecResolverMap` in [./src/lib/get-codec-for-cid.ts](./src/lib/get-codec-for-cid.ts)

see https://github.com/ipfs/ipld-explorer-components/pull/360#discussion_r1206251817 for history.

### Adding another hasher

To add another hasher, you will need to update all locations containing the comment `// #WhenAddingNewHasher`:

1. Add a dependency on the hasher to this package (if it's not already in multiformats or other package)
1. Update [./src/lib/hash-importer.ts](./src/lib/hash-importer.ts)
    - Update `SupportedHashers` to include your hasher type
    - Update `getHasherForCode` to return your hasher
1. Update the hasher codes used by the `hashers` property passed to Helia init in [./src/lib/init-helia.ts](./src/lib/init-helia.ts)

see https://github.com/ipfs/ipld-explorer-components/pull/395 for an example.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/ipfs/ipld-explorer-components/issues/new) or submit PRs.

To contribute to IPFS in general, see the [contributing guide](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)

## Releasing

- Run `tx pull -a` to pull the latest translations from Transifex ([i18n#transifex-101)](https://github.com/ipfs-shipyard/i18n#transifex-101))
- Update the version (`npm version major/minor/patch`)
- Push the changes (`git push && git push --follow-tags`)
- Update the [changelog](./CHANGELOG.md)
- Add release notes to https://github.com/ipfs/ipld-explorer-components/releases, use the tag and copy changelog changes
- Publish to npm (`npm publish`)

## License

[MIT](LICENSE) © Protocol Labs
