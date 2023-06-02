// import { checkA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions'
// import { withKnobs, boolean } from '@storybook/addon-knobs';
import React from 'react'

import ComponentLoader from './ComponentLoader.jsx'

export default {
  title: 'Loader'
  // decorators: [checkA11y, withKnobs],
}

export const _ComponentLoader = () => (
    <div className="sans-serif pa4" style={{ height: 400 }}>
      <ComponentLoader pastDelay={false} />
    </div>
)

_ComponentLoader.story = {
  name: 'ComponentLoader'
}
