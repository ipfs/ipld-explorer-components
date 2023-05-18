import React from 'react'
import Loadable from '@loadable/component'
import ComponentLoader from '@/components/loader/ComponentLoader.jsx'

const LoadableExplorePage = Loadable(() => import('./ExplorePage'),
  { fallback: <ComponentLoader/> }
)

export default LoadableExplorePage
