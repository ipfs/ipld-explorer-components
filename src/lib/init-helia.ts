import { trustlessGateway } from '@helia/block-brokers'
import { createHeliaHTTP } from '@helia/http'
import { type Helia } from '@helia/interface'
import { delegatedHTTPRouting, httpGatewayRouting } from '@helia/routers'
import { addDagNodeToHelia } from '../lib/helpers.js'
import { getHashersForCodes } from './hash-importer.js'
import type { KuboGatewayOptions } from '../types.d.js'

/**
 * Whether to enable remote gateways for fetching content. We default to true if the setting is not present.
 */
function areRemoteGatewaysEnabled (): boolean {
  const localStorageKey = 'explore.ipld.gatewayEnabled'
  console.info(
    `🎛️ Customise whether ipld-explorer-components fetches content from gateways by setting an '${localStorageKey}' value to true/false in localStorage. e.g. localStorage.setItem('explore.ipld.gatewayEnabled', false) -- NOTE: defaults to true`
  )
  const gatewayEnabledSetting = localStorage.getItem(localStorageKey)

  return gatewayEnabledSetting != null ? JSON.parse(gatewayEnabledSetting) : true
}

export default async function initHelia (kuboGatewayOptions: KuboGatewayOptions): Promise<Helia> {
  const routers = [
    // Always add the Kubo gateway
    httpGatewayRouting({ gateways: [`${kuboGatewayOptions.protocol ?? 'http'}://${kuboGatewayOptions.host}:${kuboGatewayOptions.port}`] })
  ]

  if (areRemoteGatewaysEnabled()) {
    // eslint-disable-next-line no-console
    console.log('remote gateways and delegated routing are enabled')
    routers.push(delegatedHTTPRouting('http://delegated-ipfs.dev'))
    routers.push(httpGatewayRouting())
  }

  const helia = await createHeliaHTTP({
    blockBrokers: [
      trustlessGateway(kuboGatewayOptions.trustlessBlockBrokerConfig?.init)
    ],

    routers,
    // #WhenAddingNewHasher
    hashers: await getHashersForCodes(17, 18, 19, 20, 27, 30, 45600, 45632)
  })

  // add helia-only examples
  // consumers may not have the peer-deps installed for these examples, and we don't want to break them if they're not supported.
  await Promise.allSettled([
    addDagNodeToHelia(helia, 'dag-json', { hello: 'world' }), // baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea
    addDagNodeToHelia(helia, 'dag-cbor', { hello: 'world' }, 27), // bafyrwigbexamue2ba3hmtai7hwlcmd6ekiqsduyf5avv7oz6ln3radvjde
    addDagNodeToHelia(helia, 'json', { hello: 'world' }, 20), // bagaaifcavabu6fzheerrmtxbbwv7jjhc3kaldmm7lbnvfopyrthcvod4m6ygpj3unrcggkzhvcwv5wnhc5ufkgzlsji7agnmofovc2g4a3ui7ja
    addDagNodeToHelia(helia, 'json', { hello: 'world' }, 30), // bagaaihraf4oq2kddg6o5ewlu6aol6xab75xkwbgzx2dlot7cdun7iirve23a
    addDagNodeToHelia(helia, 'raw', (new TextEncoder()).encode('hello'), 30), // bafkr4ihkr4ld3m4gqkjf4reryxsy2s5tkbxprqkow6fin2iiyvreuzzab4
    addDagNodeToHelia(helia, 'dag-pb', { Data: (new TextEncoder()).encode('hello'), Links: [] }, 0xb220), // bafykbzacec3ssfzln7bfcn54t5voa4onlcx63kkx3reucaiwc7eaffmla7gci
    addDagNodeToHelia(helia, 'dag-pb', { Data: (new TextEncoder()).encode('hello'), Links: [] }, 0xb240) // bafymbzacia5oqpl3kqdjk6hgisdemv44omuqse33bf3a2gnurnzcmkstjhupcqymbuvsj2qlke4phr5iudjruwbjqsx34psaqsuezr4ivka5ul2y
  ])

  return helia
}
