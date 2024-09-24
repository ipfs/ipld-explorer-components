### [7.0.3](https://github.com/ipfs/ipld-explorer-components/compare/v7.0.2...v7.0.3)

* fix: explore page can query local kubo by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/445
* fix: use delegated routing over https by @lidel in https://github.com/ipfs/ipld-explorer-components/pull/443

**Full Changelog**: https://github.com/ipfs/ipld-explorer-components/compare/v7.0.2...v7.0.3

### [7.0.2](https://github.com/ipfs/ipld-explorer-components/compare/v7.0.1...v7.0.2)

* fix: local only unless remote is enabled(default) by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/438

**Full Changelog**: https://github.com/ipfs/ipld-explorer-components/compare/v7.0.1...v7.0.2

### [7.0.1](https://github.com/ipfs/ipld-explorer-components/compare/v7.0.0...v7.0.1)

* fix: use default explore links by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/437

**Full Changelog**: https://github.com/ipfs/ipld-explorer-components/compare/v7.0.0...v7.0.1

### [7.0.0](https://github.com/ipfs/ipld-explorer-components/compare/v5.2.1...v7.0.0)

* feat!: migrate to @helia/http by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/419
* fix: release by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/420
* ci: uci/copy-templates by @web3-bot in https://github.com/ipfs/ipld-explorer-components/pull/422
* chore: bump ip from 2.0.0 to 2.0.1 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/421
* chore: bump stefanzweifel/git-auto-commit-action from 4.14.1 to 5.0.1 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/425
* CID search fix: empty searches are blocked by @ravishxt in https://github.com/ipfs/ipld-explorer-components/pull/427
* deps: update linting deps and optimize settings by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/428
* feat: update Helia packages by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/434
* chore: bump braces from 3.0.2 to 3.0.3 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/431
* chore: bump ejs from 3.1.9 to 3.1.10 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/426
* feat: add blake2b-256 hasher by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/436


**Full Changelog**: https://github.com/ipfs/ipld-explorer-components/compare/v5.2.1...v7.0.0

### [5.2.1](https://github.com/ipfs/ipld-explorer-components/compare/v5.2.0...v5.2.1) (2024-02-02)


### Trivial Changes

* Update .github/dependabot.yml [skip ci] ([7467972](https://github.com/ipfs/ipld-explorer-components/commit/7467972808e3e4545ad597b1df8ec469031dc215))
* Update .github/workflows/stale.yml [skip ci] ([e5e78da](https://github.com/ipfs/ipld-explorer-components/commit/e5e78da2bb68daf5791808f72e44d8ced008eae8))
* update README ([#412](https://github.com/ipfs/ipld-explorer-components/issues/412)) ([8b62741](https://github.com/ipfs/ipld-explorer-components/commit/8b627415e42231583ab7e7b57b5996df49e3c5be))

## [5.2.0](https://github.com/ipfs/ipld-explorer-components/compare/v5.1.2...v5.2.0) (2023-12-01)


### Features

* re-allow disabling of remote gateways ([#416](https://github.com/ipfs/ipld-explorer-components/issues/416)) ([1fa3025](https://github.com/ipfs/ipld-explorer-components/commit/1fa30251803eb0c3f8836c96ffda3f5493375718))

### [5.1.2](https://github.com/ipfs/ipld-explorer-components/compare/v5.1.1...v5.1.2) (2023-11-30)


### Bug Fixes

* add toJSON to BigInt prototype ([a606a7c](https://github.com/ipfs/ipld-explorer-components/commit/a606a7c010b77b9dc57742bd26b87590f4647711))
* react-i18next peerDep ([09589ca](https://github.com/ipfs/ipld-explorer-components/commit/09589cacc58e961eb7291c44a96b7fc8ead3cdb5))
* replace blake3-multihash with hash-wasm ([8a85612](https://github.com/ipfs/ipld-explorer-components/commit/8a85612c98404c125d86626afbaef67adf8f1a67))

### [5.1.1](https://github.com/ipfs/ipld-explorer-components/compare/v5.1.0...v5.1.1) (2023-11-30)


### Bug Fixes

* no more BigInt serialization errors ([a580bd9](https://github.com/ipfs/ipld-explorer-components/commit/a580bd985b6588ecbda7b5333b3a820d3c1181de))
* no more window is not defined errors ([794c9c6](https://github.com/ipfs/ipld-explorer-components/commit/794c9c60c227e423442131ad44a2833c8bce6369))


### Trivial Changes

* update package-lock.json ([a4089f1](https://github.com/ipfs/ipld-explorer-components/commit/a4089f1a9290844ea107996373d7db500b7f7f09))

## [5.1.0](https://github.com/ipfs/ipld-explorer-components/compare/v5.0.0...v5.1.0) (2023-11-30)


### Features

* **hasher:** add blake3 ([#395](https://github.com/ipfs/ipld-explorer-components/issues/395)) ([6ea74e5](https://github.com/ipfs/ipld-explorer-components/commit/6ea74e52d569a3012b6b12683c4bd0a37797ea79))

## [5.0.0](https://github.com/ipfs/ipld-explorer-components/compare/v4.0.3...v5.0.0) (2023-11-30)


### ⚠ BREAKING CHANGES

* update of many ipfs/ipld/libp2p/helia deps that may break consumers. API of ipld-explorer-components has not changed.

### Features

* use Helia's blockBroker interface ([#406](https://github.com/ipfs/ipld-explorer-components/issues/406)) ([c964a76](https://github.com/ipfs/ipld-explorer-components/commit/c964a76a8e29741bd7bef8e33c2207ef6ff66771))
* use ipfs-css colors and add dag-jose example ([#408](https://github.com/ipfs/ipld-explorer-components/issues/408)) ([4e96491](https://github.com/ipfs/ipld-explorer-components/commit/4e964919bfa0c05539d4aeac97041778fd962316))


### Trivial Changes

* bump protobufjs from 6.11.3 to 6.11.4 ([#393](https://github.com/ipfs/ipld-explorer-components/issues/393)) ([f8db274](https://github.com/ipfs/ipld-explorer-components/commit/f8db2747a3a37652b98a11ea49718a1ca1366550))
* **ci:** remove circleci config ([#388](https://github.com/ipfs/ipld-explorer-components/issues/388)) ([13698af](https://github.com/ipfs/ipld-explorer-components/commit/13698af1a40dd2edc2e49b1892dd5231b384d353))
* pull new translations ([#390](https://github.com/ipfs/ipld-explorer-components/issues/390)) ([2caac4a](https://github.com/ipfs/ipld-explorer-components/commit/2caac4a6cffcd49ea5ecf37c43fdb71f3a09dda8))
* pull new translations ([#396](https://github.com/ipfs/ipld-explorer-components/issues/396)) ([73799f8](https://github.com/ipfs/ipld-explorer-components/commit/73799f8f895c60479e931175d0a1496d6d5a35ee))
* pull new translations ([#405](https://github.com/ipfs/ipld-explorer-components/issues/405)) ([5805bd8](https://github.com/ipfs/ipld-explorer-components/commit/5805bd8cb06f0b4edffc86db96bf00904834a7f2))

### [4.0.3](https://github.com/ipfs/ipld-explorer-components/compare/v4.0.2...v4.0.3) (2023-07-28)


### Trivial Changes

* pull new translations ([#383](https://github.com/ipfs/ipld-explorer-components/issues/383)) ([59845d9](https://github.com/ipfs/ipld-explorer-components/commit/59845d99d08f4b0ccbf0a4377aa884f2d02407e5))

### [4.0.2](https://github.com/ipfs/ipld-explorer-components/compare/v4.0.1...v4.0.2) (2023-07-24)


### Bug Fixes

* url-encoded dag-PB names can be explored ([#384](https://github.com/ipfs/ipld-explorer-components/issues/384)) ([d5c6899](https://github.com/ipfs/ipld-explorer-components/commit/d5c6899a6eeb94860eff239f4634f2197060e2dd))


### Trivial Changes

* **ci:** checkout with unifiedCI token ([#387](https://github.com/ipfs/ipld-explorer-components/issues/387)) ([79f09c1](https://github.com/ipfs/ipld-explorer-components/commit/79f09c1e2aa7a6a202f411310d08b5c8ddd7dd19))
* **ci:** update Unified CI configuration ([#386](https://github.com/ipfs/ipld-explorer-components/issues/386)) ([549a056](https://github.com/ipfs/ipld-explorer-components/commit/549a056620db505a410e037247d0df227515240f))
* pull new translations ([#381](https://github.com/ipfs/ipld-explorer-components/issues/381)) ([a3c67ce](https://github.com/ipfs/ipld-explorer-components/commit/a3c67ce0544cc3cf300d1aeff41b78923892d464))
* v4.0.1 changelog ([346dc60](https://github.com/ipfs/ipld-explorer-components/commit/346dc60ae65a5d5d2b80037d0edb189b2b7077e2))

### [4.0.1](https://github.com/ipfs/ipld-explorer-components/compare/v4.0.0...v4.0.1) (2023-07-12)

* chore: bump pascalgn/automerge-action from 0.13.1 to 0.15.6 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/374
* chore: bump actions/checkout from 2 to 3 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/372
* chore: bump repo-sync/pull-request from 2.6.2 to 2.12.1 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/371
* chore: bump actions/setup-node from 2 to 3 by @dependabot in https://github.com/ipfs/ipld-explorer-components/pull/370
* fix: storybook build by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/367
* docs: update changelog by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/368
* fix: fetch timeout has better error UX by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/378

### [4.0.0](https://github.com/ipfs/ipld-explorer-components/compare/v3.0.3...v4.0.0) (2023-06-08)

This is a major update that removes all old deps: js-ipfs, ipld, and out of date related ipld deps.

* chore: pull new translations by @github-actions in https://github.com/ipfs/ipld-explorer-components/pull/357
* chore: pull new translations by @github-actions in https://github.com/ipfs/ipld-explorer-components/pull/358
* feat!: remove all old deps by @SgtPooki in https://github.com/ipfs/ipld-explorer-components/pull/360

### [3.0.3](https://github.com/ipfs/ipld-explorer-components/compare/v3.0.2...v3.0.3) (2022-12-06)


### Trivial Changes

* fix wrong style referencing paths in cra example ([#344](https://github.com/ipfs/ipld-explorer-components/issues/344)) ([ef39560](https://github.com/ipfs/ipld-explorer-components/commit/ef395602135e2685adb06b4e771ee3de66dff430))

### [3.0.2](https://github.com/ipfs/ipld-explorer-components/compare/v3.0.1...v3.0.2) (2022-11-10)


### Bug Fixes

* use nodejs-16 in CI ([#345](https://github.com/ipfs/ipld-explorer-components/issues/345)) ([8b989d0](https://github.com/ipfs/ipld-explorer-components/commit/8b989d0ccf4560f08669d36d70b7d74bf86e390b))


### Trivial Changes

* bump async from 2.6.3 to 2.6.4 ([#340](https://github.com/ipfs/ipld-explorer-components/issues/340)) ([f3a4858](https://github.com/ipfs/ipld-explorer-components/commit/f3a485884a10a69aa2b470f6b81e23df1c54b677))

### [3.0.1](https://github.com/ipfs/ipld-explorer-components/compare/v3.0.0...v3.0.1) (2022-10-26)


### Trivial Changes

* pull new translations ([#339](https://github.com/ipfs/ipld-explorer-components/issues/339)) ([0a7ef0b](https://github.com/ipfs/ipld-explorer-components/commit/0a7ef0be3ef70606c75321a420e5e2553553e232))

## [3.0.0](https://github.com/ipfs/ipld-explorer-components/compare/v2.6.1...v3.0.0) (2022-10-05)


### ⚠ BREAKING CHANGES

* replace `ipld-dag-pb` with `@ipld/dag-pb` (#330)

### Features

* replace `ipld-dag-pb` with `@ipld/dag-pb` ([#330](https://github.com/ipfs/ipld-explorer-components/issues/330)) ([8cd0b23](https://github.com/ipfs/ipld-explorer-components/commit/8cd0b23641dc201b421af856069c18b4d9b0c41e))

### [2.6.1](https://github.com/ipfs/ipld-explorer-components/compare/v2.6.0...v2.6.1) (2022-09-19)


### Trivial Changes

* pull new translations ([#332](https://github.com/ipfs/ipld-explorer-components/issues/332)) ([57d6aee](https://github.com/ipfs/ipld-explorer-components/commit/57d6aee9c53f2e1498894af97ceab62c17b28231))

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
