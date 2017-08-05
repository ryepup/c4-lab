
export interface IGraph {
    items: INode[]
    edges: IEdge[]
    title?: string
    roots: NodeId[]
    idMap: { [id: string]: INode }
    pathMap: { [path: string]: INode }
}

export interface IEdge {
    type: string
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
