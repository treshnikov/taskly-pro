import { dateAsShortStr } from "../../common/dateFormatter"
import { IProjectTaskDepartmentEstimationVm } from "./ProjectTaskDepartmentEstimationVm"

export interface IProjectTaskVm {
    id: string
    start: number
    end: number
    description: string
    comment: string
    departmentEstimations: IProjectTaskDepartmentEstimationVm[]

    // calculated
    startAsStr: string
    endAsStr: string
    totalHours: number
}

export class ProjectTaskVm implements IProjectTaskVm {
    id: string = ''
    start: number = 0
    end: number = 0
    description: string = ''
    comment: string = ''
    departmentEstimations: IProjectTaskDepartmentEstimationVm[] = []

    // calculated
    startAsStr: string = ''
    endAsStr: string = ''
    totalHours: number = 0
}

export class ProjectTaskVmHelper {
    public static init(arg: IProjectTaskVm) {
        arg.totalHours = 0
        arg.startAsStr = dateAsShortStr(new Date(arg.start))
        arg.endAsStr = dateAsShortStr(new Date(arg.end))

    }

    public static recalcTotalHours(arg: IProjectTaskVm) {
        let totalHours = 0
        arg.departmentEstimations.forEach(u => {
            let depHours = 0
            u.estimations.forEach(e => {
                depHours += e.hours
            })
            u.totalHours = depHours
            totalHours += depHours
        })

        arg.totalHours = totalHours
    }
}
