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

const verifyBlock = async (helia: Helia, providedCid: HeliaCID, block: Uint8Array): Promise<void> => {
  console.group('verifyBlock')
  console.log(`providedCid: `, providedCid.toString());
  const cid = await helia.blockstore.put(providedCid, block)
  console.log(`generated cid: `, cid.toString());
  console.groupEnd()
  if (cid.toString() !== providedCid.toString()) {
    throw new Error(`CID mismatch, expected ${providedCid.toString()} but got ${cid.toString()}`)
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
  let rawBlock: Uint8Array | undefined
  // attempt to get the raw block from helia, timeout after 5 seconds
  try {
    const abortController = new AbortController()
    const timeout = setTimeout(() => abortController.abort(), 2000)
    const block = await helia.blockstore.get(cid, { signal: abortController.signal })
    clearTimeout(timeout)
    rawBlock = block
    console.log('retrieved raw block from helia')
  } catch (err) {
    const isAbortError = (err as Error).name === 'AbortError'
    if (!isAbortError) {
      console.warn('unable to get raw block from helia', err)
    }
  }

  if (rawBlock == null) {
    // attempt to get the raw block from a gateway
    for (const url of defaultGateways) { // eslint-disable-line no-unreachable-loop

      try {
        rawBlock = await getRawBlockFromGateway(url, cid)
        try {
          await verifyBlock(helia, cid, rawBlock)
        } catch (err) {
          console.log('unable to verify block from gateway', url)
          continue
        }
        console.log('retrieved raw block from gateway', url)
        break;
      } catch (err) {
        // ignore the error
      }
    }
  }

  if (typeof rawBlock === 'undefined') {
    throw new Error('unable to get raw block from helia or any gateway')
  }

  return rawBlock
}
