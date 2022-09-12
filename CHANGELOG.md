## [2.6.0](https://github.com/ipfs/ipld-explorer-components/compare/v2.5.1...v2.6.0) (2022-09-12)


### Features

* Create CODEOWNERS ([#334](https://github.com/ipfs/ipld-explorer-components/issues/334)) ([bfebc26](https://github.com/ipfs/ipld-explorer-components/commit/bfebc26d5acfef19c11c2228ee28efccf069bcd1))


### Trivial Changes

* Update .github/workflows/stale.yml [skip ci] ([9a24598](https://github.com/ipfs/ipld-explorer-components/commit/9a24598acecb937dc7757f32c4e9468ed7a48876))

### [2.5.1](https://github.com/ipfs/ipld-explorer-components/compare/v2.5.0...v2.5.1) (2022-07-12)


### Bug Fixes

* remove unmatched parenthesis ([#320](https://github.com/ipfs/ipld-explorer-components/issues/320)) ([00b9005](https://github.com/ipfs/ipld-explorer-components/commit/00b90058d3001deab10b9a3c208145de779eb9a3))

## [2.5.0](https://github.com/ipfs/ipld-explorer-components/compare/v2.4.1...v2.5.0) (2022-07-06)


### Features

* automatic translation updates ([#327](https://github.com/ipfs/ipld-explorer-components/issues/327)) ([4e17872](https://github.com/ipfs/ipld-explorer-components/commit/4e178723df51d1d6bcc53054b1de93308d65fb56))


### Trivial Changes

* fix tx-pull.yml ([006c50d](https://github.com/ipfs/ipld-explorer-components/commit/006c50d5db48ff243c8b443eab8fc7be0013885b))
* pull new translations ([#328](https://github.com/ipfs/ipld-explorer-components/issues/328)) ([2763f08](https://github.com/ipfs/ipld-explorer-components/commit/2763f08fa1685a7cda66737f57ec66f5eac6e316))

### [2.4.1](https://github.com/ipfs/ipld-explorer-components/compare/v2.4.0...v2.4.1) (2022-06-06)


### Bug Fixes

* **css:** make gateway links responsive ([#325](https://github.com/ipfs/ipld-explorer-components/issues/325)) ([4ff9c3e](https://github.com/ipfs/ipld-explorer-components/commit/4ff9c3ef2a8921646ea77f50431405aa41366f66))

## [2.4.0](https://github.com/ipfs/ipld-explorer-components/compare/v2.3.0...v2.4.0) (2022-06-06)


### Features

* private and public gateways ([#300](https://github.com/ipfs/ipld-explorer-components/issues/300)) ([7a15812](https://github.com/ipfs/ipld-explorer-components/commit/7a1581281305e3205d127eea8b26eea89f1c2f16))

## [2.3.0](https://github.com/ipfs/ipld-explorer-components/compare/v2.2.1...v2.3.0) (2022-05-16)


### Features

* support dag-json ([#319](https://github.com/ipfs/ipld-explorer-components/issues/319)) ([b39886b](https://github.com/ipfs/ipld-explorer-components/commit/b39886be78a1536afbca27e6beab52bd2d7d86cd))

### [2.2.1](https://github.com/ipfs/ipld-explorer-components/compare/v2.2.0...v2.2.1) (2022-04-25)


### Trivial Changes

* **i18n:** sync locales ([f18b151](https://github.com/ipfs/ipld-explorer-components/commit/f18b1518dd891f783dfd9e37e50b58d3a0c67913))

## [2.2.0](https://github.com/ipfs/ipld-explorer-components/compare/v2.1.1...v2.2.0) (2022-04-25)


### Features

* CAR Upload loader  ([#318](https://github.com/ipfs/ipld-explorer-components/issues/318)) ([cf30c14](https://github.com/ipfs/ipld-explorer-components/commit/cf30c14827ded41bb6e2a40c8ff809537fbbca7f))

### [2.1.1](https://github.com/ipfs/ipld-explorer-components/compare/v2.1.0...v2.1.1) (2022-04-13)


### Bug Fixes

* convert car stream to iterable ([#317](https://github.com/ipfs/ipld-explorer-components/issues/317)) ([87a83d0](https://github.com/ipfs/ipld-explorer-components/commit/87a83d05c318c42b60276d2d7ebf59e8ecf5a39b))

## [2.1.0](https://github.com/ipfs/ipld-explorer-components/compare/v2.0.4...v2.1.0) (2022-04-13)


### Features

* introduce ipld car explorer form ([#313](https://github.com/ipfs/ipld-explorer-components/issues/313)) ([c89e6ca](https://github.com/ipfs/ipld-explorer-components/commit/c89e6ca72238f33901bd796b24835f1c4a20fa3b))


### Trivial Changes

* add auto-release ([#314](https://github.com/ipfs/ipld-explorer-components/issues/314)) ([0c5551a](https://github.com/ipfs/ipld-explorer-components/commit/0c5551a1858fc00e6a09964a91e9461810633fd2))
* fix community CONTRIBUTING.md links ([#305](https://github.com/ipfs/ipld-explorer-components/issues/305)) ([37cdc9d](https://github.com/ipfs/ipld-explorer-components/commit/37cdc9d1e4eca8b6c11c5fd8fcd7ae111ecabf61))
* **release:** add missing dep ([e58faaa](https://github.com/ipfs/ipld-explorer-components/commit/e58faaa0a14372ff0a95e577a523478f5ff67cb6))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.2] - 2021-04-12

- fix: restore standalone ipld instance (#289)

## [v2.0.1] - 2021-04-07

- chore: update multibase dependency

## [v2.0.0] - 2021-04-03

- chore: update dependencies and ipld (#287)
- chore(i18n): sync locales for storybook use

### BREAKING CHANGES

- Requires JS IPFS API to return Uint8Array instead of Buffer

## [v1.6.1] - 2020-10-06

- fix: font setting for react-inspector
- chore: update translations and add AR/RO languages
- chore: update dependencies

## [v1.6.0] - 2020-06-04

- fix(i18): correctly load all translations (#245) 
- fix: show as many node links as height allows (#238)
- chore: dependency bumps & aligning with ipfs-webui
