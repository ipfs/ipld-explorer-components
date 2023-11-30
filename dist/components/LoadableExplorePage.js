import Loadable from '@loadable/component';
import React from 'react';
import ComponentLoader from './loader/ComponentLoader';
const LoadableExplorePage = Loadable(() => import('./ExplorePage'), {
  fallback: /*#__PURE__*/React.createElement(ComponentLoader, null)
});
export default LoadableExplorePage;