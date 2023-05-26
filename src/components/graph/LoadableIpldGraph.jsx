import Loadable from '@loadable/component'
import React from 'react'

import ComponentLoader from '../loader/ComponentLoader.js'

const LoadableSettingsPage = Loadable(() => import('./IpldGraphCytoscape.js'),
  { fallback: <ComponentLoader /> }
)

export default LoadableSettingsPage
