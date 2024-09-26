import React from 'react'
import i18n from '../i18n-decorator'
import StartExploringPage from './StartExploringPage'
import { Meta } from '@storybook/react'

const meta: Meta<typeof StartExploringPage> = {
  title: 'Start Exploring page',
  component: StartExploringPage,
  decorators: [i18n],
  render: () => (
    <StartExploringPage />
  )
}
export default meta

export const Default = () => <StartExploringPage />

Default.story = {
  name: 'default'
}
