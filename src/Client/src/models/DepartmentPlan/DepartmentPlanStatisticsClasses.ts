export type DepartmentStatisticsVm = {
    projects: ProjectStatisticsVm[]
    weeks: WeekStatistics[]
    summary: DepartmentStatisticsSummary
}

export type DepartmentStatisticsSummary = {
    start: number
    end: number
    availableHoursForPlanning: number
    hoursPlannedForDepartment: number
    sumOfVacationHours: number
    hoursPlannedByHeadOfDepartment: number
    workLoadPercentage: number
    externalProjectsRateInPercentage: number
}

export type WeekStatistics = {
    weekStart: number
    projectPlannedHours: number
    departmentPlannedHours: number
    departmentAvailableHours: number
    projectPlanDetails: ProjectPlanDetailVm[]
    departmentPlanDetails: ProjectPlanDetailVm[]
}

export type ProjectPlanDetailVm = {
    hours: number
    projectName: string
}

export type ProjectStatisticsVm = {
    id: number
    name: string
    projectType: number
    plannedTaskHoursForDepartment: number
    plannedTaskHoursByDepartment: number
    deltaHours: number
}