import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect } from '@playwright/test'
import { type KuboRPCClient } from 'kubo-rpc-client'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename)

interface LoadBlockFixturesOptions {
  ipfs: KuboRPCClient
  blockCid: string | string[]
  blockPutArgs?: Record<string, any>
}
/**
 * Loads saved block fixtures from fixtures/explore/blocks and adds them locally to the ipfs node
 */
export async function loadBlockFixtures ({ ipfs, blockCid, blockPutArgs = { format: 'v0' } }: LoadBlockFixturesOptions): Promise<void> {
  try {
    if (Array.isArray(blockCid)) {
      await Promise.all(blockCid.map(async (cid) => loadBlockFixtures({ ipfs, blockCid: cid, blockPutArgs })))
      return
    }
    // read the data from the file
    const data = await readFile(join(__dirname, '/explore/blocks', blockCid), { encoding: null })
    // add the data to the ipfs node
    const result = await ipfs.block.put(data, blockPutArgs)
    // check that the CID returned from block.put matches the given block fixture CID
    expect(result.toString()).toBe(blockCid)
  } catch (e) {
    console.error(e)
  }
}
