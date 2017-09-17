import { IGraph, INode, NodeId } from '../core/interfaces'

export interface IState {
    source: string
    parseError: string | null
    graph: IGraph | null
    zoomNodeId: NodeId|null
    zoomableNodes: INode[]
}
