import { bases } from 'multiformats/basics';
export default function baseImporter<T extends string>(prefix: T): Promise<typeof bases[keyof typeof bases]>;
