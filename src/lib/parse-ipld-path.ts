/*
  Capture groups 1
  1: ipns | ipfs | ipld
  2: CID | fqdn
  3: /rest
*/
export const pathRegEx = /(\/(ipns|ipfs|ipld)\/)?([^/]+)(\/.*)?/

export interface IpldPath {
  namespace: string
  cidOrFqdn: string
  rest: string
  address: string
}

export function parseIpldPath (str: string): IpldPath | null {
  const res = pathRegEx.exec(str)
  if (res == null) return null
  return {
    namespace: res[2], // 'ipfs'
    cidOrFqdn: res[3], // 'QmHash'
    rest: res[4], // /foo/bar
    address: res[0] // /ipfs/QmHash/foo/bar
  }
}
