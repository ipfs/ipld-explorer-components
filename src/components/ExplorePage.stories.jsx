// import { action } from '@storybook/addon-actions'
import React from 'react'
// import bundleDecorator from '../bundle-decorator'
import i18n from '../i18n-decorator'
import ExplorePage from './ExplorePage'

// const mockExploreBundle = {
//   name: 'explore',
//   selectExplore: () => ({
//     targetNode: {
//       type: 'dag-pb',
//       format: 'unixfs',
//       data: {
//         type: 'directory'
//       },
//       cid: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
//       links: [
//         {
//           source: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
//           target: 'QmdC5Hav9zdn2iS75reafXBq1PH4EnqUmoxwoxkS5QtuME',
//           path: '10 - Pi Equals'
//         }
//       ]
//     },
//     localPath: '',
//     nodes: [
//       {
//         type: 'dag-pb',
//         cid: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
//         links: [
//           {
//             source: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
//             target: 'QmdC5Hav9zdn2iS75reafXBq1PH4EnqUmoxwoxkS5QtuME',
//             path: '10 - Pi Equals'
//           }
//         ]
//       }
//     ],
//     pathBoundaries: []
//   }),
//   selectExploreIsLoading: () => false,
//   selectExplorePathFromHash: () => 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
//   doExploreLink: action('explore')
// }

export default {
  title: 'Explore page',
  decorators: [i18n]
  // decorators: [i18n, bundleDecorator(mockExploreBundle)]
}

export const Default = () => (
    <div className="pt4">
        <ExplorePage gatewayUrl="https://ipfs.io" />
    </div>
)

Default.story = {
  name: 'default'
}
