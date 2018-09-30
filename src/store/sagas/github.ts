import * as Octokit from '@octokit/rest'
import { SagaIterator } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import { Action } from 'typescript-fsa'
import { githubLoggedIn, githubLoginComplete, IGithubLoggedIn } from '../actions'

/* OMG something is wrong with my typescript */
const untyped = (Octokit as unknown)
const factory = untyped as { default: () => Octokit }
const octokit = factory.default()

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

export default function* handleLogin(): SagaIterator { yield takeLatest(githubLoggedIn, onGithubLogin) }
