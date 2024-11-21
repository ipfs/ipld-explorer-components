import { type Page } from '@playwright/test'
import { expect } from '@playwright/test'

interface TestExploreCidOptions {
  page: Page
  cid: string
  type: string
  humanReadableCID?: string
  fillOutForm?: boolean
}
/**
 * Fills out the explore form (optional), waits for CID of given type to be loaded, and checks if CID details are correct.
 */
export async function testExploredCid ({ cid, type, humanReadableCID, page, fillOutForm = true }: TestExploreCidOptions): Promise<void> {
  if (fillOutForm) {
    await page.fill('[data-id="IpldExploreForm"] input[id="ipfs-path"]', cid)
    await page.press('[data-id="IpldExploreForm"] button[type="submit"]', 'Enter')
  }

  await page.waitForSelector(`.joyride-explorer-cid [title="${cid}"]`) // cid is displayed in the CID INFO section.
  await page.waitForSelector(`[title="${type}"]`)

  if (humanReadableCID != null) {
    // expect cid details
    await page.waitForSelector('#CidInfo-human-readable-cid')
    const actualHumanReadableCID = await page.$eval('#CidInfo-human-readable-cid', firstRes => firstRes.textContent)
    expect(actualHumanReadableCID).toBe(humanReadableCID)
  }
}
