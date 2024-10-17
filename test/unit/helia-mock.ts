import { createHeliaHTTP, type Helia } from '@helia/http'

export async function createHeliaMock (): Promise<Helia> {
  const helia = await createHeliaHTTP()

  return helia
}
