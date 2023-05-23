import React from 'react'
import Loadable from '@loadable/component'
import ComponentLoader from '../loader/ComponentLoader.jsx'

const LoadableSettingsPage = Loadable(() => import('./IpldGraphCytoscape.jsx'),
  { fallback: <ComponentLoader /> }
)

export default LoadableSettingsPage
