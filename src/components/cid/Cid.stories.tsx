import React from 'react'
import Cid from './Cid'
import { CID } from 'multiformats/cid'
import { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Cid> = {
  title: 'CID',
  component: Cid,
  args: {
    className: 'db ma2 monospace'
  }
}

export default meta

type Story = StoryObj<typeof Cid>;

export const CidV0: Story = {
  name: 'CID v0',
  args: {
    value: CID.parse('QmYPNmahJAvkMTU6tDx5zvhEkoLzEFeTDz6azDCSNqzKkW'),
  }
}


export const CidV1: Story = {
  name: 'CID v1',
  args: {
    value: CID.parse('zb2rhZMC2PFynWT7oBj7e6BpDpzge367etSQi6ZUA81EVVCxG'),
  },
}


export const CidV1Sha3: Story = {
  name: 'CID v1 sha3',
  args: {
    value: CID.parse('zB7NbGN5wyfSbNNNwo3smZczHZutiWERdvWuMcHXTj393RnbhwsHjrP7bPDRPA79YWPbS69cZLWXSANcwUMmk4Rp3hP9Y'),
  }
}


export const ShortestCid: Story = {
  name: 'Shortest CID',
  args: {
    value: CID.parse('bafkqaaik'),
  }
}
