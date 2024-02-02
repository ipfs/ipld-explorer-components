import { trustlessGateway } from '@helia/block-brokers'
import { createHeliaHTTP } from '@helia/http'
import { type Helia } from '@helia/interface'
import { delegatedHTTPRouting } from '@helia/routers'

import { getHashersForCodes } from './hash-importer.js'
import { addDagNodeToHelia } from '../lib/helpers.js'
import type { KuboGatewayOptions } from '../types.d.js'

function areRemoteGatewaysEnabled (): boolean {
  const localStorageKey = 'explore.ipld.gatewayEnabled'
  console.info(
    `🎛️ Customise whether ipld-explorer-components fetches content from gateways by setting an '${localStorageKey}' value to true/false in localStorage. e.g. localStorage.setItem('explore.ipld.gatewayEnabled', false) -- NOTE: defaults to true`
  )
  const gatewayEnabledSetting = localStorage.getItem(localStorageKey)

  return gatewayEnabledSetting != null ? JSON.parse(gatewayEnabledSetting) : true
}

export default async function initHelia (kuboGatewayOptions: KuboGatewayOptions): Promise<Helia> {
  // Always add the Kubo gatewawy
  const trustlessGateways = [
    trustlessGateway({ gateways: [`${kuboGatewayOptions.protocol ?? 'http'}://${kuboGatewayOptions.host}:${kuboGatewayOptions.port}`] })
  ]

  if (areRemoteGatewaysEnabled()) {
    trustlessGateways.push(trustlessGateway())
  }

  // const helia = await createHelia({
  //   blockBrokers: [
  //     // no bitswap
  //     ...trustlessGateways
  //   ],
  //   // #WhenAddingNewHasher
  //   hashers: await getHashersForCodes(17, 18, 19, 20, 27, 30),
  //   datastore,
  //   blockstore,
  //   // @ts-expect-error - libp2p types are borked right now
  //   libp2p
  // })
  const helia = await createHeliaHTTP({
    blockBrokers: [
      ...trustlessGateways
    ],
    routers: ['http://delegated-ipfs.dev'].map(delegatedHTTPRouting),
    // #WhenAddingNewHasher
    hashers: await getHashersForCodes(17, 18, 19, 20, 27, 30)
    // datastore,
    // blockstore
    // libp2p
  })

  // add helia-only examples
  // consumers may not have the peer-deps installed for these examples, and we don't want to break them if they're not supported.
  await Promise.allSettled([
    addDagNodeToHelia(helia, 'dag-json', { hello: 'world' }), // baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea
    addDagNodeToHelia(helia, 'dag-cbor', { hello: 'world' }, 27), // bafyrwigbexamue2ba3hmtai7hwlcmd6ekiqsduyf5avv7oz6ln3radvjde
    addDagNodeToHelia(helia, 'json', { hello: 'world' }, 20), // bagaaifcavabu6fzheerrmtxbbwv7jjhc3kaldmm7lbnvfopyrthcvod4m6ygpj3unrcggkzhvcwv5wnhc5ufkgzlsji7agnmofovc2g4a3ui7ja
    addDagNodeToHelia(helia, 'json', { hello: 'world' }, 30), // bagaaihraf4oq2kddg6o5ewlu6aol6xab75xkwbgzx2dlot7cdun7iirve23a
    addDagNodeToHelia(helia, 'raw', (new TextEncoder()).encode('hello'), 30) // bafkr4ihkr4ld3m4gqkjf4reryxsy2s5tkbxprqkow6fin2iiyvreuzzab4
  ])

  return helia
}
