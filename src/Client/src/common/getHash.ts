export function getHash(arg: string): number {
    if (!arg){
        return 0
    }

    var hash = 0, i, chr;
    if (arg.length === 0) return hash;
    for (i = 0; i < arg.length; i++) {
        chr = arg.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0
    }
    return hash;
}
