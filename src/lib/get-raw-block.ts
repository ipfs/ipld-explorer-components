import type { Helia } from '@helia/interface'
import { CID } from 'multiformats'
import type { Version as CIDVersion } from 'multiformats/cid'

import getHasherForCode from './hash-importer.js'

async function getCidFromBytes (bytes: Uint8Array, cidVersion: CIDVersion, codecCode: number, multihashCode: number): Promise<CID> {
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

async function getRawBlockFromGateway (url: string | URL, cid: CID, signal: AbortSignal): Promise<Uint8Array> {
  const gwUrl = new URL(url)

  gwUrl.pathname = `/ipfs/${cid.toString()}`
  gwUrl.search = '?format=raw' // necessary as not every gateway supports dag-cbor, but every should support sending raw block as-is
  try {
    const res = await fetch(gwUrl.toString(), {
      signal,
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
    throw new Error(`unable to fetch raw block for CID ${cid}`)
  }
}

/**
 * This method validates that the block we got from the gateway has the same CID as the one we requested
 *
 * @param helia
 * @param providedCid
 * @param bytes
 */
export async function verifyBytes (providedCid: CID, bytes: Uint8Array): Promise<void> {
  try {
    // console.log(`bytes: `, bytes);
    // console.log(`providedCid: `, providedCid);
    const cid = await getCidFromBytes(bytes, providedCid.version, providedCid.code, providedCid.multihash.code)

    if (cid.toString() !== providedCid.toString()) {
      throw new Error(`CID mismatch, expected '${providedCid.toString()}' but got '${cid.toString()}'`)
    }
  } catch (err) {
    console.error('unable to verify bytes', err)
    throw err
  }
}

export async function getBlockFromAnyGateway (cid: CID, signal: AbortSignal, moreGateways: string[] = []): Promise<Uint8Array> {
  const gateways = defaultGateways.concat(moreGateways)
  for (const url of gateways) {
    if (signal.aborted) {
      throw new Error('aborted')
    }
    try {
      const rawBlock = await getRawBlockFromGateway(url, cid, signal)
      try {
        await verifyBytes(cid, rawBlock)
        return rawBlock
      } catch (err) {
        console.log('unable to verify block from gateway', url)
        continue
      }
    } catch (err) {
      console.error('unable to get block from gateway', err)
      // ignore the error
    }
  }
  throw new Error('Could not get block from any gateway')
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
export async function getRawBlock (helia: Helia, cid: CID): Promise<Uint8Array> {
  const abortController = new AbortController()

  try {
    if (await helia.blockstore.has(cid)) {
      return await helia.blockstore.get(cid)
    }
    const rawBlock = await Promise.any([helia.blockstore.get(cid, { signal: abortController.signal }), getBlockFromAnyGateway(cid, abortController.signal)])
    abortController.abort() // abort any other requests.
    /**
     * if we got the block from the gateway, verifyBytes is called, and we can safely store the block.
     * if we got the block from helia, helia's blockstore should already have the block.
     */
    if (!await helia.blockstore.has(cid)) {
      await helia.blockstore.put(cid, rawBlock)
    }

    return rawBlock
  } catch (err) {
    console.error('unable to get raw block', err)
    throw err
  }
}
