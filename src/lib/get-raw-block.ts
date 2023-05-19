import { CID } from 'multiformats'
import type { Helia } from '@helia/interface'

type HeliaCID = Parameters<Helia['blockstore']['get']>[0]


async function getRawBlockFromGateway(url: string|URL, cid: HeliaCID) {
  const gwUrl = new URL(url)

  gwUrl.pathname = `/ipfs/${cid.toString()}`
  gwUrl.search = '?format=raw' // necessary as not every gateway supports dag-cbor, but every should support sending raw block as-is
  try {
    const res = await fetch(gwUrl.toString(), {
      headers: {
        // also set header, just in case ?format= is filtered out by some reverse proxy
        Accept: 'application/vnd.ipld.raw'
      },
      cache: 'force-cache'
    })
    if (!res.ok) throw res
    return new Uint8Array(await res.arrayBuffer())
  } catch (cause) {
    throw new Error(`unable to fetch raw block for CID ${cid}`, { cause: cause as unknown as Error })
  }

}

const defaultGateways = ['https://ipfs.io', 'https://dweb.link']
/**
 * Method for getting a raw block either with helia or https://docs.ipfs.tech/reference/http/gateway/#trusted-vs-trustless
 * inspiration from https://github.com/ipfs-shipyard/ipfs-geoip/blob/466cd9d6454098c0fcf998b2217225099a654695/src/lookup.js#L18
 *
 * @param {typeof import('@helia/interface')['Helia']} ipfs
 * @param {CID} cid
 * @returns {Promise}
 */
export async function getRawBlock (helia: Helia, cid: HeliaCID): Promise<Uint8Array> {
  console.log(`cid: `, cid);
  // attempt to get the raw block from helia, timeout after 5 seconds
  try {
    const abortController = new AbortController()
    const timeout = setTimeout(() => abortController.abort(), 5000)
    const block = await helia.blockstore.get(cid, { signal: abortController.signal })
    clearTimeout(timeout)
    return block
  } catch (err) {
    // ignore the error
  }


  // attempt to get the raw block from a gateway
  for (const url of defaultGateways) { // eslint-disable-line no-unreachable-loop

    try {
      return await getRawBlockFromGateway(url, cid)
    } catch (err) {
      // ignore the error
    }
  }
  throw new Error('unable to get raw block from helia or any gateway')
}
