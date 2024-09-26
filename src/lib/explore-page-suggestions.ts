import type { NodeStyle } from '../components/object-info/ObjectInfo.jsx'

/**
 * Default Explore page suggestions
 */
export interface ExplorePageLink {
  name: string
  cid: string
  type: NodeStyle
}

export const explorePageLinks: ExplorePageLink[] = [
  {
    name: 'Project Apollo Archives',
    cid: 'QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D',
    type: 'dag-pb'
  },
  {
    name: 'XKCD Archives',
    cid: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
    type: 'dag-pb'
  },
  {
    name: 'HAMT-sharded Wikipedia mirror (>20M files)',
    cid: 'bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze',
    type: 'hamt-sharded-directory'
  },
  {
    name: 'B-tree search index from ipfs-geoip',
    cid: 'bafyreif3tfdpr5n4jdrbielmcapwvbpcthepfkwq2vwonmlhirbjmotedi',
    type: 'dag-cbor'
  },
  {
    name: 'DAG-CBOR Block',
    cid: 'bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq',
    type: 'dag-cbor'
  },
  {
    name: 'dag-cbor hello world (keccak-256)',
    cid: 'bafyrwigbexamue2ba3hmtai7hwlcmd6ekiqsduyf5avv7oz6ln3radvjde',
    type: 'dag-cbor'
  },
  {
    name: 'Ceramic LogEntry for sgb.chat Ambassador proposal',
    cid: 'bagcqcerarvdwmhvk73mze3e2n6yvpt5h7fh3eae7n6y3hizsflz5grpyeczq',
    type: 'dag-jose'
  },
  {
    name: 'hello world (blake3)',
    cid: 'bagaaihraf4oq2kddg6o5ewlu6aol6xab75xkwbgzx2dlot7cdun7iirve23a',
    type: 'dag-json'
  },
  {
    name: 'hello world',
    cid: 'baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea',
    type: 'dag-json'
  },
  {
    name: 'hello world (sha3-512)',
    cid: 'bagaaifcavabu6fzheerrmtxbbwv7jjhc3kaldmm7lbnvfopyrthcvod4m6ygpj3unrcggkzhvcwv5wnhc5ufkgzlsji7agnmofovc2g4a3ui7ja',
    type: 'json'
  },
  {
    name: 'Raw Block for "hello"',
    cid: 'bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq',
    type: 'raw'
  },
  {
    name: 'Raw Block for "hello" (blake3)',
    cid: 'bafkr4ihkr4ld3m4gqkjf4reryxsy2s5tkbxprqkow6fin2iiyvreuzzab4',
    type: 'raw'
  }
]
