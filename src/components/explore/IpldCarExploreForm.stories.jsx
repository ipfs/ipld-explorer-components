import React from 'react'
import i18n from '../../i18n-decorator'
import { ExploreProvider } from '../../providers/explore.tsx'
import { HeliaProvider } from '../../providers/helia.tsx'
import IpldCarExploreForm from './IpldCarExploreForm.tsx'

export default {
  title: 'Explore Car form',
  decorators: [
    i18n
  ]
}

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
