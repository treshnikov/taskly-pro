import { IEstimationVm } from "./EstimationVm"
import { IProjectTaskVm } from "./ProjectTaskVm"

export interface IProjectTaskDepartmentEstimationVm {
    id: string
    departmentId: string
    departmentName: string
    departmentShortName: string
    estimations: IEstimationVm[]

    // these fields are supposed to be calculated on the client after get fetched
    lineHeight: number
    totalHours: number
    color: string
    start: number
    end: number
}

export class ProjectTaskDepartmentEstimationVm implements IProjectTaskDepartmentEstimationVm {
    id: string = ''
    departmentId: string = ''
    departmentName: string = ''
    departmentShortName: string = ''
    estimations: IEstimationVm[] = []

    // these fields are supposed to be calculated on the client after get fetched
    lineHeight: number = 5
    totalHours: number = 0
    color: string = ''
    start: number = 0
    end: number = 0
}

export class ProjectTaskDepartmentEstimationVmHelper {
    public static init(arg: IProjectTaskDepartmentEstimationVm, task: IProjectTaskVm) {
        arg.start = task.start
        arg.end = task.end
    }

    public static getTotalHours(arg: ProjectTaskDepartmentEstimationVm) {
        return arg.estimations?.map(i => i.hours).reduce((acc, i) => acc += i, 0);
    }
}
