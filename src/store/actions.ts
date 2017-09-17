import actionCreatorFactory from 'typescript-fsa'
import { IGraph, NodeId } from '../core/interfaces'

// TODO: delete me, move logic into Core or a Reducer
export interface IEditorParseEvent {
    graph: IGraph
}

// TODO: delete me, move logic into Core or a Reducer
export interface IEditorParseError {
    error: string,
    line: number|undefined,
    column: number|undefined
}

export interface ISourceChanged {
    source: string
}

export interface ISourceLoaded {
    source: string,
    zoomNodeId: NodeId|null
}

const actionCreator = actionCreatorFactory()

export const sourceParsed = actionCreator<IEditorParseEvent>('C4_SOURCE_PARSED')
export const sourceParseError = actionCreator<IEditorParseError>('C4_SOURCE_PARSE_ERROR')
export const sourceChanged = actionCreator<ISourceChanged>('C4_SOURCE_CHANGED')
export const sourceLoaded = actionCreator<ISourceLoaded>('C4_SOURCE_LOADED')
