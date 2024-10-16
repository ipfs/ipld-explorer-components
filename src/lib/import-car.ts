import { type Helia } from '@helia/interface'
import { CarBlockIterator } from '@ipld/car'
import { type CID } from 'multiformats'
import { source } from 'stream-to-it'

/**
 * Given a file object representing a CAR archive, import it into the given Helia instance,
 * and return the CID for the root block
 *
 * TODO: Handle multiple roots
 */
export async function importCar (file: File, helia: Helia): Promise<CID> {
  const inStream = file.stream()
  const CarIterator = await CarBlockIterator.fromIterable(source(inStream))
  for await (const { cid, bytes } of CarIterator) {
    // add blocks to helia to ensure they are available while navigating children
    await helia.blockstore.put(cid, bytes)
  }
  const cidRoots = await CarIterator.getRoots()

  // @todo: Handle multiple roots
  return cidRoots[0]
}
