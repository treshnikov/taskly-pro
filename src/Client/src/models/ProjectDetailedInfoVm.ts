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

    public static init(arg: ProjectDetailedInfoVm) {
        //todo
        arg.start = new Date(arg.start)
        arg.end = new Date(arg.end)
        arg.totalHours = 0
        let taskMaxDate = new Date()
        let taskMinDate = new Date()

        const maxLineHeight = 150

        arg.tasks?.forEach(task => {
            task.totalHours = 0
            task.start = new Date(task.start)
            task.end = new Date(task.end)
            
            task.startAsStr = task.start.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + (task.start.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + task.start.getFullYear()
            task.endAsStr = task.end.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + (task.end.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + task.end.getFullYear()
            
            // calculate total project estimation
            task.unitEstimations?.forEach(e => {
                const depEstimation = ProjectTaskUnitEstimationVm.getTotalHours(e)
                task.totalHours += depEstimation
                arg.totalHours += depEstimation

            })

            if (task.start <= taskMinDate) {
                taskMinDate = task.start
            }

            if (task.end > taskMaxDate) {
                taskMaxDate = task.end
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

