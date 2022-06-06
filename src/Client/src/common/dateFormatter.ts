export const dateAsShortStr = (arg: Date): string => {
    return arg.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) +
        "." + (arg.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) +
        "." + arg.getFullYear()
}

export const dateAsShortStrWithShortYear = (arg: Date): string => {
    return arg.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) +
        "." + (arg.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) +
        "." + (arg.getFullYear() - 2000)
}

export const dateAsShortStrFromNumber = (arg: number): string => {
    return dateAsShortStr(new Date(arg))
}

//** Receives dd.MM.yyyy string and returns Date */
export const strToDate = (arg: string): Date => {
    var parts = arg.split('.');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
}