// @ts-expect-error - borked types
import { CID } from 'multiformats'
import type { Helia } from '@helia/interface'
// @ts-expect-error - borked types
import type { CIDVersion } from 'multiformats/cid'

import getHasherForCode from './hash-importer.js'

type HeliaCID = Parameters<Helia['blockstore']['get']>[0]

async function getCidFromBytes(bytes: Uint8Array, cidVersion: CIDVersion, codecCode: number, multihashCode: number): Promise<CID> {
  const hasher = await getHasherForCode(multihashCode)

  try {
    // const hash = await Promise.resolve(hasher.digest(bytes))
    const hash = await hasher.digest(bytes)
    return CID.create(cidVersion, codecCode, hash)
  } catch (err) {
    console.error('could not create cid from bytes', err)
  }

  return '' as any as CID
}

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
    console.error('cause', cause)
    throw new Error(`unable to fetch raw block for CID ${cid}`, { cause: cause as unknown as Error })
  }
}

/**
 * This method validates that the block we got from the gateway has the same CID as the one we requested
 * @param helia
 * @param providedCid
 * @param bytes
 */
const verifyBytes = async (helia: Helia, providedCid: HeliaCID, bytes: Uint8Array): Promise<void> => {
  try {
    // console.log(`bytes: `, bytes);
    // console.log(`providedCid: `, providedCid);
    const cid = await getCidFromBytes(bytes, providedCid.version, providedCid.code, providedCid.multihash.code)

    if (cid.toString() !== providedCid.toString()) {
      throw new Error(`CID mismatch, expected '${providedCid.toString()}' but got '${cid.toString()}'`)
    }
    // only put the block into the blockstore once it's validated
    await helia.blockstore.put(providedCid, bytes)
  } catch (err) {
    console.error('unable to verify bytes', err)
    throw err
  }
}

// const defaultGateways = ['http://localhost:8080', 'https://ipfs.io', 'https://dweb.link']
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

  // TODO: check helia and gateways in parallel, check gateways in serial.

  if (await helia.blockstore.has(cid)) {
    /**
     * Attempt to get the raw block from helia, timeout after 200ms
     * This will usually fail on the first attempt, but will succeed on the second attempt once helia has stored the block
     * in the blockstore. This prevents us from having to query the gateway for the same CID more than once.
     */
    try {
      const timeoutSignal = AbortSignal.timeout(200)
      const block = await helia.blockstore.get(cid, {signal: timeoutSignal})
      rawBlock = block
      console.log('retrieved raw block from helia')
    } catch (err) {
      const isAbortError = (err as Error).name === 'AbortError'
      if (!isAbortError) {
        console.warn('unable to get raw block from helia', err)
      }
    }
  }

  if (rawBlock == null) {
    // attempt to get the raw block from a gateway
    for (const url of defaultGateways) { // eslint-disable-line no-unreachable-loop

      try {
        rawBlock = await getRawBlockFromGateway(url, cid)
        try {
          await verifyBytes(helia, cid, rawBlock)
        } catch (err) {
          console.log('unable to verify block from gateway', url)
          continue
        }
        console.log('retrieved raw block from gateway', url)
        break;
      } catch (err) {
        console.error('unable to get block from gateway', err)
        // ignore the error
      }
    }
  }

  if (typeof rawBlock === 'undefined') {
    throw new Error(`unable to get raw block from gateways: ${defaultGateways.join(', ')}`)
  }

  return rawBlock
}
