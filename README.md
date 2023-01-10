# IPLD Explorer Components

> React components for https://explore.ipld.io (https://github.com/ipfs/explore.ipld.io) and ipfs-webui

![Screenshot of the IPLD explorer](https://user-images.githubusercontent.com/58871/43152632-f310763c-8f66-11e8-9449-2e362a9f3047.png)

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg)](https://protocol.ai/) [![](https://img.shields.io/badge/project-IPFS-blue.svg)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg)](http://webchat.freenode.net/?channels=%23ipfs) [![Build Status](https://img.shields.io/circleci/project/github/ipfs-shipyard/ipld-explorer-components.svg?style=flat-square)](https://circleci.com/gh/ipfs-shipyard/ipld-explorer-components) [![Dependencies Status](https://david-dm.org/ipfs-shipyard/ipld-explorer-components/master/status.svg)](https://david-dm.org/ipfs-shipyard/ipld-explorer-components/master)

## Background

This module was extracted from the [explore.ipld.io](https://github.com/ipfs/explore.ipld.io) so it could be reused from the [IPFS Web UI](https://github.com/ipfs/ipfs-webui).

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
  IpldCarExploreForm,
  CidInfo,
  IpldGraph
  ObjectInfo,
  exploreBundle
}
```

There are `peerDependencies` so that the parent app can pick the versions of common deps. You'll need to add relevant deps to your project.


And, assuming you are using `create-react-app` or a similar webpack set up, you'll need the following CSS imports:

```js
import 'tachyons'
import 'ipfs-css'
import 'react-virtualized/styles.css'
import 'ipld-explorer-components/dist/components/object-info/LinksTable.css'
import 'ipld-explorer-components/dist/components/loader/Loader.css'
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/ipfs-shipyard/ipld-explorer/issues/new) or submit PRs.

To contribute to IPFS in general, see the [contributing guide](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)

## Releasing

- Run `tx pull -a` to pull the latest translations from Transifex ([i18n#transifex-101)](https://github.com/ipfs-shipyard/i18n#transifex-101))
- Update the version (`npm version major/minor/patch`)
- Push the changes (`git push && git push --follow-tags`)
- Update the [changelog](./CHANGELOG.md)
- Add release notes to https://github.com/ipfs-shipyard/ipld-explorer-components/releases, use the tag and copy changelog changes
- Publish to npm (`npm publish`)

## License

[MIT](LICENSE) © Protocol Labs
