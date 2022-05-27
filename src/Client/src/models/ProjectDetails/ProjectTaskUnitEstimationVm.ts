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
}
