import { IProjectTaskUnitEstimationVm } from "./ProjectTaskUnitEstimationVm"

export interface IProjectTaskVm {
    id: string
    start: Date
    end: Date
    description: string
    estimations: IProjectTaskUnitEstimationVm[]
}

export class ProjectTaskVm implements IProjectTaskVm {
    id: string = ''
    start: Date = new Date()
    end: Date = new Date()
    description: string = ''
    estimations: IProjectTaskUnitEstimationVm[] = []
}
