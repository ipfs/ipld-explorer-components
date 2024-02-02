import { createHeliaHTTP } from '@helia/http'

export async function createHeliaMock () {
  const helia = await createHeliaHTTP()

  return helia
}
