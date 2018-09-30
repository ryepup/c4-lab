import * as angular from 'angular'
import { StateService } from 'angular-ui-router'
import { INgRedux, INgReduxProvider, Middleware } from 'ng-redux'
import 'ng-redux'
import { Action, applyMiddleware, Dispatch, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import { rootSaga } from './sagas'
import { IState } from './state'

const timingMiddleware: any = (store: Store<IState>) => (next: Dispatch<IState>) => (action: Action) => {
    // tslint:disable:no-console
    const label = `Processing ${action.type}`
    console.time(label)
    console.group(label)
    try {
        return next(action)
    } finally {
        console.timeEnd(label)
        console.groupEnd()
    }
    // tslint:enable:no-console
}

// tslint:disable-next-line:ban-types
const enhancers: Function[] = []
const reduxDevtool = (window as any).__REDUX_DEVTOOLS_EXTENSION__
if (reduxDevtool) { enhancers.push(reduxDevtool()) }
const sagas = createSagaMiddleware()

export default angular.module('c4-lab.store', ['ngRedux'])
    .config(($ngReduxProvider: INgReduxProvider) => {
        $ngReduxProvider.createStoreWith(rootReducer, [timingMiddleware, sagas], enhancers)
    })
    .run(($ngRedux: INgRedux) => {
        sagas.run(rootSaga)
    })
    .name
