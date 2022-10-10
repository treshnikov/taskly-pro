export type DepartmentPlanUserRecordVm = {
    userId: string
    userName: string
    userPosition: string
    rate: number
    quitDate: number
    hiringDate: number
    tasks: TaskPlanVm[]
    weeks: WeekInfoVm[]
}

export type WeekInfoVm = {
    monday: number
    hoursAvailableForPlanning: number
}

export type TaskPlanVm = {
    projectId: number
    projectTaskId: string
    projectName: string
    projectShortName: string
    taskName: string
    taskStart: number
    taskEnd: number
    plans: DepartmentPlanUserProjectWeekPlanVm[]
}

export type DepartmentPlanUserProjectWeekPlanVm = {
    weekNumber: number
    weekStart: number
    plannedHours: number
    isWeekAvailableForPlanning: boolean
}

export type DepartmentUserPlan = {
    id: string
    userName: string
    userPosition: string
    rate: number
    tooltip: string
    weeksAvailabilityMap: boolean[]
    hoursShouldBePlannedByWeek: number[]
    project: string
    hours: string | null
    __children: DepartmentProjectPlan[]
    [weekNumber: string]: string | number | DepartmentProjectPlan[] | boolean[] | number[] | null
}

export type DepartmentProjectPlan = {
    id: string
    userPosition: string
    project: string
    userId: string
    projectId: number
    projectTaskId: string
    taskName: string
    weeksAvailabilityMap: boolean[]
    hours: string | null
    [weekNumber: string]: string | null | number | boolean[]
}

export enum CalendarDayType {
    None = 0,
    Holiday = 1,
    HalfHoliday = 2,
    WorkDay = 3,
    Vacation = 4
}

export type DayInfoVm = {
    date: number
    dayType: CalendarDayType
}