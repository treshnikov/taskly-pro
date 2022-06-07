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
    userPosition: string
    project: string 
    hours: string
    __children: DepartmentPlanFlatProjectRecordVm[]
    [weekNumber: string]: string | DepartmentPlanFlatProjectRecordVm[]
}

export type DepartmentPlanFlatProjectRecordVm = {
    id: string
    userPosition: string
    project: string
    hours: string
    [weekNumber: string]: string
}

export class DepartmentPlanFlatRecordVmHelper {

    public static recalcHours(arg: DepartmentPlanFlatUserRecordVm[]) {
        arg.forEach(user => {
            let userHours = 0
            let weekSumHours: {[key: string]: number} = {}
            
        
            user.__children.forEach(project => {
                let projectHours = 0
                let weekIdx = 1


                while ((project as any).hasOwnProperty("week" + weekIdx.toString())) {
                    const weekIdent = "week" + weekIdx.toString()
                    
                    const hoursAsString = project[weekIdent]
                    if (hoursAsString !== "") {
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
                project.hours = projectHours > 0 ? projectHours.toString() : ''
            });
            user.hours = userHours > 0 ? userHours.toString() : ''
            Object.keys(weekSumHours).forEach(weekIdent => {
                user[weekIdent.toString()] = weekSumHours[weekIdent] > 0 ? weekSumHours[weekIdent].toString() : ''
            })

        });
    }

    public static buildFlatPlan(arg: DepartmentPlanUserRecordVm[]): DepartmentPlanFlatUserRecordVm[] {
        const res: DepartmentPlanFlatUserRecordVm[] = [];
        let idx = 1

        arg.forEach(user => {
            const userRecord: DepartmentPlanFlatUserRecordVm = {
                id: "u" + idx.toString(),
                userName: user.userName,
                userPosition: user.userPosition,
                project: '',
                hours: '',
                __children: []
            };
            idx++;

            user.projects.forEach(project => {
                const projectRecord: DepartmentPlanFlatProjectRecordVm = {
                    id: "p" + idx.toString(),
                    userPosition: '',
                    hours: '',
                    project: project.projectId + ": " + project.projectShortName
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