// import { action } from '@storybook/addon-actions'
import React from 'react'
// import bundleDecorator from '../../bundle-decorator'
import i18n from '../../i18n-decorator'
import IpldExploreForm from './IpldExploreForm'

// const mockExploreBundle = {
//   name: 'explore',
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   selectFoo: () => () => {}, // else compose throws. gotta have at least one selector.
//   doExploreUserProvidedPath: action('explore')
// }

export default {
  title: 'Explore form',
  decorators: [i18n]
}

export const Default = () => (
    <div className="bg-navy pa3" style={{ height: '100vh' }}>
        <IpldExploreForm />
    </div>
)

Default.story = {
  name: 'default'
}
