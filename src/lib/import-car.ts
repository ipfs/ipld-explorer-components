import { type Helia } from '@helia/interface'
import { CarBlockIterator } from '@ipld/car'
import { type CID } from 'multiformats'
import { source } from 'stream-to-it'
import { BlockFetchTimeoutError } from './errors.js'

/**
 * Given a file object representing a CAR archive, import it into the given Helia instance,
 * and return the CID for the root block
 *
 * TODO: Handle multiple roots
 */
export async function importCar (file: File, helia: Helia, timeout = 30000): Promise<CID> {
  const controller = new AbortController()
  const { signal } = controller

  const timeoutId = setTimeout(() => {
    controller.abort('Request timed out')
  }, timeout)

  try {
    const inStream = file.stream()

    const CarIterator = await CarBlockIterator.fromIterable(source(inStream))

    for await (const { cid, bytes } of CarIterator) {
      if (signal.aborted) {
        throw new BlockFetchTimeoutError({ timeout: timeout / 1000, cid: 'CAR_IMPORT' })
      }
      // add blocks to helia to ensure they are available while navigating children
      await helia.blockstore.put(cid, bytes)
    }

    const cidRoots = await CarIterator.getRoots()
    if (cidRoots.length === 0) {
      throw new Error('Invalid CAR file: no roots found')
    }
    // @todo: Handle multiple roots
    return cidRoots[0]
  } catch (err) {
    if (err instanceof BlockFetchTimeoutError) {
      throw err
    }
    throw new Error(err instanceof Error ? err.message : 'Failed to import CAR file')
  } finally {
    clearTimeout(timeoutId)
  }
}
