import React from 'react'
import Box from '../box/Box'
import { Loader } from './Loader'

const ComponentLoader = () => (
  <Box style={{ height: '100%' }}>
    <div style={{ height: '100%' }}>
      <Loader color="dark" />
    </div>
  </Box>
)

export default ComponentLoader
