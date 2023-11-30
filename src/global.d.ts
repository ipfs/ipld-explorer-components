/**
 * @see https://www.npmjs.com/package/stream-to-it#api
 */
declare module 'stream-to-it' {
  interface toIterable {
    source<T>(stream: ReadableStream<T>): AsyncIterable<T>
  }
  const toIterable: toIterable
  export default toIterable
}
