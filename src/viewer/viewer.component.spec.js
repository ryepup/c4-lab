import { name } from './viewer.component'
import { parse } from '../core/parse'

describe('viewer.controller', () => {
    let $ctrl, ngModel, $state

    beforeEach(inject($componentController => {
        ngModel = {
            '$setViewValue': jest.fn()
        };
        $state = {
            go: jest.fn()
        }

        $ctrl = $componentController(name, { $state }, { ngModel })
        $ctrl.toSvg = jest.fn()
    }))

    describe('onZoom()', () => {
        it('changes the zoom route parameter', () => {
            const zoomId = 'new node id'
            $ctrl.zoom = zoomId
            const stateName = 'testing'
            $state.current = { name: stateName }

            $ctrl.onZoom()

            expect($state.go).toBeCalledWith(stateName, { zoom: zoomId })
        })
    })
})
