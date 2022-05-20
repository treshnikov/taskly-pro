import { dateAsShortStr } from "../../common/dateFormatter"
import { IProjectTaskUnitEstimationVm } from "./ProjectTaskUnitEstimationVm"

export interface IProjectTaskVm{
    id: string
    start: number
    end: number
    description: string
    comment: string
    unitEstimations: IProjectTaskUnitEstimationVm[]

    // calculated
    startAsStr: string
    endAsStr: string 
    totalHours: number
}

export class ProjectTaskVm implements IProjectTaskVm{
    id: string = ''
    start: number = 0
    end: number = 0
    description: string = ''
    comment: string = ''
    unitEstimations: IProjectTaskUnitEstimationVm[] = []

    // calculated
    startAsStr: string = ''
    endAsStr: string = ''
    totalHours: number = 0

    public static init(arg: IProjectTaskVm) {
        arg.totalHours = 0
        arg.startAsStr = dateAsShortStr(new Date(arg.start))
        arg.endAsStr = dateAsShortStr(new Date(arg.end))

    }
}
