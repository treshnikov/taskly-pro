export type WeekSummaryReportVm = {
    departments: WeekSummaryDepartmentVm[]
}

export type WeekSummaryDepartmentVm = {
    name: string
    users: WeekSummaryUserVm[]
}

export type WeekSummaryUserVm = {
    name: string
    rate: number
    plans: WeekSummaryPlanVm[]
}

export type WeekSummaryPlanVm = {
    taskName: string
    hours: number
    taskStart: number
    taskEnd: number
    taskIsOutdated: boolean
}