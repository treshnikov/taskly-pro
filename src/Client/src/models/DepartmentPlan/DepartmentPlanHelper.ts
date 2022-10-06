import { isDefined } from "handsontable/helpers";
import { use } from "i18next";
import { dateAsShortStr, dateAsShortStrFromNumber, dateToRequestStr } from "../../common/dateFormatter";
import { ServicesStorageHelper } from "../../common/servicesStorageHelper";
import { DepartmentUserPlan, DepartmentPlanUserRecordVm, DepartmentProjectPlan, DepartmentPlanUserProjectVm, TaskTimeVm } from "./DepartmentPlanClasses";


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
                    if (!(weekSumHours as any).hasOwnProperty(weekIdent)) {
                        weekSumHours[weekIdent] = 0;
                    }

                    const hoursAsString = project[weekIdent];
                    if (hoursAsString && hoursAsString !== "") {
                        const weekHours = parseFloat(hoursAsString as string);
                        projectHours += weekHours;
                        userHours += weekHours;
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

            const userName = user.userName + (user.quitDate == null || user.quitDate <= 0
                ? ''
                : ' (' + (ServicesStorageHelper.t('quit') + ' ' + dateAsShortStr(new Date(user.quitDate))) + ')') 

            const userRecord: DepartmentUserPlan = {
                id: "u" + idx.toString(),
                userName: userName,
                userPosition: user.userPosition,
                userId: user.userId,
                project: '',
                tooltip: '',
                weeksAvailabilityMap: [],
                hoursShouldBePlannedByWeek: user.weeks.map(w => w.hoursAvailableForPlanning),
                hours: null,
                rate: user.rate,
                __children: []
            };
            idx++;

            user.projects.forEach(project => {
                const projectRecord: DepartmentProjectPlan = {
                    id: "p" + idx.toString(),
                    userPosition: '',
                    hours: null,
                    tooltip: DepartmentPlanHelper.buildTooltip(project.taskTimes),
                    weeksAvailabilityMap: [],
                    userId: user.userId,
                    projectId: project.projectId,
                    project: project.projectId + ": " + (project.projectShortName ? project.projectShortName : project.projectName)
                };
                idx++;

                // populate weekX attributes
                project.plans.forEach(week => {
                    projectRecord.weeksAvailabilityMap.push(week.isWeekAvailableForPlanning)
                    projectRecord["week" + week.weekNumber.toString()] = week.plannedHours === 0 ? null : week.plannedHours.toString();
                });

                userRecord.__children.push(projectRecord);
            });

            res.push(userRecord);
        });

        DepartmentPlanHelper.recalcHours(res);
        return res;
    }

    public static getRowsForByProjectCode(plan: DepartmentUserPlan[], projectId: number): number[] {
        let hiddenRows: number[] = [];
        let idx = 0;
        for (let i = 0; i < plan.length; i++) {
            idx++;
            for (let j = 0; j < plan[i].__children.length; j++) {
                if (plan[i].__children[j].projectId !== projectId) {
                    hiddenRows.push(idx);
                }
                idx++;
            }
        }
        return hiddenRows;
    }

    public static getProjectRows(plan: DepartmentUserPlan[], predicat: (arg: DepartmentProjectPlan) => boolean): number[] {
        let rows: number[] = [];
        let idx = 0;
        for (let i = 0; i < plan.length; i++) {
            idx++;
            for (let j = 0; j < plan[i].__children.length; j++) {
                if (predicat(plan[i].__children[j])) {
                    rows.push(idx);
                }
                idx++;
            }
        }
        return rows;
    }

    public static preparePlanFToSendToServer(plan: DepartmentUserPlan[], startDate: Date): DepartmentPlanUserRecordVm[] {
        const res: DepartmentPlanUserRecordVm[] = [];

        let firstMonday = new Date(startDate)
        while (firstMonday.getDay() !== 1) {
            firstMonday = new Date(firstMonday.getFullYear(), firstMonday.getMonth(), firstMonday.getDate() + 1)
        }

        plan.forEach(user => {

            const userRecord: DepartmentPlanUserRecordVm = {
                userId: user.userId as string,
                rate: 0,
                quitDate: 0,
                hiringDate: 0,
                projects: [],
                weeks: [],
                userName: "",
                userPosition: ""
            };

            user.__children.forEach(project => {
                const projectRecord: DepartmentPlanUserProjectVm = {
                    projectId: project.projectId as number,
                    plans: [],
                    taskTimes: [],
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
                            plannedHours: weekHours,
                            isWeekAvailableForPlanning: false
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

    public static onPlanChanged(plan: DepartmentUserPlan[], projectId: string, weekId: string, hours: string): boolean {
        // prevent editing cells with summary info
        if (projectId[0] === 'u') {
            return false
        }

        // find and update changed record
        let record: DepartmentProjectPlan = { id: '', hours: '', project: '', userPosition: '', userName: '', userId: '', projectId: 0, tooltip: '', weeksAvailabilityMap: [] }
        const found = plan.some(u => u.__children.some(p => {
            record = p
            return p.id === projectId
        }))

        if (found) {
            record[weekId] = hours
            DepartmentPlanHelper.recalcHours(plan, record.userId)
            return true
        }

        return false
    }

    private static buildTooltip(taskTimes: TaskTimeVm[]): string {
        let res = ''
        taskTimes.forEach((i, idx) => {
            res += dateAsShortStrFromNumber(i.start) + " - " + dateAsShortStrFromNumber(i.end) + "\t" + i.name
            if (idx != taskTimes.length - 1) {
                res += "\r\n"
            }
        })

        return res
    }

}


