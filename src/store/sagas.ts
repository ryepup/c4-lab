import { StateService } from '@uirouter/core'
import { SagaIterator } from 'redux-saga'
import { all, call, put, select, take, takeLatest, throttle } from 'redux-saga/effects'
import { Action } from 'typescript-fsa'
import { DataStore, parse, toDot, toSvg } from '../core'
import { NodeId } from '../core/interfaces'
import {
    angularInitialized, dotChanged, ISourceChanged, IZoomChanged, sourceChanged,
    sourceParsed, sourceParseError, svgChanged, zoomChanged,
} from './actions'

function* onSourceChanged(action: Action<ISourceChanged>): SagaIterator {
    try {
        const graph = parse(action.payload.source)
        yield put(sourceParsed({ graph }))
    } catch (error) {
        yield put(sourceParseError({ error: error.message }))
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
    const { zoomNodeId, graph, $state, $window, source } = yield select()

    new DataStore($window.localStorage).save(source)

    // TODO: resolve race condition where we call this method before $state.current exists
    // so we can drop this wait
    while (!($state.current && $state.current.name)) {
        yield call(wait)
    }
    const dot = toDot(graph, zoomNodeId, (x) => hrefTo($state, x))
    yield put(dotChanged({ dot }))
    const svg = toSvg(dot)
    yield put(svgChanged({ svg }))
}

function wait(ms = 50) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function* updateZoom(action: Action<IZoomChanged>): SagaIterator {
    const { $state } = yield select()
    const { zoomNodeId: zoom } = action.payload
    if (zoom === $state.params.zoom) { return }
    yield call(render)
    const name = $state.current.name
    if (name) {
        const params = Object.assign({}, $state.params, { zoom })
        $state.go(name, params, { notify: false })
    }
}

function* latestSource(): SagaIterator { yield takeLatest(sourceChanged, onSourceChanged) }
function* latestGraph(): SagaIterator { yield takeLatest(sourceParsed, render) }
function* latestZoom(): SagaIterator { yield throttle(100, zoomChanged, updateZoom) }

function* init(): SagaIterator {
    yield take(angularInitialized.type)
    const { $window } = yield select()
    if (!$window.localStorage) { return } // TODO: hack to make tests happy
    const storage = new DataStore($window.localStorage)
    const source = storage.load()
    if (source) { yield put(sourceChanged({ source })) }
}

export function* rootSaga(): SagaIterator {
    yield all([
        call(latestSource),
        call(latestGraph),
        call(latestZoom),
        call(init),
    ])
}
