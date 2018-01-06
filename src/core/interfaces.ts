
export interface IGraph {
    items: INode[]
    edges: IEdge[]
    title?: string
    roots: NodeId[]
    idMap: { [id: string]: INode }
    pathMap: { [path: string]: NodeId }
}

export interface IEdge {
    type: 'edge'
    id: NodeId
    sourceId: NodeId
    to: Path
    destinationId: NodeId
    sourceParentIds: NodeId[]
    destinationParentIds: NodeId[]
    description?: string
    tech?: string
    direction?: string
}

export function isEdge(x: INode | IEdge): x is IEdge {
    return x.type === 'edge'
}

export interface INode {
    type: string
    name: string
    id: NodeId
    path: Path
    children: Array<INode | IEdge>
    parentId?: NodeId
    description?: string
    tech?: string
    canExpand?: boolean
}

export type NodeId = string
export type Path = string
