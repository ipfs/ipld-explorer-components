import React, { useState } from 'react'
import GraphCrumb, { PathBoundary } from './GraphCrumb'
import { CID } from 'multiformats/cid'
import { Meta, StoryObj } from '@storybook/react/*'

const meta: Meta<typeof GraphCrumb> = {
  title: 'IPLD Graph Crumbs',
  component: GraphCrumb,
  args: {
    className: 'ma3',
    pathBoundaries: []
  },
}
export default meta

type Story = StoryObj<typeof GraphCrumb>;

export const SinglePath: Story = {
  name: 'single path',
  args: {
    cid: CID.parse("zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111"),
  }
}

export const DeepPath: Story = {
  name: 'deep path',
  args: {
    ...SinglePath.args,
    pathBoundaries: [
      {
        source: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111'),
        target: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z2222'),
        path: 'favourites/0'
      },
      {
        source: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z2222'),
        target: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z3333'),
        path: 'artist'
      },
      {
        source: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z3333'),
        target: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z4444'),
        path: 'bio'
      },
      {
        source: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z4444'),
        target: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z5555'),
        path: 'avatar.jpg'
      },
    ]
  }
}

export const DeepPathWithInvalidCid: Story = {
  ...DeepPath,
  name: 'deep path with invalid CID source',
  args: {
    ...DeepPath.args,
    // @ts-expect-error - invalid CID
    pathBoundaries: (DeepPath.args?.pathBoundaries as PathBoundary[]).map((b) => {
        if (b.path === 'avatar.jpg') {
          return {
            ...b,
            source: 'QmHash1111',
          }
        }
        return b
      }),
  }
}

export const DeepPathWithAllInvalidSourceCids: Story = {
  ...DeepPathWithInvalidCid,
  name: 'deep path with all invalid source CIDs',
  args: {
    ...DeepPathWithInvalidCid.args,
      // @ts-expect-error - invalid CIDs
    pathBoundaries: (DeepPathWithInvalidCid.args?.pathBoundaries as PathBoundary[]).map((b) => ({
      source: 'QmHash1111',
      target: b.target,
      path: b.path
    }))
  }
}


export const TooDeepPath: Story = {
  name: 'too deep path',
  render: () => {
    const pathBoundaries: PathBoundary[] = []
    for (let i = 1; i < 100; i++) {
      const suffix = i.toString().padStart(4, '1').replace(/0/g, 'z')
      pathBoundaries.push({
        path: `favourites${suffix}`,
        source: CID.parse(`zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z${suffix}`),
        target: CID.parse(`zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z${suffix}`),
      })
    }
    return <GraphCrumb cid={CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111')} pathBoundaries={pathBoundaries} />
  }
}
