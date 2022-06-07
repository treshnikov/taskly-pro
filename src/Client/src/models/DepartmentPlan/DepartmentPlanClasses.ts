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
    id: string
    userName: string
    userPosition: string | null
    project?: string | null
    hours: string
    __children: DepartmentPlanFlatProjectRecordVm[]
}

export type DepartmentPlanFlatProjectRecordVm = {
    id: string
    userPosition: string
    project: string
    hours: string
    [weekNumber: string]: string
}

export class DepartmentPlanFlatRecordVmHelper {
    public static buildFlatPlan(arg: DepartmentPlanUserRecordVm[]): DepartmentPlanFlatUserRecordVm[] {
        const res: DepartmentPlanFlatUserRecordVm[] = [];
        let idx = 1

        arg.forEach(user => {
            const userRecord: DepartmentPlanFlatUserRecordVm = {
                id: "u" + idx.toString(),
                userName: user.userName,
                userPosition: user.userPosition,
                project: null,
                hours: '0',
                __children: []
            };
            idx++;

            let userHours = 0
            user.projects.forEach(project => {
                const projectRecord: DepartmentPlanFlatProjectRecordVm = {
                    id: "p" + idx.toString(),
                    userPosition: '',
                    hours: '0',
                    project: project.projectId + ": " + project.projectShortName
                }
                idx++;

                // populate weekX attributes
                let projectHours = 0
                project.plans.forEach(week => {
                    projectHours += week.plannedHours
                    userHours += week.plannedHours
                    projectRecord["week" + week.weekNumber.toString()] = week.plannedHours === 0 ? '' : week.plannedHours.toString();
                });

                projectRecord.hours = projectHours.toString() 
                userRecord.__children.push(projectRecord);

            });

            userRecord.hours = userHours.toString()
            res.push(userRecord);
        });

        return res;
    }
}