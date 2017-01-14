import * as editor from './editor.component'

describe('editor.component.js', () => {
    let $ctrl, ngModel;

    beforeEach(inject(function ($componentController) {
        ngModel = jasmine.createSpyObj('ngModel', ['$setViewValue'])
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