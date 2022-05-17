import { ProjectTaskUnitEstimationVm } from "./ProjectTaskUnitEstimationVm"


export class ProjectTaskVm {
    id: string = ''
    start: Date = new Date()
    end: Date = new Date()
    description: string = ''
    comment: string = ''
    unitEstimations: ProjectTaskUnitEstimationVm[] = []

    // calculated
    startAsStr: string = ''
    endAsStr: string = ''
}
