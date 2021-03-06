import { getColor } from "../../common/getColor"
import { ProjectTaskDepartmentEstimationVmHelper } from "./ProjectTaskDepartmentEstimationVm"
import { IProjectTaskVm, ProjectTaskVmHelper } from "./ProjectTaskVm"

export interface IProjectDetailedInfoVm{
    id: number
    name: string
    shortName: string
    company: string
    isOpened: boolean
    isExternal: boolean
    projectManager: string
    chiefEngineer: string
    start: number
    end: number
    closeDate: number | null
    customer: string
    contract: string
    tasks: IProjectTaskVm[]

    // calculated fields
    totalHours: number
    taskMaxDate: number
    taskMinDate: number
} 

export class ProjectDetailedInfoVm implements IProjectDetailedInfoVm {
    id: number = 0
    name: string = ''
    shortName: string = ''
    company: string = ''
    isOpened: boolean = false
    isExternal: boolean = false
    projectManager: string = ''
    chiefEngineer: string = ''
    start: number = 0
    end: number = 0
    closeDate: number | null = 0
    customer: string = ''
    contract: string = ''
    tasks: IProjectTaskVm[] = []

    // calculated fields
    totalHours: number = 0
    taskMaxDate: number = 0
    taskMinDate: number = 0
}

export class ProjectDetailedInfoVmHelper{
    public static init(arg: IProjectDetailedInfoVm) {
        arg.totalHours = 0
        arg.taskMaxDate = 0
        arg.taskMinDate = Number.MAX_SAFE_INTEGER

        const maxLineHeight = 150

        arg.tasks?.forEach(task => {
            ProjectTaskVmHelper.init(task) 

            // calculate total project estimation
            task.departmentEstimations?.forEach(e => {
                const depEstimation = ProjectTaskDepartmentEstimationVmHelper.getTotalHours(e)
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
            task.departmentEstimations?.forEach(taskDepartmentEstimation => {
                // copy start and end dates to each task ProjectTaskDepartmentEstimationVm instance to handle render easier
                ProjectTaskDepartmentEstimationVmHelper.init(taskDepartmentEstimation, task)

                // get summ of all estimation for the current department
                taskDepartmentEstimation.totalHours = ProjectTaskDepartmentEstimationVmHelper.getTotalHours(taskDepartmentEstimation)

                // calculate the height of the each ProjectTaskDepartmentEstimationVm depending on total estimation
                taskDepartmentEstimation.lineHeight = Math.max(
                        3, 
                        Math.trunc(maxLineHeight * (taskDepartmentEstimation.totalHours / arg.totalHours)))

                // prepare color for gant chart
                taskDepartmentEstimation.color = getColor(taskDepartmentEstimation.departmentName)

            })
        })
    }
}

