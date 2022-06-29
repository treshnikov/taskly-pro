export type DepartmentStatisticsVm = {
    projects: ProjectStatisticsVm[]
    weeks: WeekStatistics[]
}

export type WeekStatistics = {
    weekStart: number
    projectPlannedHours: number
    departmentPlannedHours: number
    projectPlanDetails: ProjectPlanDetailVm[]
}

export type ProjectPlanDetailVm = {
    hours: number
    projectName: string
}

export type ProjectStatisticsVm = {
    id: number
    name: string
    plannedTaskHoursForDepartment: number
    plannedTaskHoursByDepartment: number
    deltaHours: number
}