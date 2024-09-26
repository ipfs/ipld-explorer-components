import React from 'react'
import GraphCrumb from './GraphCrumb'
import { CID } from 'multiformats/cid'

/**
 * @type {import('@storybook/react').Meta<typeof GraphCrumb>}
 */
const meta = {
  title: 'IPLD Graph Crumbs',
  component: GraphCrumb,
  // render: () => (
  //   <GraphCrumb />
  // )
}
export default meta

export const LotsOfPaths = () => (
    <div>
        <GraphCrumb className="ma3" cid={CID.parse("zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111")} pathBoundaries={[]} />

        <GraphCrumb
            className="ma3"
            cid={CID.parse("zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111")}
            pathBoundaries={[
              {
                source: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z1111'),
                target: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z2222'),
                path: 'favourites/0'
              },
              {
                source: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z2222'),
                target: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z3333'),
                path: 'artist'
              },
              {
                source: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z3333'),
                target: CID.parse('zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4z4444'),
                path: 'bio'
              },
              {
                // @ts-expect-error - invalid CID
                source: 'QmHash1111',
                // @ts-expect-error - invalid CID
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
