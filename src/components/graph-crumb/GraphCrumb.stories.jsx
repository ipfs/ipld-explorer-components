import React from 'react'
import GraphCrumb from './GraphCrumb'

export default {
  title: 'IPLD Graph Crumbs'
  // decorators: [checkA11y],
}

export const LotsOfPaths = () => (
    <div>
        <GraphCrumb className="ma3" cid="zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111" pathBoundaries={[]} />

        <GraphCrumb
            className="ma3"
            cid="zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111"
            pathBoundaries={[
              {
                source: 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111',
                target: 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z2222',
                path: 'favourites/0'
              },
              {
                source: 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z2222',
                target: 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z3333',
                path: 'artist'
              },
              {
                source: 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z3333',
                target: 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z4444',
                path: 'bio'
              },
              {
                source: 'QmHash1111',
                target: 'QmHash1111',
                path: 'avatar.jpg'
              }
            ]}
        />
    </div>
)

LotsOfPaths.story = {
  name: 'lots of paths'
}
