import { BlockFetchTimeoutError } from './errors.js';

/**
 * Method for getting a raw block either with helia from trustless gateways or a local Kubo gateway.
 */
export async function getRawBlock(helia, cid) {
  let timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30000;
  const abortController = new AbortController();
  try {
    const timeoutId = setTimeout(() => {
      abortController.abort('Request timed out');
    }, timeout);
    const rawBlock = await helia.blockstore.get(cid, {
      signal: abortController.signal
    });
    clearTimeout(timeoutId);
    return rawBlock;
  } catch (err) {
    console.error('unable to get raw block', err);
    if (abortController.signal.aborted) {
      // if we timed out, we want to throw a timeout error, not a Promise.any error
      throw new BlockFetchTimeoutError({
        timeout: timeout / 1000
      });
    }
    throw err;
  }
}