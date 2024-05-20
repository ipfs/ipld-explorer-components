import React from 'react'
import i18n from '../i18n-decorator'
import StartExploringPage from './StartExploringPage'

export default {
  title: 'Start Exploring page',
  decorators: [i18n]
}

export const Default = () => <StartExploringPage />

Default.story = {
  name: 'default'
}
