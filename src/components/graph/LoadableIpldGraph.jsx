import Loadable from '@loadable/component'
import React from 'react'

import ComponentLoader from '../loader/ComponentLoader'

const LoadableSettingsPage = Loadable(() => import('./IpldGraphCytoscape'),
  { fallback: <ComponentLoader /> }
)

export default LoadableSettingsPage
