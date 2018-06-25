import { StateService } from '@uirouter/core'
import { SagaIterator } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { Action } from 'typescript-fsa'
import { parse, ParseError, SyntaxError, toDot, toSvg } from '../core'
import { NodeId } from '../core/interfaces'
import {
    dotChanged, IEditorParseEvent, ISourceChanged,
    sourceChanged, sourceParsed, sourceParseError,
    svgChanged,
} from './actions'
import { IState } from './state'

function* onSourceChanged(action: Action<ISourceChanged>): SagaIterator {
    try {
        const graph = parse(action.payload.source)
        yield put(sourceParsed({ graph }))
    } catch (error) {
        if (error instanceof ParseError) {
            yield put(sourceParseError({ error: error.message }))
        } else if (error instanceof SyntaxError) {
            yield put(sourceParseError({ error: error.message }))
        }
    }
}

function hrefTo($state: StateService, zoom: NodeId) {
    const name = $state.current.name
    if (name === undefined) { return '' }
    const params = Object.assign({}, $state.params, { zoom })
    return $state.href(name, params)
}

function* render(): SagaIterator {
    // TODO: make this type safe, need to mess with NodeId being nullable
    const { zoomNodeId, graph, $state } = yield select()
    const dot = toDot(graph, zoomNodeId, (x) => hrefTo($state, x))
    yield put(dotChanged({ dot }))
    const svg = toSvg(dot)
    yield put(svgChanged({ svg }))
    // TODO: save source to storage
}

function* latestSource(): SagaIterator { yield takeLatest(sourceChanged, onSourceChanged) }
function* latestGraph(): SagaIterator { yield takeLatest(sourceParsed, render) }

export function* rootSaga(): SagaIterator {
    yield all([
        call(latestSource), call(latestGraph),
    ])
}
