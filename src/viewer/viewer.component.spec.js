import { name } from './viewer.component'
import { parse } from '../core/parse'

describe('viewer.controller', () => {
    let $ctrl, ngModel

    beforeEach(inject($componentController => {
        ngModel = {
            '$setViewValue': jest.fn()
        };
        $ctrl = $componentController(name, {}, { ngModel })
        $ctrl.toSvg = jest.fn()
    }))

    describe('$onChanges()', () => {
        it('recalculates when the graph changes', () => {
            const graph = parse('(system ("foo"))')
            $ctrl.graph = graph
            $ctrl.$onChanges({ graph })

            expect($ctrl.expandableNodes).toEqual([])
            expect($ctrl.toSvg.mock.calls.length).toBe(1)
        })
    })
})
