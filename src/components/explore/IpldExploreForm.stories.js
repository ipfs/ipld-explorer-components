import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import IpldExploreForm from './IpldExploreForm'
import bundleDecorator from '../../bundle-decorator'
import i18n from '../../i18n-decorator'

const mockExploreBundle = {
  name: 'explore',
  selectFoo: () => () => {}, // else compose throws. gotta have at least one selector.
  doExploreUserProvidedPath: action('explore')
}

storiesOf('Explore form', module)
  .addDecorator(i18n)
  .addDecorator(bundleDecorator(mockExploreBundle))
  .add('default', () => (
    <div className='bg-navy pa3' style={{ height: '100vh' }}>
      <IpldExploreForm />
    </div>
  ))
