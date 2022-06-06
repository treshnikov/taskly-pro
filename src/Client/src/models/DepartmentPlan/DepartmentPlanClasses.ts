export type DepartmentPlanUserRecordVm = {
    userId: string
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

export type DepartmentPlanFlatRecordVm = {
    userName: string
    userPosition: string
    project: string
    [weekNumber: string]: string
}

export class DepartmentPlanFlatRecordVmHelper {
    public static buildFlatPlan(arg: DepartmentPlanUserRecordVm[]): DepartmentPlanFlatRecordVm[] {
        const result: DepartmentPlanFlatRecordVm[] = [];

        arg.forEach(user => {
            user.projects.forEach(project => {
                const flatRecord: DepartmentPlanFlatRecordVm = {
                    userName: user.userName,
                    userPosition: user.userPosition,
                    project: project.projectShortName,
                };

                project.plans.forEach(plan => {
                    flatRecord["week" + plan.weekNumber.toString()] = plan.plannedHours.toString();
                });

                result.push(flatRecord);
            });
        });

        return result;
    }
}