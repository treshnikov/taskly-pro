import { IEstimationVm } from "./EstimationVm"
import { IProjectTaskVm } from "./ProjectTaskVm"

export interface IProjectTaskUnitEstimationVm {
    id: string
    unitId: string
    unitName: string
    unitShortName: string
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
    unitShortName: string = ''
    estimations: IEstimationVm[] = []

    // these fields are supposed to be calculated on the client after get fetched
    lineHeight: number = 5
    totalHours: number = 0
    color: string = ''
    start: number = 0
    end: number = 0
}

export class ProjectTaskUnitEstimationVmHelper {
    public static init(arg: IProjectTaskUnitEstimationVm, task: IProjectTaskVm) {
        arg.start = task.start
        arg.end = task.end
    }

    public static getTotalHours(arg: ProjectTaskUnitEstimationVm) {
        return arg.estimations?.map(i => i.hours).reduce((acc, i) => acc += i, 0);
    }

    private static getHash(arg: string): number {
        var hash = 0, i, chr;
        if (arg.length === 0) return hash;
        for (i = 0; i < arg.length; i++) {
            chr = arg.charCodeAt(i)
            hash = ((hash << 5) - hash) + chr
            hash |= 0
        }
        return hash;
    }

    public static getColor(unitName: string) {
        const colors = ["#34568B", "#FF6F61", "#6B5B95", "#92A8D1",
            "#C3447A", "#7FCDCD", "#E15D44", "#DFCFBE", "#9B2335", "#5B5EA6", "#88B04B", "#EFC050", "#45B8AC",
            "#DD4124", "#009B77", "#B565A7", "#955251", "#DAF7A6", "#FFC300", "#FF5733",
        ]
        const idx = Math.min(Math.abs(ProjectTaskUnitEstimationVmHelper.getHash(unitName) % colors.length - 1), colors.length - 1)
        return colors[idx]
    }
}
