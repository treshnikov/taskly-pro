import { DepartmentUserPlan, DepartmentPlanUserRecordVm, DepartmentProjectPlan, DepartmentPlanUserProjectVm } from "./DepartmentPlanClasses";


export class DepartmentPlanHelper {

    public static recalcHours(arg: DepartmentUserPlan[], userIdFilter: string | null = null) {
        arg.filter(u => userIdFilter === null ? true : u.userId === userIdFilter).forEach(user => {
            let userHours = 0;
            let weekSumHours: { [key: string]: number; } = {};


            user.__children.forEach(project => {
                let projectHours = 0;

                let weekIdx = 1;
                while ((project as any).hasOwnProperty("week" + weekIdx.toString())) {
                    const weekIdent = "week" + weekIdx.toString();

                    const hoursAsString = project[weekIdent];
                    if (hoursAsString && hoursAsString !== "") {
                        const weekHours = parseFloat(hoursAsString as string);
                        projectHours += weekHours;
                        userHours += weekHours;

                        if (!(weekSumHours as any).hasOwnProperty(weekIdent)) {
                            weekSumHours[weekIdent] = 0;
                        }

                        weekSumHours[weekIdent] += weekHours;
                    }
                    weekIdx++;
                }
                project.hours = projectHours > 0 ? projectHours.toString() : null;
            });

            user.hours = userHours > 0 ? userHours.toString() : null;
            Object.keys(weekSumHours).forEach(weekIdent => {
                user[weekIdent.toString()] = weekSumHours[weekIdent] > 0 ? weekSumHours[weekIdent].toString() : null;
            });

        });
    }

    public static buildFlatPlan(arg: DepartmentPlanUserRecordVm[]): DepartmentUserPlan[] {
        const res: DepartmentUserPlan[] = [];
        let idx = 1;

        arg.forEach(user => {
            const userRecord: DepartmentUserPlan = {
                id: "u" + idx.toString(),
                userName: user.userName,
                userPosition: user.userPosition,
                userId: user.userId,
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
                    userId: user.userId,
                    projectId: project.projectId,
                    project: project.projectId + ": " + (project.projectShortName ? project.projectShortName : project.projectName)
                };
                idx++;

                // populate weekX attributes
                project.plans.forEach(week => {
                    projectRecord["week" + week.weekNumber.toString()] = week.plannedHours === 0 ? null : week.plannedHours.toString();
                });

                userRecord.__children.push(projectRecord);
            });

            res.push(userRecord);
        });

        DepartmentPlanHelper.recalcHours(res);
        return res;
    }

    public static getRowsWithEmtyPlans(plan: DepartmentUserPlan[]): number[] {
        let hiddenRows: number[] = [];
        let idx = 0;
        for (let i = 0; i < plan.length; i++) {
            idx++;
            for (let j = 0; j < plan[i].__children.length; j++) {
                if (!plan[i].__children[j].hours) {
                    hiddenRows.push(idx);
                }
                idx++;
            }
        }
        return hiddenRows;
    }

    public static preparePlanFToSendToServer(plan: DepartmentUserPlan[], startDate: Date): DepartmentPlanUserRecordVm[] {
        const res: DepartmentPlanUserRecordVm[] = [];
        
        let firstMonday = new Date(startDate)
        while (firstMonday.getDay() !== 1) {
            firstMonday = new Date(firstMonday.getFullYear(), firstMonday.getMonth(), firstMonday.getDate() - 1)
        }        

        plan.forEach(user => {

            const userRecord: DepartmentPlanUserRecordVm = {
                userId: user.userId as string,
                projects: [],
                userName: "",
                userPosition: ""
            };

            user.__children.forEach(project => {
                const projectRecord: DepartmentPlanUserProjectVm = {
                    projectId: project.projectId as number,
                    plans: [],
                    projectName: "",
                    projectShortName: "",
                    projectStart: 0,
                    projectEnd: 0
                };

                let weekIdx = 1;
                while ((project as any).hasOwnProperty("week" + weekIdx.toString())) {
                    const weekIdent = "week" + weekIdx.toString();

                    const hoursAsString = project[weekIdent];
                    if (hoursAsString && hoursAsString !== "") {
                        const weekHours = parseFloat(hoursAsString as string);

                        const dt = new Date(firstMonday)
                        dt.setDate(firstMonday.getDate() + 7 * (weekIdx - 1))

                        projectRecord.plans.push({
                            weekStart: dt.getTime(),
                            weekNumber: weekIdx,
                            plannedHours: weekHours
                        })
                    }
                    weekIdx++;
                }

                userRecord.projects.push(projectRecord);
            }
            )
            res.push(userRecord);
        })
        return res
    }
}

