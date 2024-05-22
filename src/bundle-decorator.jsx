import React from 'react'
import { composeBundlesRaw } from 'redux-bundler'
import { Provider } from 'redux-bundler-react'

// bundle is an object with a `name` and at least one `select*` property
// eslint-disable-next-line react/display-name
const bundleDecorator = (bundle) => (story) => {
  const store = composeBundlesRaw(bundle)()
  return (
    <Provider store={store}>
      {story()}
    </Provider>
  )
}

export default bundleDecorator
