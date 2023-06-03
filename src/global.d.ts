/**
 * @see https://www.npmjs.com/package/stream-to-it#api
 */
declare module 'stream-to-it' {
  interface toIterable {
    source: <T>(stream: ReadableStream<T>) => AsyncIterable<T>
  }
  const toIterable: toIterable
  export default toIterable
}

interface OldIpldFormat {
  util: {
    serialize: (obj: unknown) => Promise<Uint8Array>
    deserialize: (bytes: Uint8Array) => Promise<unknown>

    codec: number
    defaultHashAlg: number
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    cid: import('multiformats').CID
  }
  codec: number
  resolver: {
    resolve: (bytes: Uint8Array, path: string) => Promise<unknown>
    tree: (bytes: Uint8Array) => Promise<unknown>
  }
  defaultHashAlg: number
}
declare module 'ipld-git' {
  const defaultExport: OldIpldFormat
  export default defaultExport
}
