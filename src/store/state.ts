import { StateService } from 'angular-ui-router'
import { IGraph, INode, NodeId } from '../core/interfaces'

export interface IState {
    source: string
    parseError: string | null
    graph: IGraph | null
    zoomNodeId: NodeId | null
    zoomableNodes: INode[],
    dot?: string,
    svg?: string,
    // TODO: just keep a ((id:NodeId) => Uri) method in state
    $state?: StateService
}
