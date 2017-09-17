import * as angular from 'angular'
import { INgReduxProvider } from 'ng-redux'
import 'ng-redux'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

export default angular.module('c4-lab.store', ['ngRedux'])
    .config(($ngReduxProvider: INgReduxProvider) => {
        const logMiddleware = createLogger()
        // TODO: figure out to turn down logging during tests; very
        // noisy console output from jest
        $ngReduxProvider.createStoreWith(rootReducer, [logMiddleware])
    })
    .name
