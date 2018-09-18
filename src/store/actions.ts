import { StateService } from 'angular-ui-router'
import actionCreatorFactory from 'typescript-fsa'
import { IGraph, NodeId } from '../core/interfaces'

export interface IEditorParseEvent {
    graph: IGraph
}

export interface IEditorParseError {
    error: string,
    line?: number,
    column?: number
}

export interface ISourceChanged {
    source: string
}

export interface IZoomChanged {
    zoomNodeId: NodeId | null
}

export interface ISourceLoaded {
    source: string,
    zoomNodeId: NodeId | null
}

export interface IDotChanged {
    dot: string
}
export interface ISvgChanged {
    svg: string
}

export interface IAngularInitialized {
    $state: StateService,
    $window: Window
}

const actionCreator = actionCreatorFactory()

export const sourceParsed = actionCreator<IEditorParseEvent>('C4_SOURCE_PARSED')
export const sourceParseError = actionCreator<IEditorParseError>('C4_SOURCE_PARSE_ERROR')
export const sourceChanged = actionCreator<ISourceChanged>('C4_SOURCE_CHANGED')
export const sourceLoaded = actionCreator<ISourceLoaded>('C4_SOURCE_LOADED')
export const dotChanged = actionCreator<IDotChanged>('C4_DOT_CHANGED')
export const svgChanged = actionCreator<ISvgChanged>('C4_SVG_CHANGED')
export const angularInitialized = actionCreator<IAngularInitialized>('C4_ANGULAR_INITIALIZED')
export const zoomChanged = actionCreator<IZoomChanged>('C4_ZOOM_CHANGED')
