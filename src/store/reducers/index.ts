import { StateService } from 'angular-ui-router'
import { Action, combineReducers } from 'redux'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { DataStore } from '../../core'
import { IGraph, INode, NodeId } from '../../core/interfaces'
import {
    angularInitialized, dotChanged, sourceChanged,
    sourceLoaded, sourceParsed, sourceParseError, svgChanged, zoomChanged,
} from '../actions'
import { IState } from '../state'
import sample from './c4lab.sexp'

export const initialState: IState = {
    graph: null,
    parseError: null,
    source: sample,
    zoomNodeId: null,
    zoomableNodes: [],
}

const sourceReducer = reducerWithInitialState(sample)
    .cases([sourceLoaded, sourceChanged], (old, evt) => evt.source)
    .build()

// TODO: not need this; there's gotta be some config to teach jest's
// typescript preprocessor to respect the additional types
const testSafeSourceReducer = (src: string, evt: any) =>
    sourceReducer(src, evt) || ''

const parseErrorReducer = reducerWithInitialState<string | null>(null)
    .case(sourceParseError, (old, evt) => evt.error)
    .case(sourceParsed, (old, evt) => null)
    .build()

const graphReducer = reducerWithInitialState<IGraph | null>(null)
    .case(sourceParsed, (old, evt) => evt.graph)
    .build()

const zoomableNodesReducer = reducerWithInitialState<INode[]>([])
    .case(sourceParsed, (old, evt) => evt.graph.items
        .filter((x) => x.canExpand)
        .sort((a, b) => a.path.localeCompare(b.path)))
    .build()

const zoomNodeIdReducer = reducerWithInitialState<NodeId | null>(null)
    .cases([sourceLoaded, zoomChanged], (old, evt) => evt.zoomNodeId || null)
    .build()

const dotReducer = reducerWithInitialState<string | null>(null)
    .case(dotChanged, (old, evt) => evt.dot)
    .build()

const svgReducer = reducerWithInitialState<string | null>(null)
    .case(svgChanged, (old, evt) => evt.svg)
    .build()

const stateReducer = reducerWithInitialState<StateService | null>(null)
    .case(angularInitialized, (old, evt) => evt.$state)
    .build()

const windowReducer = reducerWithInitialState<Window | null>(null)
    .case(angularInitialized, (old, evt) => evt.$window)
    .build()

const rootReducer = combineReducers<IState>({
    $state: stateReducer,
    $window: windowReducer,
    dot: dotReducer,
    graph: graphReducer,
    parseError: parseErrorReducer,
    source: testSafeSourceReducer,
    svg: svgReducer,
    zoomNodeId: zoomNodeIdReducer,
    zoomableNodes: zoomableNodesReducer,
})

export default rootReducer
