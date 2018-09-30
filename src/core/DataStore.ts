const LOCALSTORAGE_KEY = 'C4-LAB-ACTIVE-DOC-VNEXT'

export class DataStore {

    constructor(private localStorage: Storage) { }

    public load() {
        return this.localStorage.getItem(LOCALSTORAGE_KEY)
    }

    public save(text: string) {
        this.localStorage.setItem(LOCALSTORAGE_KEY, text)
    }
}
