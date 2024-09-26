import React from 'react'
import ComponentLoader from './ComponentLoader'

/**
 * @type {import('@storybook/react').Meta<typeof ComponentLoader>}
 */
const meta = {
  title: 'Loader',
  component: ComponentLoader,
  render: () => (
    <ComponentLoader />
  )
}
export default meta

export const _ComponentLoader = () => (
    <div className="sans-serif pa4" style={{ height: 400 }}>
      <ComponentLoader />
    </div>
)

_ComponentLoader.story = {
  name: 'ComponentLoader'
}
