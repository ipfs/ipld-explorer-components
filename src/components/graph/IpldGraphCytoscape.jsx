import React from 'react'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { getCodecOrNull } from '../../lib/cid'
import { colorForNode } from '../object-info/ObjectInfo'

cytoscape.use(dagre)

const graphOpts = {
  wheelSensitivity: 0.05,
  layout: {
    name: 'dagre',
    rankSep: 80,
    nodeSep: 1
  },
  style: [
    {
      selector: 'node',
      style: {
        shape: 'ellipse',
        width: '14px',
        height: '14px',
        'background-color': 'data(bg)'
      }
    },
    {
      selector: 'edge',
      style: {
        'source-distance-from-node': 3,
        'target-distance-from-node': 4,
        'curve-style': 'bezier',
        'control-point-weight': 0.5,
        width: 1,
        'line-color': '#979797',
        'line-style': 'dotted',
        'target-label': 'data(index)',
        'font-family': 'Consolas, monaco, monospace',
        'font-size': '8px',
        'target-text-margin-x': '-5px',
        color: '#ccc',
        'target-text-margin-y': '-2px',
        'text-halign': 'center',
        'text-valign': 'bottom'
      }
    }
  ]
}

export default class IpldGraphCytoscape extends React.Component {
  constructor (props) {
    super(props)
    this.graphRef = React.createRef()
    this.renderTree = this.renderTree.bind(this)
    this.ipfsLinksToCy = this.ipfsLinksToCy.bind(this)
    this.cy = null
    this.state = {}
  }

  static getDerivedStateFromProps (props, state) {
    // TODO: Show that links have been truncated.
    return {
      truncatedLinks: props.links.slice(0, 100)
    }
  }

  componentDidMount () {
    const { path } = this.props
    const { truncatedLinks: links } = this.state
    const container = this.graphRef.current
    this.cy = this.renderTree({ path, links, container })
  }

  componentDidUpdate () {
    this.cy.destroy()
    const { path } = this.props
    const { truncatedLinks: links } = this.state
    const container = this.graphRef.current
    this.cy = this.renderTree({ path, links, container })
  }

  render () {
    // pluck out custom props. Pass anything else on
    const { onNodeClick, path, cid, className, ...props } = this.props
    return <div className={className} ref={this.graphRef} {...props} />
  }

  renderTree ({ path, links, container }) {
    const cyLinks = this.ipfsLinksToCy(links)
    // TODO: path is currently alwasys the root cid, but this will change.
    const root = this.makeNode({ target: path }, '')

    // list of graph elements to start with
    const elements = [
      root,
      ...cyLinks
    ]

    const cy = cytoscape({
      elements: elements,
      container: container,
      ...graphOpts
    })

    if (this.props.onNodeClick) {
      cy.on('tap', async (e) => {
        // onNodeClick is triggered when clicking in gaps between nodes which is weird
        if (!e.target.data) return
        const data = e.target.data()
        const link = this.state.truncatedLinks[data.index]
        this.props.onNodeClick(link)
      })
    }

    return cy
  }

  ipfsLinksToCy (links) {
    const edges = links.map(this.makeLink)
    const nodes = links.map(this.makeNode)
    return [...nodes, ...edges]
  }

  makeNode ({ target, path }, index) {
    const type = getCodecOrNull(target)
    const bg = colorForNode(type)
    return {
      group: 'nodes',
      data: {
        id: target,
        path,
        bg,
        index
      }
    }
  }

  makeLink ({ source, target, path }, index) {
    return {
      group: 'edges',
      data: {
        source,
        target,
        index
      }
    }
  }

  runLayout (cy) {
    cy.layout(this.layoutOpts).run()
  }
}
