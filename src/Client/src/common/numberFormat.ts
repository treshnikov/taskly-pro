export const formatNumber = (arg: number): string => {
    return arg.toLocaleString().replaceAll(",", " ")
}