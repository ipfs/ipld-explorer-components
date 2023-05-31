import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'

export async function createHeliaMock () {
  const blockstore = new MemoryBlockstore()
  const datastore = new MemoryDatastore()
  const helia = await createHelia({
    datastore,
    blockstore
    // libp2p: {}
  })
  await helia.libp2p.stop()

  return helia
}
