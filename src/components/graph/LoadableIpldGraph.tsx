import Loadable from '@loadable/component'
import React from 'react'
import ComponentLoader from '../loader/ComponentLoader'

const LoadableSettingsPage = Loadable(async () => import('./IpldGraphCytoscape.jsx'),
  { fallback: <ComponentLoader /> }
)

export default LoadableSettingsPage
