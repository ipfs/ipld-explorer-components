# IPLD Explorer Components

> React components for https://explore.ipld.io

See: https://github.com/ipfs-shipyard/ipld-explorer

![Screenshot of the IPLD explorer](https://user-images.githubusercontent.com/58871/43152632-f310763c-8f66-11e8-9449-2e362a9f3047.png)

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg)](https://protocol.ai/) [![](https://img.shields.io/badge/project-IPFS-blue.svg)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg)](http://webchat.freenode.net/?channels=%23ipfs) [![Build Status](https://img.shields.io/circleci/project/github/ipfs-shipyard/ipld-explorer-components.svg?style=flat-square)](https://circleci.com/gh/ipfs-shipyard/ipld-explorer-components) [![Dependencies Status](https://david-dm.org/ipfs-shipyard/ipld-explorer-components/master/status.svg)](https://david-dm.org/ipfs-shipyard/ipld-explorer-components/master)

## Background

This module was extracted from the [IPLD Explorer](https://github.com/ipfs-shipyard/ipld-explorer) so it could be reused from the [IPFS Web UI](https://github.com/ipfs-shipyard/ipfs-webui).

## Usage

**WARNING: This module is not intended to be re-used in it's current form by other projects.** It's just enough to work with a `create-react-app` set up, as long as you follow the steps below. There is much more work to do to make this a nice set of generic components.

Install it from npm:

```console
npm install ipld-explorer-components
```

The ES5 friendly version of the `src` dir is generated to the `dist` dir and the
page components are all provided as named exports so you can import them like so:

```js
import {ExplorePage, StartExploringPage} from `ipld-explorer-components`
```

The following Components are available:

```js
export {
  StartExploringPage,
  ExplorePage,
  IpldExploreForm,
  CidInfo,
  IpldGraph
  ObjectInfo,
  exploreBundle
}
```

There are `peer-dependencies` so that the parent app can pick the versions of common deps. You'll need to add the following deps to your project.

```js
  "prop-types": "^15.6.4",
  "react": "^16.0.0",
  "react-dom": "^16.0.0",
  "redux-bundler": "^21.2.2",
  "redux-bundler-react": "^1.0.1",
  "react-virtualized": "^9.20.0",
  "react-helmet": "^5.2.0",
  "react-loadable": "^5.4.0",
  "tachyons": "^4.11.1",
  "ipfs-css": "^0.9.0"
```

And, assuming you are using `create-react-app` or a similar webpack set up, you'll need the following CSS imports:

```js
import 'tachyons'
import 'ipfs-css'
import 'react-virtualized/styles.css'
import 'ipld-explorer-lib/dist/components/object-info/LinksTable.css'
import 'ipld-explorer-lib/dist/components/loader/Loader.css'
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/ipfs-shipyard/ipld-explorer/issues/new) or submit PRs.

To contribute to IPFS in general, see the [contributing guide](https://github.com/ipfs/community/blob/master/contributing.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

[MIT](LICENSE) © Protocol Labs
