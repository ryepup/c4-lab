import { SagaIterator } from 'redux-saga'
import { put, select, takeLatest } from 'redux-saga/effects'
import { Action } from 'typescript-fsa'
import { Exporter, uriEncode } from '../../core'
import { exported, gistExport, IExportRequest } from '../actions'

function* onExport(action: Action<IExportRequest>): SagaIterator {
    const { $state, source, graph: { title }, zoomNodeId, dot } = yield select()
    const { payload: { format } } = action

    if (format === 'gist') {
        const href = $state.href('load',
            {
                data: uriEncode(source),
                zoom: zoomNodeId,
            })
        yield put(gistExport.started({ href }))
    } else {
        const exporter = new Exporter(window.document)
        exporter.export(format, title, source, dot)
    }
}

export default function* exportSaga(): SagaIterator {
    yield takeLatest(exported, onExport)
}
