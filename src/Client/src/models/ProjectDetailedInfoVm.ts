import { ProjectTaskUnitEstimationVm } from "./ProjectTaskUnitEstimationVm"
import { ProjectTaskVm } from "./ProjectTaskVm"


export class ProjectDetailedInfoVm {
    id: number = 0
    name: string = ''
    shortName: string = ''
    company: string = ''
    isOpened: boolean = false
    projectManager: string = ''
    chiefEngineer: string = ''
    start: Date = new Date()
    end: Date = new Date()
    closeDate: Date | null = new Date()
    customer: string = ''
    contract: string = ''
    tasks: ProjectTaskVm[] = []

    taskMinDate: Date = new Date()
    taskMaxDate: Date = new Date()

    static init(arg: ProjectDetailedInfoVm) {
        //todo
        arg.start = new Date(arg.start)
        arg.end = new Date(arg.end)
        arg.taskMaxDate = new Date()
        arg.taskMinDate = new Date()

        let sumEstimation = 0
        const maxLineHeight = 60

        arg.tasks?.forEach(task => {
            task.start = new Date(task.start)
            task.end = new Date(task.end)

            // calculate total project estimation
            task.estimations?.forEach(e => {
                sumEstimation += ProjectTaskUnitEstimationVm.getTotalHours(e)
            })


            if (task.start <= arg.taskMinDate) {
                arg.taskMinDate = task.start
            }

            if (task.end > arg.taskMaxDate) {
                arg.taskMaxDate = task.end
            }
        })

        arg.tasks?.forEach(task => {
            task.estimations?.forEach(taskDepartmentEstimation => {
                // copy start and end dates to each task ProjectTaskUnitEstimationVm instance to handle render easier
                taskDepartmentEstimation.start = task.start
                taskDepartmentEstimation.end = task.end

                // get summ of all estimation for the current department
                taskDepartmentEstimation.totalHours = ProjectTaskUnitEstimationVm.getTotalHours(taskDepartmentEstimation)

                // calculate the height of the each ProjectTaskUnitEstimationVm depending on total estimation
                taskDepartmentEstimation.lineHeight = Math.max(3, Math.trunc(maxLineHeight * (taskDepartmentEstimation.totalHours / sumEstimation)))

                // prepare color for gant chart
                taskDepartmentEstimation.color = ProjectTaskUnitEstimationVm.getColor(taskDepartmentEstimation)

            })
        })
    }
}
