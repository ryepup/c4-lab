import LocalStorage from '../../__mocks__/LocalStorage'
import { DataStore } from './DataStore'

describe('DataStore', () => {
    let dataStore: DataStore
    let storage: Storage

    beforeEach(() => {
        storage = new LocalStorage()
        dataStore = new DataStore(storage)
    })

    it('saves and loads', () => {
        const expected = 'test test test'

        dataStore.save(expected)
        expect(dataStore.load()).toBe(expected)
    })
})