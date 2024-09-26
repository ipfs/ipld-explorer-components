import Loadable from '@loadable/component'
import React from 'react'
import ComponentLoader from './loader/ComponentLoader'

const LoadableExplorePage = Loadable(async () => import('./ExplorePage.jsx'),
  { fallback: <ComponentLoader /> }
)

export default LoadableExplorePage
