/* global it expect jest */
import { DAGNode, DAGLink, util as DAGUtil } from 'ipld-dag-pb'
import resolveIpldPath, {
  findLinkPath
} from './resolve-ipld-path'

it('resolves all nodes traversed along a path', async () => {
  const ipldGetMock = jest.fn()
  const cid = 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4zrvSs'
  const path = '/a/b/a'
  const linkCid = 'zdpuAyzU5ahAKr5YV24J5TqrDX8PhzHLMkxx69oVzkBDWHnjq'
  const dagGetRes1 = {
    value: {
      a: {
        b: {
          '/': linkCid
        }
      }
    }
  }
  const dagGetRes2 = {
    remainderPath: '/a'
  }
  const dagGetRes3 = {
    value: {
      a: 'hello world'
    }
  }
  const dagGetRes4 = {
    remainderPath: '/a'
  }

  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes1))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes2))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes3))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes4))

  const res = await resolveIpldPath(ipldGetMock, cid, path)

  expect(ipldGetMock.mock.calls.length).toBe(4)
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

it('resolves thru dag-cbor to dag-pb to dag-pb', async () => {
  const ipldGetMock = jest.fn()
  const cid = 'zdpuAs8sJjcmsPUfB1bUViftCZ8usnvs2cXrPH6MDyT4zrvSs'
  const path = '/a/b/pb1'

  const dagNode3 = await createDagPbNode(Buffer.from('the second pb node'), [])

  let dagNode2 = await createDagPbNode(Buffer.from('the first pb node'), [])

  dagNode2 = await addDagPbNodeLink(dagNode2, dagNode3)

  const dagNode1 = await createDagPbNode('', [
    new DAGLink('/a/b', dagNode2.size, await cidFromDagPbNode(dagNode2))
  ])

  const dagGetRes1 = {
    value: dagNode1
  }

  const dagGetRes2 = {
    remainderPath: 'pb1'
  }

  const dagGetRes3 = {
    value: dagNode2
  }

  const dagGetRes4 = {
    remainderPath: ''
  }

  const dagGetRes5 = {
    value: dagNode3
  }

  const dagGetRes6 = {
    remainderPath: ''
  }

  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes1))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes2))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes3))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes4))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes5))
  ipldGetMock.mockReturnValueOnce(Promise.resolve(dagGetRes6))

  const res = await resolveIpldPath(ipldGetMock, cid, path)

  expect(ipldGetMock.mock.calls.length).toBe(6)
  expect(res.targetNode).toEqual(await cidFromDagPbNode(dagNode3))
  expect(res.canonicalPath).toBe(await cidFromDagPbNode(dagNode3))
  expect(res.nodes.length).toBe(3)
  expect(res.nodes[0].type).toBe('dag-cbor')
  expect(res.nodes[0].cid).toBe(cid)
  expect(res.nodes[0].links.length).toBe(1)
  expect(res.nodes[1].type).toBe('dag-pb')
  expect(res.nodes[1].cid).toBe(await cidFromDagPbNode(dagNode2.toJSON()))
  expect(res.nodes[1].links.length).toBe(1)
  expect(res.nodes[2].type).toBe('dag-pb')
  expect(res.nodes[2].cid).toBe(await cidFromDagPbNode(dagNode3.toJSON()))
  expect(res.nodes[2].links.length).toBe(0)
  expect(res.pathBoundaries.length).toBe(2)
  expect(res.pathBoundaries[0]).toEqual({
    path: 'a/b',
    source: cid,
    target: await cidFromDagPbNode(dagNode2)
  })
  expect(res.pathBoundaries[1]).toEqual({
    index: 0,
    path: 'pb1',
    size: dagNode2.toJSON().links[0].size,
    source: await cidFromDagPbNode(dagNode2.toJSON()),
    target: await cidFromDagPbNode(dagNode3.toJSON())
  })
})

function createDagPbNode (data, links) {
  return new Promise((resolve, reject) => {
    DAGNode.create(data, links, (err, dagNode) => {
      if (err) return reject(err)
      resolve(dagNode)
    })
  })
}

function addDagPbNodeLink (dagNode, link) {
  return new Promise((resolve, reject) => {
    DAGNode.addLink(dagNode, link, (err, dagNodeA) => {
      if (err) return reject(err)
      resolve(dagNodeA)
    })
  })
}

function cidFromDagPbNode (dagNode) {
  return new Promise((resolve, reject) => {
    DAGUtil.cid(dagNode, {}, (err, cid) => {
      if (err) return reject(err)
      resolve(cid)
    })
  })
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
