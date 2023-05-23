import React from 'react'
import Loadable from '@loadable/component'
import ComponentLoader from './loader/ComponentLoader.jsx'

const LoadableExplorePage = Loadable(() => import('./ExplorePage.jsx'),
  { fallback: <ComponentLoader /> }
)

export default LoadableExplorePage
