import { name } from './index'

describe('build-info', () => {
    let $ctrl;

    beforeEach(inject($componentController => {
        $ctrl = $componentController(name)
    }))

    it('pulls values from env', () => {
        expect($ctrl.version).toBeDefined()
        expect($ctrl.build).toBeDefined()
        expect($ctrl.hash).toBeDefined()
    })
})
