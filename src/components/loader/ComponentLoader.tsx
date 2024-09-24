import React from 'react'
import Box from '../box/Box.jsx'
import { Loader } from './Loader.jsx'

const ComponentLoader: React.FC = () => (
  <Box style={{ height: '100%' }}>
    <div style={{ height: '100%' }}>
      <Loader color="dark" />
    </div>
  </Box>
)

export default ComponentLoader
