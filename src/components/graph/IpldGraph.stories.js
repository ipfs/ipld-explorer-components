import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import IpldGraphCytoscape from './IpldGraphCytoscape'
import dagNodeD from '../object-info/fixtures/object-info-0-links.json'
import dagNodeB from '../object-info/fixtures/object-info-36-links.json'
import dagNodeA from '../object-info/fixtures/object-info-8-links.json'
// import dagNodeC from '../object-info/fixtures/object-info-1240-links.json'

storiesOf('IPLD Graph', module)
  .add('cytoscape 8 links', () => (
    <IpldGraphCytoscape
      style={{ width: '50%', height: 500 }}
      path={dagNodeA.cid}
      links={dagNodeA.links}
      onNodeClick={action('node click')}
    />
  ))
  .add('cytoscape 36 links', () => (
    <IpldGraphCytoscape
      style={{ width: '50%', height: 500 }}
      path={dagNodeB.cid}
      links={dagNodeB.links}
      onNodeClick={action('node click')}
    />
  ))
  .add('cytoscape 0 links', () => (
    <IpldGraphCytoscape
      style={{ width: '50%', height: 500 }}
      path={dagNodeD.cid}
      links={dagNodeD.links}
      onNodeClick={action('node click')}
    />
  ))
