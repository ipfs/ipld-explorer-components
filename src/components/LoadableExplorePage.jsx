import Loadable from '@loadable/component'
import React from 'react'

import ComponentLoader from './loader/ComponentLoader'

const LoadableExplorePage = Loadable(() => import('./ExplorePage'),
  { fallback: <ComponentLoader /> }
)

export default LoadableExplorePage
