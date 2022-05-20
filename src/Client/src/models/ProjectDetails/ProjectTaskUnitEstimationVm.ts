import { IEstimationVm } from "./EstimationVm"
import { IProjectTaskVm } from "./ProjectTaskVm"

export interface IProjectTaskUnitEstimationVm{
    id: string
    unitId: string
    unitName: string
    estimations: IEstimationVm[]

    // these fields are supposed to be calculated on the client after get fetched
    lineHeight: number
    totalHours: number
    color: string
    start: number
    end: number
}

export class ProjectTaskUnitEstimationVm implements IProjectTaskUnitEstimationVm {
    id: string = ''
    unitId: string = ''
    unitName: string = ''
    estimations: IEstimationVm[] = []

    // these fields are supposed to be calculated on the client after get fetched
    lineHeight: number = 5
    totalHours: number = 0
    color: string = ''
    start: number = 0
    end: number = 0

    public static init(arg: IProjectTaskUnitEstimationVm, task: IProjectTaskVm){
        arg.start = task.start
        arg.end = task.end
    }

    public static getTotalHours(arg: ProjectTaskUnitEstimationVm) {
        return arg.estimations?.map(i => i.hours).reduce((acc, i) => acc += i, 0);
    }

    private static getHash(arg: ProjectTaskUnitEstimationVm) {
        var hash = 0, i, chr;
        if (arg.unitName.length === 0) return hash;
        for (i = 0; i < arg.unitName.length; i++) {
            chr = arg.unitName.charCodeAt(i)
            hash = ((hash << 5) - hash) + chr
            hash |= 0
        }
        return hash;
    }

    public static getColor(arg: ProjectTaskUnitEstimationVm) {
        //const colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"];
        const colors = ["#34568B", "#FF6F61", "#6B5B95",
            //"#F7CAC9", 
            "#92A8D1",
            //"#98B4D4", 
            "#C3447A", "#7FCDCD", "#E15D44",
            //"#55B4B0", 
            "#DFCFBE", "#9B2335", "#5B5EA6", "#88B04B", "#EFC050", "#45B8AC",
            //"#D65076", 
            "#DD4124", "#009B77", "#B565A7",
            "#955251", "#DAF7A6", "#FFC300", "#FF5733",
            //"#900C3F", "#581845"
        ]
        const idx = Math.abs(ProjectTaskUnitEstimationVm.getHash(arg) % colors.length - 1)
        return colors[idx]
    }
}
