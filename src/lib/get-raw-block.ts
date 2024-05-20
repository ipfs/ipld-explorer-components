import { type CID } from 'multiformats/cid'
import { BlockFetchTimeoutError } from './errors.js'
import type { Helia } from '@helia/interface'

/**
 * Method for getting a raw block either with helia from trustless gateways or a local Kubo gateway.
 */
export async function getRawBlock (helia: Helia, cid: CID, timeout = 30000): Promise<Uint8Array> {
  const abortController = new AbortController()

  try {
    const timeoutId = setTimeout(() => { abortController.abort('Request timed out') }, timeout)
    const rawBlock = await helia.blockstore.get(cid, { signal: abortController.signal })
    clearTimeout(timeoutId)

    return rawBlock
  } catch (err) {
    console.error('unable to get raw block', err)
    if (abortController.signal.aborted) {
      // if we timed out, we want to throw a timeout error, not a Promise.any error
      throw new BlockFetchTimeoutError({ timeout: timeout / 1000 })
    }
    throw err
  }
}
