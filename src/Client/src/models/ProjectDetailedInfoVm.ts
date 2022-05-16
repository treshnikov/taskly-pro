import { ProjectTaskUnitEstimationVmHelper } from "./ProjectTaskUnitEstimationVm"
import { IProjectTaskVm, ProjectTaskVm } from "./ProjectTaskVm"

export interface IProjectWeekVm {
    monday: Date
}

export class ProjectWeekVm implements IProjectWeekVm {
    monday: Date = new Date()
}

export interface IProjectDetailedInfoVm {
    id: number
    name: string
    shortName: string
    company: string
    isOpened: boolean
    projectManager: string
    chiefEngineer: string
    start: Date
    end: Date 
    closeDate: Date | null
    customer: string
    contract: string
    tasks: IProjectTaskVm[]

    // calculated fields
    weeks: IProjectWeekVm[]
}


export class ProjectDetailedInfoVm implements IProjectDetailedInfoVm {
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
    weeks: ProjectWeekVm[] = []
}

export class ProjectDetailedInfoVmHelper {
    private static handleWeeks(arg: ProjectDetailedInfoVm, start: Date, end: Date) {
        arg.weeks = []
        let currentDate = new Date(start)

        // find first left monday
        while (currentDate.getDay() !== 1) {
            currentDate.setDate(currentDate.getDate() - 1)
        }

        while (currentDate < end) {
            const w = new ProjectWeekVm()
            w.monday = new Date(currentDate)
            arg.weeks.push(w)
            currentDate.setDate(currentDate.getDate() + 7)
        }
    }
    public static init(arg: IProjectDetailedInfoVm) {
        //todo
        arg.start = new Date(arg.start)
        arg.end = new Date(arg.end)
        let taskMaxDate = new Date()
        let taskMinDate = new Date()

        let sumEstimation = 0
        const maxLineHeight = 60

        arg.tasks?.forEach(task => {
            task.start = new Date(task.start)
            task.end = new Date(task.end)

            // calculate total project estimation
            task.estimations?.forEach(e => {
                sumEstimation += ProjectTaskUnitEstimationVmHelper.getTotalHours(e)
            })

            if (task.start <= taskMinDate) {
                taskMinDate = task.start
            }

            if (task.end > taskMaxDate) {
                taskMaxDate = task.end
            }
        })

        this.handleWeeks(arg, taskMinDate, taskMaxDate)

        arg.tasks?.forEach(task => {
            task.estimations?.forEach(taskDepartmentEstimation => {
                // copy start and end dates to each task ProjectTaskUnitEstimationVm instance to handle render easier
                taskDepartmentEstimation.start = task.start
                taskDepartmentEstimation.end = task.end

                // get summ of all estimation for the current department
                taskDepartmentEstimation.totalHours = ProjectTaskUnitEstimationVmHelper.getTotalHours(taskDepartmentEstimation)

                // calculate the height of the each ProjectTaskUnitEstimationVm depending on total estimation
                taskDepartmentEstimation.lineHeight = Math.max(3, Math.trunc(maxLineHeight * (taskDepartmentEstimation.totalHours / sumEstimation)))

                // prepare color for gant chart
                taskDepartmentEstimation.color = ProjectTaskUnitEstimationVmHelper.getColor(taskDepartmentEstimation)

            })
        })
    }

}

