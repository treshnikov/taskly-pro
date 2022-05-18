export const dateAsShortStr = (arg: Date): string => {
    return arg.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + 
        "." + (arg.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + 
        "." + arg.getFullYear()
}