import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename)

const globalTeardown = async (): Promise<void> => {
  fs.rmSync(path.join(__dirname, 'ipfs-backend.json'), { force: true })
}

export default globalTeardown
