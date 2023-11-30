import React from 'react';
import { composeBundlesRaw } from 'redux-bundler';
import { Provider } from 'redux-bundler-react';

// bundle is an object with a `name` and at least one `select*` property
const bundleDecorator = bundle => story => {
  const store = composeBundlesRaw(bundle)();
  return /*#__PURE__*/React.createElement(Provider, {
    store: store
  }, story());
};
export default bundleDecorator;