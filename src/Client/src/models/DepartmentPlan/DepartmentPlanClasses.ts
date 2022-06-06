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

export type DepartmentPlanFlatUserRecordVm = {
    userName: string
    userPosition: string | null
    project?: string | null
    __children: DepartmentPlanFlatProjectRecordVm[]
}

export type DepartmentPlanFlatProjectRecordVm = {
    userPosition: string
    project: string
    [weekNumber: string]: string
}

export class DepartmentPlanFlatRecordVmHelper {
    public static buildFlatPlan(arg: DepartmentPlanUserRecordVm[]): DepartmentPlanFlatUserRecordVm[] {
        const result: DepartmentPlanFlatUserRecordVm[] = [];

        arg.forEach(user => {
            const userRecord: DepartmentPlanFlatUserRecordVm = {
                userName: user.userName,
                userPosition: null,
                project: null,
                __children: []
            };

            user.projects.forEach(project => {
                const projectRecord: DepartmentPlanFlatProjectRecordVm = {
                    userPosition: user.userPosition,
                    project: project.projectId + ": " + project.projectShortName
                }

                project.plans.forEach(plan => {
                    projectRecord["week" + plan.weekNumber.toString()] = plan.plannedHours.toString();
                });

                userRecord.__children.push(projectRecord);

            });
            result.push(userRecord);
        });

        return result;
    }
}