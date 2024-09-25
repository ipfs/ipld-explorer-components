import React from 'react'
import i18n from '../../i18n-decorator.tsx'
import { ExploreProvider } from '../../providers/explore.tsx'
import { HeliaProvider } from '../../providers/helia.tsx'
import IpldExploreForm from './IpldExploreForm.tsx'

export default {
  title: 'Explore form',
  decorators: [i18n]
}

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
