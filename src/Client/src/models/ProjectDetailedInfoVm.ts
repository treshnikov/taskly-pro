import { dateAsShortStr } from "../common/dateFormatter"
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

    // calculated fields
    totalHours: number = 0
    taskMaxDate: Date = new Date()
    taskMinDate: Date = new Date()

    public static init(arg: ProjectDetailedInfoVm) {
        //todo
        arg.start = new Date(arg.start)
        arg.end = new Date(arg.end)
        arg.totalHours = 0
        arg.taskMaxDate = new Date()
        arg.taskMinDate = new Date()

        const maxLineHeight = 150

        arg.tasks?.forEach(task => {
            task.totalHours = 0
            task.start = new Date(task.start)
            task.end = new Date(task.end)
            
            task.startAsStr = dateAsShortStr(task.start)
            task.endAsStr = dateAsShortStr(task.end)
            
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
                taskDepartmentEstimation.start = task.start
                taskDepartmentEstimation.end = task.end

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

