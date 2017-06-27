import * as editor from './editor.component'

describe('editor.component.js', () => {
    let $ctrl, ngModel;

    beforeEach(inject($componentController => {
        ngModel = {
            '$setViewValue': jest.fn()
        };
        $ctrl = $componentController(editor.name, {}, { ngModel })
    }))

    describe('syntaxIsValid', () => {
        it('is true for valid syntax', () => {
            $ctrl.parse('(system ("foo"))')

            expect($ctrl.syntaxIsValid).toBeTruthy()
        })
        it('is false for invalid syntax', () => {
            $ctrl.parse('(system ("foo")')

            expect($ctrl.syntaxIsValid).toBeFalsy()
        })
    })

    describe('lastError', () => {
        it('is undefined for valid syntax', () => {
            $ctrl.parse('(system ("foo"))')

            expect($ctrl.lastError).toBeUndefined()
        })

        it('is defined for invalid syntax', () => {
            $ctrl.parse('(system')

            expect($ctrl.lastError).toBeDefined()
        })

        it('is undefined after fixing syntax', () => {
            $ctrl.parse('(system')

            $ctrl.parse('(system ("foo"))')

            expect($ctrl.lastError).toBeUndefined()
        })
    })
})