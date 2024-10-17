import React from 'react'
import i18n from '../../i18n-decorator.tsx'
import { ExploreProvider } from '../../providers/explore.tsx'
import { HeliaProvider } from '../../providers/helia.tsx'
import IpldExploreForm from './IpldExploreForm.tsx'

/**
 * @type {import('@storybook/react').Meta<typeof IpldExploreForm>}
 */
const meta = {
  title: 'Explore form',
  component: IpldExploreForm,
  decorators: [i18n],
  render: () => (
    <IpldExploreForm />
  )
}

export default meta

export const Default = () => (
    <div className="bg-navy pa3" style={{ height: '100vh' }}>
      <HeliaProvider>
        <ExploreProvider>
          <IpldExploreForm />
        </ExploreProvider>
      </HeliaProvider>
    </div>
)

Default.story = {
  name: 'default'
}
