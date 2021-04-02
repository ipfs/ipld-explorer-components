/* global it expect jest */
import CID from 'cids'
import { DAGNode } from 'ipld-dag-pb'
import resolveIpldPath, { findLinkPath } from './resolve-ipld-path'

it('resolves all nodes traversed along a path', async () => {
  const ipfsMock = {
    dag: { get: jest.fn() }
  }
  const cid = 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4zrvSs'
  const path = '/a/b/a'
  const linkCid = 'zdpuAyzU5ahAKr5YV24J5TqrDX8PhzHLMkxx69oVzkBDWHnjq'
  const dagGetRes1 = {
    value: {
      a: {
        b: new CID(linkCid)
      }
    },
    remainderPath: '/a'
  }
  const dagGetRes2 = {
    value: {
      a: 'hello world'
    },
    remainderPath: '/a'
  }

  ipfsMock.dag.get.mockReturnValueOnce(Promise.resolve(dagGetRes1))
  ipfsMock.dag.get.mockReturnValueOnce(Promise.resolve(dagGetRes2))

  const res = await resolveIpldPath(ipfsMock, new CID(cid), path)

  expect(ipfsMock.dag.get.mock.calls.length).toBe(2)
  expect(res.canonicalPath).toBe(`${linkCid}/a`)
  expect(res.nodes.length).toBe(2)
  expect(res.nodes[0].type).toBe('dag-cbor')
  expect(res.nodes[0].cid).toBe(cid)
  expect(res.nodes[1].type).toBe('dag-cbor')
  expect(res.nodes[1].cid).toBe(linkCid)
  expect(res.pathBoundaries.length).toBe(1)
  expect(res.pathBoundaries[0]).toEqual({
    path: 'a/b',
    source: cid,
    target: linkCid
  })
})

it('resolves thru dag-cbor to dag-pb', async () => {
  const ipfsMock = {
    dag: {
      get: jest.fn()
    }
  }

  const cid = 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4zrvSs'
  const path = '/a/b/pb1'

  const dagNode3 = await createDagPbNode(new Uint8Array(Buffer.from('the second pb node')), [])
  const dagNode3CID = 'QmRLacjo71FTzKFELa7Yf5YqMwdftKNDNFq7EiE13uohar'

  const dagNode2 = await createDagPbNode(new Uint8Array(Buffer.from('the first pb node')), [{
    name: 'pb1',
    cid: dagNode3CID,
    size: 101
  }])
  const dagNode2CID = 'QmW4sMkvHnTnVPkBJYToRW4burdMk9DHP5qGE4CYGUtHiQ'

  const dagNode1 = {
    a: {
      b: new CID(dagNode2CID)
    }
  }

  const dagGetRes1 = {
    value: dagNode1,
    remainderPath: 'pb1'
  }

  const dagGetRes2 = {
    value: dagNode2,
    remainderPath: ''
  }

  const dagGetRes3 = {
    value: dagNode3,
    remainderPath: ''
  }

  ipfsMock.dag.get.mockReturnValueOnce(Promise.resolve(dagGetRes1))
  ipfsMock.dag.get.mockReturnValueOnce(Promise.resolve(dagGetRes2))
  ipfsMock.dag.get.mockReturnValueOnce(Promise.resolve(dagGetRes3))

  const res = await resolveIpldPath(ipfsMock, new CID(cid), path)

  expect(ipfsMock.dag.get.mock.calls.length).toBe(3)
  expect(res.targetNode.cid).toEqual(dagNode3CID)
  expect(res.canonicalPath).toBe(dagNode3CID)
  expect(res.nodes.length).toBe(3)
  expect(res.nodes[0].type).toBe('dag-cbor')
  expect(res.nodes[0].cid).toBe(cid)
  expect(res.nodes[0].links.length).toBe(1)
  expect(res.nodes[1].type).toBe('dag-pb')
  expect(res.nodes[1].cid).toBe(dagNode2CID)
  expect(res.nodes[1].links.length).toBe(1)
  expect(res.nodes[2].type).toBe('dag-pb')
  expect(res.nodes[2].cid).toBe(dagNode3CID)
  expect(res.nodes[2].links.length).toBe(0)
  expect(res.pathBoundaries.length).toBe(2)
  expect(res.pathBoundaries[0]).toEqual({
    path: 'a/b',
    source: cid,
    target: dagNode2CID
  })
  expect(res.pathBoundaries[1]).toEqual({
    index: 0,
    path: 'pb1',
    size: dagNode2.toJSON().links[0].size,
    source: dagNode2CID,
    target: dagNode3CID
  })
})

function createDagPbNode (data, links) {
  const node = new DAGNode(data)

  for (const link of links) {
    node.addLink(link)
  }

  return node
}

it('finds the linkPath from a fullPath and a remainderPath', () => {
  expect(findLinkPath('', '')).toBe(null)
  expect(findLinkPath('/', '')).toBe(null)
  expect(findLinkPath('/foo/bar', 'bar')).toBe('foo')
  expect(findLinkPath('/a/b/c/a', 'b/c/a')).toBe('a')
  expect(findLinkPath('/a/b/c/a', '/b/c/a')).toBe('a')
  expect(findLinkPath('a/b/c/a', '/b/c/a')).toBe('a')
  expect(() => findLinkPath('/foo', 'wat')).toThrow()
})
