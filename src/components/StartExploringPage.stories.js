import { storiesOf } from '@storybook/react'
import React from 'react'

import StartExploringPage from './StartExploringPage'
import i18n from '../i18n-decorator'

storiesOf('Start Exploring page', module)
  .addDecorator(i18n)
  .add('default', () => (
    <StartExploringPage />
  ))
