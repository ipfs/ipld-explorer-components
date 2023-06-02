import React from 'react'

import StartExploringPage from './StartExploringPage'
import i18n from '../i18n-decorator.jsx'

export default {
  title: 'Start Exploring page',
  decorators: [i18n]
}

export const Default = () => <StartExploringPage />

Default.story = {
  name: 'default'
}
