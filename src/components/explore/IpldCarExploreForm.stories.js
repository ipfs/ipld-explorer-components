import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import IpldCarExploreForm from './IpldCarExploreForm'
import bundleDecorator from '../../bundle-decorator'
import i18n from '../../i18n-decorator'

const mockExploreBundle = {
  name: 'explore',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectFoo: () => () => {}, // else compose throws. gotta have at least one selector.
  doExploreUserProvidedCar: action('explore')
}

storiesOf('Explore Car form', module)
  .addDecorator(i18n)
  .addDecorator(bundleDecorator(mockExploreBundle))
  .add('default', () => (
    <div className='bg-navy pa3' style={{ height: '100vh' }}>
      <IpldCarExploreForm />
    </div>
  ))
