export type DepartmentPlanUserRecordVm = {
    userId: string
    rate: number
    userName: string
    userPosition: string
    projects: DepartmentPlanUserProjectVm[]
}

export type TaskTimeVm = {
    name: string
    start: number
    end: number
}

export type DepartmentPlanUserProjectVm = {
    projectId: number
    projectName: string
    projectShortName: string
    projectStart: number
    projectEnd: number
    taskTimes: TaskTimeVm[]
    plans: DepartmentPlanUserProjectWeekPlanVm[]
}

export type DepartmentPlanUserProjectWeekPlanVm = {
    weekNumber: number
    weekStart: number
    plannedHours: number
}

export type DepartmentUserPlan = {
    id: string
    userName: string
    userPosition: string
    rate: number
    tooltip: string
    project: string
    hours: string | null
    __children: DepartmentProjectPlan[]
    [weekNumber: string]: string | number | DepartmentProjectPlan[] | null
}

export type DepartmentProjectPlan = {
    id: string
    userPosition: string
    project: string
    userId: string
    projectId: number
    tooltip: string
    hours: string | null
    [weekNumber: string]: string | null | number
}

