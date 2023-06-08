import React from 'react'

import { Loader } from './Loader'
import Box from '../box/Box'

const ComponentLoader = () => (
  <Box style={{ height: '100%' }}>
    <div style={{ height: '100%' }}>
      <Loader color="dark" />
    </div>
  </Box>
)

export default ComponentLoader
