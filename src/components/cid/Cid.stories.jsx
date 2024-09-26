import React from 'react'
import Cid from './Cid'

/**
 * @type {import('@storybook/react').Meta<typeof Cid>}
 */
const meta = {
  title: 'CID',
  component: Cid,
  render: () => (
    <Cid />
  )
}

export default meta

export const CidV0 = () => (
    <Cid
        className="db ma2 monospace"
        value="QmYPNmahJAvkMTU6tDx5zvhEkoLzEFeTDz6azDCSNqzKkW"
    />
)

CidV0.story = {
  name: 'CID v0'
}

export const CidV1 = () => (
    <Cid
        className="db ma2 monospace"
        value="zb2rhZMC2PFynWT7oBj7e6BpDpzge367etSQi6ZUA81EVVCxG"
    />
)

CidV1.story = {
  name: 'CID v1'
}

export const CidV1Sha3 = () => (
    <Cid
        className="db ma2 monospace"
        value="zB7NbGN5wyfSbNNNwo3smZczHZutiWERdvWuMcHXTj393RnbhwsHjrP7bPDRPA79YWPbS69cZLWXSANcwUMmk4Rp3hP9Y"
    />
)

CidV1Sha3.story = {
  name: 'CID v1 sha3'
}
