// import { checkA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
import React from 'react'

import Cid from './Cid'

export default {
  title: 'CID',
  decorators: [
    // checkA11y
  ]
}

export const CidV0 = () => (
    <Cid
        className="db ma2 monospace"
        value="QmYPNmahJAvkMTU6tDx5zvhEkoLzEFeTDz6azDCSNqzKkW"
        // onClick={action('click')}
    />
)

CidV0.story = {
  name: 'CID v0'
}

export const CidV1 = () => (
    <Cid
        className="db ma2 monospace"
        value="zb2rhZMC2PFynWT7oBj7e6BpDpzge367etSQi6ZUA81EVVCxG"
        // onClick={action('click')}
    />
)

CidV1.story = {
  name: 'CID v1'
}

export const CidV1Sha3 = () => (
    <Cid
        className="db ma2 monospace"
        value="zB7NbGN5wyfSbNNNwo3smZczHZutiWERdvWuMcHXTj393RnbhwsHjrP7bPDRPA79YWPbS69cZLWXSANcwUMmk4Rp3hP9Y"
        // onClick={action('click')}
    />
)

CidV1Sha3.story = {
  name: 'CID v1 sha3'
}
