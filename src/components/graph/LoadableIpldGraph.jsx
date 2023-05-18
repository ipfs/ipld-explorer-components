import React from 'react'
import Loadable from '@loadable/component'
import ComponentLoader from '@/components/loader/ComponentLoader.jsx'

const LoadableSettingsPage = Loadable(() => import('./IpldGraphCytoscape'),
  { fallback: <ComponentLoader/> }
)

export default LoadableSettingsPage
