describe('help', () => {
    let $ctrl;

    beforeEach(inject($componentController => {
        $ctrl = $componentController('c4LabHelp')
    }))

    it('sets the help contents', () => {
        expect($ctrl.content).toBeDefined()
    })
})
