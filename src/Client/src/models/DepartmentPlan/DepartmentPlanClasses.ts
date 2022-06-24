export type DepartmentPlanUserRecordVm = {
    userId: string
    rate: number
    userName: string
    userPosition: string
    projects: DepartmentPlanUserProjectVm[]
}

export type DepartmentPlanUserProjectVm = {
    projectId: number
    projectName: string
    projectShortName: string
    projectStart: number
    projectEnd: number
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
    hours: string | null
    [weekNumber: string]: string | null | number
}

