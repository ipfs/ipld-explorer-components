import { action } from '@storybook/addon-actions'
import React from 'react'
import i18n from '../../i18n-decorator'
import ObjectInfo from './ObjectInfo'
import dagNodeC from './fixtures/object-info-1240-links.json'
import dagNodeB from './fixtures/object-info-36-links.json'
import dagNodeA from './fixtures/object-info-8-links.json'

export default {
  title: 'IPLD Node Info',
  decorators: [
    i18n
  ]
}

export const CidV0DagPb = () => (
    <ObjectInfo
        className="ma2"
        cid={dagNodeA.cid}
        size={dagNodeA.size}
        links={dagNodeA.links}
        data={dagNodeA.data}
        type="dag-pb"
        gatewayUrl="https://ipfs.io"
        publicGatewayUrl="https://dweb.link"
        onLinkClick={action('link clicked')}
    />
)

CidV0DagPb.story = {
  name: 'cid v0 dag-pb'
}

export const CidV0DagPb36Links = () => (
    <ObjectInfo
        className="ma2"
        cid={dagNodeB.cid}
        size={dagNodeB.size}
        links={dagNodeB.links}
        data={dagNodeB.data}
        type="dag-pb"
        gatewayUrl="https://ipfs.io"
        publicGatewayUrl="https://dweb.link"
        onLinkClick={action('link clicked')}
    />
)

CidV0DagPb36Links.story = {
  name: 'cid v0 dag-pb 36 links...'
}

export const CidV0DagPb1240Links = () => (
    <ObjectInfo
        className="ma2"
        cid={dagNodeC.cid}
        size={dagNodeC.size}
        links={dagNodeC.links}
        data={dagNodeC.data}
        type="dag-pb"
        gatewayUrl="https://ipfs.io"
        publicGatewayUrl="https://dweb.link"
        onLinkClick={action('link clicked')}
    />
)

CidV0DagPb1240Links.story = {
  name: 'cid v0 dag-pb 1240 links...'
}
