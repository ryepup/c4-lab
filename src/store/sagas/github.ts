import * as Octokit from '@octokit/rest'
import { SagaIterator } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { Action } from 'typescript-fsa'
import { GistExporter } from '../../core/exporter/gist'
import { gistExport, githubLoggedIn, githubLoginComplete, IGistExportRequest, IGithubLoggedIn } from '../actions'

/* OMG something is wrong with my typescript + webpack */
function createOctokit(): Octokit {
    try { return new Octokit() } catch (e) { /* next */ }
    try {
        const untyped = (Octokit as unknown)
        const factory = untyped as { default: () => Octokit }
        return factory.default()
    } catch (e) { /* next */ }
    throw new Error('I dunno, man')
}

const octokit = createOctokit()

function* onGithubLogin(action: Action<IGithubLoggedIn>): SagaIterator {
    octokit.authenticate({
        token: action.payload.token,
        type: 'oauth',
    })
    const user = yield call(() => octokit.users.get({}))
    yield put(githubLoginComplete({
        ...action.payload,
        avatarUrl: user.data.avatar_url,
        login: user.data.login,
    }))
}

function* exportToGist(action: Action<IGistExportRequest>): SagaIterator {
    const { origin, pathname } = window.location
    const url = new URL(`${origin}${pathname}${action.payload.href}`)
    const exporter = new GistExporter(octokit)
    const { source, graph: { title } } = yield select()
    const result = yield call(() => exporter.export(title, source, url))
    yield put(gistExport.done(result))
    // TODO: move this side-effect elsewhere
    window.open(result.url, '_blank')
}

function* handleLogin(): SagaIterator {
    yield takeLatest(githubLoggedIn, onGithubLogin)
}
function* handleExport(): SagaIterator {
    yield takeLatest(gistExport.started, exportToGist)
}

export default function* githubSaga(): SagaIterator {
    yield all([
        call(handleLogin),
        call(handleExport),
    ])
}
