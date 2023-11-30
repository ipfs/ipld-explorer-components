import { CarBlockIterator } from '@ipld/car';
import toIterable from 'stream-to-it';

/**
 * Given a file object representing a CAR archive, import it into the given Helia instance,
 * and reeturn the CID for the root block
 *
 * TODO: Handle multiple roots
 */
export async function importCar(file, helia) {
  const inStream = file.stream();
  const CarIterator = await CarBlockIterator.fromIterable(toIterable.source(inStream));
  for await (const {
    cid,
    bytes
  } of CarIterator) {
    // add blocks to helia to ensure they are available while navigating children
    await helia.blockstore.put(cid, bytes);
  }
  const cidRoots = await CarIterator.getRoots();

  // @todo: Handle multiple roots
  return cidRoots[0];
}