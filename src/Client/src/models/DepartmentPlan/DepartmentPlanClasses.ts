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

export type DepartmentUserPlan = {
    id: string
    userName: string
    userPosition: string
    project: string 
    hours: string | null
    __children: DepartmentProjectPlan[]
    [weekNumber: string]: string | DepartmentProjectPlan[] | null
}

export type DepartmentProjectPlan = {
    id: string
    userPosition: string
    project: string
    hours: string | null
    [weekNumber: string]: string | null
}

export class DepartmentPlanFlatRecordVmHelper {

    public static recalcHours(arg: DepartmentUserPlan[]) {
        arg.forEach(user => {
            let userHours = 0
            let weekSumHours: {[key: string]: number} = {}
            
        
            user.__children.forEach(project => {
                let projectHours = 0
                let weekIdx = 1


                while ((project as any).hasOwnProperty("week" + weekIdx.toString())) {
                    const weekIdent = "week" + weekIdx.toString()
                    
                    const hoursAsString = project[weekIdent]
                    if (hoursAsString && hoursAsString !== "") {
                        const weekHours = parseFloat(hoursAsString)
                        projectHours += weekHours
                        userHours += weekHours

                        if (!(weekSumHours as any).hasOwnProperty(weekIdent)) {
                            weekSumHours[weekIdent] = 0
                        }
        
                        weekSumHours[weekIdent] += weekHours                     
                    }
                    weekIdx++
                }
                project.hours = projectHours > 0 ? projectHours.toString() : null
            });
            user.hours = userHours > 0 ? userHours.toString() : null
            Object.keys(weekSumHours).forEach(weekIdent => {
                user[weekIdent.toString()] = weekSumHours[weekIdent] > 0 ? weekSumHours[weekIdent].toString() : null
            })

        });
    }

    public static buildFlatPlan(arg: DepartmentPlanUserRecordVm[]): DepartmentUserPlan[] {
        const res: DepartmentUserPlan[] = [];
        let idx = 1

        arg.forEach(user => {
            const userRecord: DepartmentUserPlan = {
                id: "u" + idx.toString(),
                userName: user.userName,
                userPosition: user.userPosition,
                project: '',
                hours: null,
                __children: []
            };
            idx++;

            user.projects.forEach(project => {
                const projectRecord: DepartmentProjectPlan = {
                    id: "p" + idx.toString(),
                    userPosition: '',
                    hours: null,
                    project: project.projectId + ": " + (project.projectShortName ? project.projectShortName : project.projectName)
                }
                idx++;

                // populate weekX attributes
                project.plans.forEach(week => {
                    projectRecord["week" + week.weekNumber.toString()] = week.plannedHours === 0 ? '' : week.plannedHours.toString();
                });

                userRecord.__children.push(projectRecord);

            });

            res.push(userRecord);
        });

        DepartmentPlanFlatRecordVmHelper.recalcHours(res)
        return res;
    }
}