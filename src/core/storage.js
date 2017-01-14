
const LOCALSTORAGE_KEY = 'C4-LAB-ACTIVE-DOC-VNEXT'

export class Storage{
    constructor(localStorage){
        this.load = () => localStorage.getItem(LOCALSTORAGE_KEY)
        this.save = text => localStorage.setItem(LOCALSTORAGE_KEY, text)
    }
}