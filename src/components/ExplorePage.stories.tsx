import React from 'react'
import i18n from '../i18n-decorator.tsx'
import { ExploreProvider, ExploreState } from '../providers/explore.tsx'
import { HeliaProvider } from '../providers/helia.tsx'
import ExplorePage from './ExplorePage.tsx'

const defaultState: ExploreState = {
  path: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
  canonicalPath: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
  error: null,
  targetNode: {
    type: 'dag-pb',
    format: 'unixfs',
    data: {
      type: 'directory',
      data: new Uint8Array([0]),
      blockSizes: [BigInt(0)]
    },
    cid: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
    links: [
      {
        source: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
        target: 'QmdC5Hav9zdn2iS75reafXBq1PH4EnqUmoxwoxkS5QtuME',
        path: '10 - Pi Equals',
        size: BigInt(0),
        index: 0
      }
    ]
  },
  localPath: '',
  nodes: [
    {
      type: 'dag-pb',
      cid: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
      links: [
        {
          source: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
          target: 'QmdC5Hav9zdn2iS75reafXBq1PH4EnqUmoxwoxkS5QtuME',
          path: '10 - Pi Equals'
        }
      ]
    }
  ],
  pathBoundaries: []

}

/**
 * @type {import('@storybook/react').Meta<typeof ExplorePage>}
 */
const meta = {
  title: 'Explore page',
  component: ExplorePage,
  decorators: [i18n],
  render: () => (
    <div className="pt4">
      <HeliaProvider>
        <ExploreProvider state={defaultState}>
          <ExplorePage gatewayUrl="https://ipfs.io" />
        </ExploreProvider>
      </HeliaProvider>
    </div>
  )
}
export default meta

export const Default = () => (
  <div className="pt4">
    <HeliaProvider>
      <ExploreProvider state={defaultState}>
        <ExplorePage gatewayUrl="https://ipfs.io" />
      </ExploreProvider>
    </HeliaProvider>
  </div>
)

Default.story = {
  name: 'default'
}
