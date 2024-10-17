import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import React from 'react'
import { getCodecOrNull } from '../../lib/cid.js'
import { colorForNode } from '../object-info/ObjectInfo.js'

cytoscape.use(dagre)

const graphOpts: Omit<cytoscape.CytoscapeOptions, 'elements' | 'container' | 'layout'> & { layout: dagre.DagreLayoutOptions } = {
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
        // @ts-expect-error - maybe cytoscape types bug
        'target-text-margin-x': '-5px',
        color: '#ccc',
        // @ts-expect-error - maybe cytoscape types bug
        'target-text-margin-y': '-2px',
        'text-halign': 'center',
        'text-valign': 'bottom'
      }
    }
  ]
}

export interface IpldGraphCytoscapeProps extends React.HTMLAttributes<HTMLDivElement> {
  links: any[]
  path: string
  // cid: string
  onNodeClick?(arg0: any): void
  // className: string
}

interface IpldGraphCytoscapeState {
  truncatedLinks: any[]
}

export default class IpldGraphCytoscape extends React.Component<IpldGraphCytoscapeProps, IpldGraphCytoscapeState> {
  readonly graphRef: React.RefObject<HTMLDivElement>
  cy: cytoscape.Core | null
  constructor (props: IpldGraphCytoscapeProps) {
    super(props)
    this.graphRef = React.createRef()
    this.renderTree = this.renderTree.bind(this)
    this.ipfsLinksToCy = this.ipfsLinksToCy.bind(this)
    this.cy = null
    this.state = { truncatedLinks: [] }
  }

  static getDerivedStateFromProps (props: IpldGraphCytoscapeProps, state: IpldGraphCytoscapeState): IpldGraphCytoscapeState {
    // TODO: Show that links have been truncated.
    return {
      truncatedLinks: props.links?.slice(0, 100) ?? []
    }
  }

  componentDidMount (): void {
    const { path } = this.props
    const { truncatedLinks: links } = this.state
    const container = this.graphRef.current
    this.cy = this.renderTree({ path, links, container })
  }

  componentDidUpdate (): void {
    this.cy?.destroy()
    const { path } = this.props
    const { truncatedLinks: links } = this.state
    const container = this.graphRef.current
    this.cy = this.renderTree({ path, links, container })
  }

  render (): React.ReactNode {
    // pluck out custom props. Pass anything else on
    const { onNodeClick, path, className, ...props } = this.props
    return <div className={className} ref={this.graphRef} {...props} />
  }

  renderTree ({ path, links, container }: { path: string, links: any[], container: HTMLElement | null | undefined }): cytoscape.Core {
    const cyLinks = this.ipfsLinksToCy(links)
    // TODO: path is currently alwasys the root cid, but this will change.
    const root = this.makeNode({ target: path }, '')

    // list of graph elements to start with
    const elements = [
      root,
      ...cyLinks
    ]

    const cy = cytoscape({
      elements,
      container,
      ...graphOpts
    })

    if (this.props.onNodeClick != null) {
      cy.on('tap', (e): void => {
        // onNodeClick is triggered when clicking in gaps between nodes which is weird
        if (e.target.data == null) return
        const data = e.target.data()
        const link = this.state?.truncatedLinks?.[data.index]
        this.props.onNodeClick?.(link)
      })
    }

    return cy
  }

  ipfsLinksToCy (links: any[]): any[] {
    const edges = links.map(this.makeLink)
    const nodes = links.map(this.makeNode)
    return [...nodes, ...edges]
  }

  makeNode ({ target, path }: any, index: string | number): any {
    const type = getCodecOrNull(target)
    // @ts-expect-error - todo: resolve this type error
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

  makeLink ({ source, target, path }: any, index: number): any {
    return {
      group: 'edges',
      data: {
        source,
        target,
        index
      }
    }
  }
}
