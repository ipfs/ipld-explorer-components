import React from 'react'
import { DocLink } from './DocLink'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DocLink> = {
  title: 'Common/DocLink',
  component: DocLink,
  args: {
    term: 'cid',
    className: 'ma2'
  }
}

export default meta
type Story = StoryObj<typeof DocLink>

export const Default: Story = {
  args: {
    term: 'cid'
  }
}

export const WithCustomText: Story = {
  args: {
    term: 'cid',
    children: 'Content Identifier'
  }
}

export const WithCustomPath: Story = {
  args: {
    term: 'cid',
    glossaryPath: 'concepts/content-addressing'
  }
}

export const MultipleLinks: Story = {
  render: () => (
    <div className='ma2'>
      <DocLink term='cid' className='mr2'>CID</DocLink>
      <DocLink term='multibase' className='mh2'>Multibase</DocLink>
      <DocLink term='multicodec' className='mh2'>Multicodec</DocLink>
      <DocLink term='multihash' className='ml2'>Multihash</DocLink>
    </div>
  )
}
