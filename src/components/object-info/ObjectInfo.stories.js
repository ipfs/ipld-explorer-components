import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { checkA11y } from '@storybook/addon-a11y'
import i18n from '../../i18n-decorator'

import ObjectInfo from './ObjectInfo'

// Sample DagNode info
// (await ipfs.object.get('QmQPXjxdsxM7PKp1HVZ3oAXVKLSXoZXFG5CY1evPe4UGCB')).toJSON()
import dagNodeA from './fixtures/object-info-8-links.json'
import dagNodeB from './fixtures/object-info-36-links.json'
import dagNodeC from './fixtures/object-info-1240-links.json'

storiesOf('IPLD Node Info', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .add('cid v0 dag-pb', () => (
    <ObjectInfo
      className='ma2'
      cid={dagNodeA.cid}
      size={dagNodeA.size}
      links={dagNodeA.links}
      data={dagNodeA.data}
      type='dag-pb'
      gatewayUrl='https://ipfs.io'
      publicGatewayUrl='https://dweb.link'
      onLinkClick={action('link clicked')}
    />
  ))
  .add('cid v0 dag-pb 36 links...', () => (
    <ObjectInfo
      className='ma2'
      cid={dagNodeB.cid}
      size={dagNodeB.size}
      links={dagNodeB.links}
      data={dagNodeB.data}
      type='dag-pb'
      gatewayUrl='https://ipfs.io'
      publicGatewayUrl='https://dweb.link'
      onLinkClick={action('link clicked')}
    />
  ))
  .add('cid v0 dag-pb 1240 links...', () => (
    <ObjectInfo
      className='ma2'
      cid={dagNodeC.cid}
      size={dagNodeC.size}
      links={dagNodeC.links}
      data={dagNodeC.data}
      type='dag-pb'
      gatewayUrl='https://ipfs.io'
      publicGatewayUrl='https://dweb.link'
      onLinkClick={action('link clicked')}
    />
  ))
