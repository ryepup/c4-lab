export default class LocalStorageMock implements Storage {
    [index: number]: string;
    [key: string]: any;
    public length: number
    public clear(): void {
        throw new Error('Method not implemented.')
    }
    public getItem(key: string): string | null {
        return this[key]
    }
    public key(index: number): string | null {
        throw new Error('Method not implemented.')
    }
    public removeItem(key: string): void {
        throw new Error('Method not implemented.')
    }
    public setItem(key: string, data: string): void {
        this[key] = data
    }
}
