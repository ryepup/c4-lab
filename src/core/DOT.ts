export class DOT {
    public static i(text: string) { return `<i>${text}</i>` }
    public static b(text: string) { return `<b>${text}</b>` }
    public static u(text: string) { return `<u>${text}</u>` }
    public static font(color: string, text: string) { return `<font color="${color}">${text}</font>` }
    public static attrList(attrs: any) {
        const dotAttrs = Reflect.ownKeys(attrs)
            .filter((x) => attrs[x])
            .map((x) => `${String(x)}=${DOT.quoteAttr(attrs[x])}`)
            .join(' ')

        return `[${dotAttrs}]`
    }
    public static quoteAttr(value: string) {
        return /^</.test(value) ? value : `"${value}"`
    }
}
