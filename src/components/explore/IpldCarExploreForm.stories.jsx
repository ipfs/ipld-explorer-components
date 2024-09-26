import React from 'react'
import i18n from '../../i18n-decorator'
import { ExploreProvider } from '../../providers/explore.tsx'
import { HeliaProvider } from '../../providers/helia.tsx'
import IpldCarExploreForm from './IpldCarExploreForm.tsx'

/**
 * @type {import('@storybook/react').Meta<typeof IpldCarExploreForm>}
 */
const meta = {
  title: 'Explore Car form',
  component: IpldCarExploreForm,
  decorators: [i18n],
  render: () => (
    <IpldCarExploreForm />
  )
}

export default meta

export const Default = () => (
  <div className="bg-navy pa3" style={{ height: '100vh' }}>
    <HeliaProvider>
      <ExploreProvider>
        <IpldCarExploreForm />
      </ExploreProvider>
    </HeliaProvider>
  </div>
)

Default.story = {
  name: 'default'
}
