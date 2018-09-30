import * as editor from './editor.component'
import LocalStorageMock from '../../__mocks__/LocalStorage'

describe('editor.component.js', () => {
    let $ctrl, ngModel;

    beforeEach(inject(($componentController, $window) => {
        $window.localStorage = new LocalStorageMock();
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
})