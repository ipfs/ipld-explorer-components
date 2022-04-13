import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import i18n from '../../i18n-decorator'
import bundleDecorator from '../../bundle-decorator'
import IpldCarExploreForm from './IpldCarExploreForm'

const mockExploreBundle = {
  name: 'explore',
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
