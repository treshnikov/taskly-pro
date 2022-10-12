export type WeekPlanReportVm = {
    departments: WeekPlanDepartmentVm[]
}

export type WeekPlanDepartmentVm = {
    name: string
    users: WeekPlanUserVm[]
}

export type WeekPlanUserVm = {
    name: string
    rate: number
    plans: WeekPlanVm[]
}

export type WeekPlanVm = {
    projectId: number
    projectName: string
    taskName: string
    hours: number
    taskStart: number
    taskEnd: number
    taskIsOutdated: boolean
}