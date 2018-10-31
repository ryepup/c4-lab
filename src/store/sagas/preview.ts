import { SagaIterator } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { Action } from 'typescript-fsa'
import { DataStore, uriDecode } from '../../core/'
import { IPreview, preview, previewEdit, sourceChanged } from '../actions'

function* onPreviewEdit(action: Action<undefined>): SagaIterator {
    const { source, $state } = yield select()
    new DataStore(window.localStorage).save(source)
    yield put(sourceChanged({ source }))
    $state.go('home')
}

function* onPreview(action: Action<IPreview>): SagaIterator {
    const source = uriDecode(action.payload.encodedSource)
    yield put(sourceChanged({ source }))
}

function* latestPreview(): SagaIterator { yield takeLatest(preview, onPreview) }
function* latestPreviewEdit(): SagaIterator { yield takeLatest(previewEdit, onPreviewEdit) }

export default function* previewSaga(): SagaIterator {
    yield all([
        call(latestPreview),
        call(latestPreviewEdit),
    ])
}
