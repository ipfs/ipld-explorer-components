// import { action } from '@storybook/addon-actions'
import React from 'react'
// import bundleDecorator from '../../bundle-decorator'
import i18n from '../../i18n-decorator'
import IpldCarExploreForm from './IpldCarExploreForm'

// const mockExploreBundle = {
//   name: 'explore',
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   selectFoo: () => () => {}, // else compose throws. gotta have at least one selector.
//   doExploreUserProvidedCar: () => { action('explore') }
// }

export default {
  title: 'Explore Car form',
  decorators: [
    i18n
    // bundleDecorator(mockExploreBundle)
  ]
}

export const Default = () => (
  <div className="bg-navy pa3" style={{ height: '100vh' }}>
    <IpldCarExploreForm />
  </div>
)

Default.story = {
  name: 'default'
}
