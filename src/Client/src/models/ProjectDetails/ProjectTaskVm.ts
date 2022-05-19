import { dateAsShortStr } from "../../common/dateFormatter"
import { ProjectTaskUnitEstimationVm } from "./ProjectTaskUnitEstimationVm"

export class ProjectTaskVm {
    id: string = ''
    start: number = 0
    end: number = 0
    description: string = ''
    comment: string = ''
    unitEstimations: ProjectTaskUnitEstimationVm[] = []

    // calculated
    startAsStr: string = ''
    endAsStr: string = ''
    totalHours: number = 0

    public static init(arg: ProjectTaskVm) {
        arg.totalHours = 0
        arg.startAsStr = dateAsShortStr(new Date(arg.start))
        arg.endAsStr = dateAsShortStr(new Date(arg.end))

    }
}
