import { getHash } from "./getHash"

export function getColor(arg: string): string {
    const colors = ["#34568B", "#FF6F61", "#6B5B95", "#92A8D1",
        "#C3447A", "#7FCDCD", "#E15D44", "#DFCFBE", "#9B2335", "#5B5EA6", "#88B04B", "#EFC050", "#45B8AC",
        "#DD4124", "#009B77", "#B565A7", "#955251", "#DAF7A6", "#FFC300", "#FF5733"]

    const idx = Math.min(Math.abs(getHash(arg) % colors.length - 1), colors.length - 1)
    return colors[idx]
}