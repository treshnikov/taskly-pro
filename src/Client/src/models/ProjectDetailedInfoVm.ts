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
    start: number = 0
    end: number = 0
    closeDate: Date | null = new Date()
    customer: string = ''
    contract: string = ''
    tasks: ProjectTaskVm[] = []

    // calculated fields
    totalHours: number = 0
    taskMaxDate: number = 0
    taskMinDate: number = 0

    public static init(arg: ProjectDetailedInfoVm) {
        arg.totalHours = 0
        arg.taskMaxDate = 0
        arg.taskMinDate = Number.MAX_SAFE_INTEGER

        const maxLineHeight = 150

        arg.tasks?.forEach(task => {
            ProjectTaskVm.init(task) 

            // calculate total project estimation
            task.unitEstimations?.forEach(e => {
                const depEstimation = ProjectTaskUnitEstimationVm.getTotalHours(e)
                task.totalHours += depEstimation
                arg.totalHours += depEstimation
            })

            if (task.start <= arg.taskMinDate) {
                arg.taskMinDate = task.start
            }

            if (task.end > arg.taskMaxDate) {
                arg.taskMaxDate = task.end
            }
        })

        arg.tasks?.forEach(task => {
            task.unitEstimations?.forEach(taskDepartmentEstimation => {
                // copy start and end dates to each task ProjectTaskUnitEstimationVm instance to handle render easier
                ProjectTaskUnitEstimationVm.init(taskDepartmentEstimation, task)

                // get summ of all estimation for the current department
                taskDepartmentEstimation.totalHours = ProjectTaskUnitEstimationVm.getTotalHours(taskDepartmentEstimation)

                // calculate the height of the each ProjectTaskUnitEstimationVm depending on total estimation
                taskDepartmentEstimation.lineHeight = Math.max(
                        3, 
                        Math.trunc(maxLineHeight * (taskDepartmentEstimation.totalHours / arg.totalHours)))

                // prepare color for gant chart
                taskDepartmentEstimation.color = ProjectTaskUnitEstimationVm.getColor(taskDepartmentEstimation)

            })
        })
    }
}

