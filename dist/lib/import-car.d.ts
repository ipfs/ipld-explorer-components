import { type Helia } from '@helia/interface';
import { type CID } from 'multiformats';
/**
 * Given a file object representing a CAR archive, import it into the given Helia instance,
 * and reeturn the CID for the root block
 *
 * TODO: Handle multiple roots
 */
export declare function importCar(file: File, helia: Helia): Promise<CID>;
