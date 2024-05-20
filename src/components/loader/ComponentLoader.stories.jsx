import React from 'react'
import ComponentLoader from './ComponentLoader'

export default {
  title: 'Loader'
}

export const _ComponentLoader = () => (
    <div className="sans-serif pa4" style={{ height: 400 }}>
      <ComponentLoader pastDelay={false} />
    </div>
)

_ComponentLoader.story = {
  name: 'ComponentLoader'
}
