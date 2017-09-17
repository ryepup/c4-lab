import { Action, combineReducers } from 'redux'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { IGraph, INode, NodeId } from '../../core/interfaces'
import { sourceChanged, sourceLoaded, sourceParsed } from '../actions'
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
    .case(sourceLoaded, (old, evt) => evt.source)
    .case(sourceChanged, (old, evt) => evt.source)
    .build()

// TODO: not need this; there's gotta be some config to teach jest's
// typescript preprocessor to respect the additional types
const testSafeSourceReducer = (src: string, evt: any) =>
    sourceReducer(src, evt) || 'jest needs a string here, it ignores .sexp config'

const parseErrorReducer = reducerWithInitialState<string | null>(null)
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
    .case(sourceLoaded, (old, evt) => evt.zoomNodeId || null)
    .build()

const rootReducer = combineReducers<IState>({
    graph: graphReducer,
    parseError: parseErrorReducer,
    source: testSafeSourceReducer,
    zoomNodeId: zoomNodeIdReducer,
    zoomableNodes: zoomableNodesReducer,
})

export default rootReducer
