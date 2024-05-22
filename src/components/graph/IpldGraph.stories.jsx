import { action } from '@storybook/addon-actions'
import React from 'react'
import dagNodeD from '../object-info/fixtures/object-info-0-links.json'
import dagNodeB from '../object-info/fixtures/object-info-36-links.json'
import dagNodeA from '../object-info/fixtures/object-info-8-links.json'
import IpldGraphCytoscape from './IpldGraphCytoscape'

export default {
  title: 'IPLD Graph'
}

export const Cytoscape8Links = () => (
    <IpldGraphCytoscape
        style={{ width: '50%', height: 500 }}
        path={dagNodeA.cid}
        links={dagNodeA.links}
        onNodeClick={action('node click')}
    />
)

Cytoscape8Links.story = {
  name: 'cytoscape 8 links'
}

export const Cytoscape36Links = () => (
    <IpldGraphCytoscape
        style={{ width: '50%', height: 500 }}
        path={dagNodeB.cid}
        links={dagNodeB.links}
        onNodeClick={action('node click')}
    />
)

Cytoscape36Links.story = {
  name: 'cytoscape 36 links'
}

export const Cytoscape0Links = () => (
    <IpldGraphCytoscape
        style={{ width: '50%', height: 500 }}
        path={dagNodeD.cid}
        links={dagNodeD.links}
        onNodeClick={action('node click')}
    />
)

Cytoscape0Links.story = {
  name: 'cytoscape 0 links'
}
