import { test } from '@playwright/test'
import { create, type KuboRPCClient } from 'kubo-rpc-client'
import { loadBlockFixtures } from './fixtures/load-block-fixtures.js'
import { testExploredCid } from './fixtures/test-explore-cid.js'

test.describe('edge-cases', () => {
  let ipfs: KuboRPCClient
  test.beforeEach(async () => {
    ipfs = create(process.env.IPFS_RPC_ADDR)
  })

  test('links without explicit paths can be navigated to', async ({ page }) => {
    const cid = 'Qmd1WaiaEBDe7H3a3U1CToaoaFsxUXEnmhw68ub5u1iY7Q'
    await loadBlockFixtures({
      ipfs,
      blockCid: [
        'QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D',
        'QmUh6QSTxDKX5qoNU1GoogbhTveQQV9JMeQjfFVchAtd5Q',
        'QmXPqQjySvisWjE11dkrANGmfvUsmPN5RP9oWVRnR7RQuu',
        'QmVFemV13MkWS7xyDzcJbBd5qL31NXAHcsYk4wy4RhwHqh',
        cid
      ]
    })

    await page.goto('/#/explore/QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D/albums/QXBvbGxvIDE0IE1hZ2F6aW5lIDY0L0xM/21076550124_dfaa21d664_o.jpg')
    // wait for the link at index 0 to be visible. it has text of "Qmd1WaiaEBDe7H3a3U1CToaoaFsxUXEnmhw68ub5u1iY7Q"
    const link0 = await page.waitForSelector(`"${cid}"`)
    // click on the link at index 0
    await link0.click()

    await testExploredCid({
      fillOutForm: false,
      page,
      cid,
      humanReadableCID: 'base58btc - cidv0 - dag-pb - sha2-256~256~D9F8142F34B8CC605DBD57745F1221836E616CDA5B5B9B5BE88D364E13CE39B7',
      type: 'dag-pb'
    })
  })

  test('identity CIDs render object info properly', async ({ page }) => {
    // Test for https://github.com/ipfs/ipld-explorer-components/issues/464
    const cid = 'bafkqaddjnzzxazldoqwxizltoq'

    await page.goto('/#/explore/bafkqaddjnzzxazldoqwxizltoq')

    await testExploredCid({
      fillOutForm: false,
      page,
      cid,
      humanReadableCID: 'base32 - cidv1 - raw - identity~96~696E73706563742D74657374',
      type: 'raw'
    })
  })
})
