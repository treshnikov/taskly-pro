import { getColor } from "../../common/getColor";
import { IProjectDetailedInfoVm } from "./ProjectDetailedInfoVm";

export class ProjectStatisticsChartData {
    labels: string[] = []
    hoverOffset: number = 4
    datasets: {
        data: number[]
        backgroundColor: string[]
    }[] = [{ data: [], backgroundColor: [] }]
}

export type ProjectStatisticsRecord = {
    name: string,
    color: string,
    hours: number,
    percent: string
}

export class DepartmentsPlan {
    depsToHoursChartData: ProjectStatisticsChartData = new ProjectStatisticsChartData()
    depsToHoursRecords: ProjectStatisticsRecord[] = []

    userPositionsToHoursChartData: ProjectStatisticsChartData = new ProjectStatisticsChartData()
    userPositionsToHoursRecords: ProjectStatisticsRecord[] = []

    public static init(arg: DepartmentsPlan, project: IProjectDetailedInfoVm) {
        const depsToHoursMap: Map<string, number> = new Map()
        const userPositionToHoursMap: Map<string, number> = new Map()
        depsToHoursMap.clear();

        project.tasks?.forEach(task => {
            task.unitEstimations?.forEach(e => {
                const depName = e.unitName
                const hours = e.totalHours

                if (!depsToHoursMap.has(depName)) {
                    depsToHoursMap.set(depName, hours)
                }
                else {
                    const depHours = depsToHoursMap.get(depName) as number
                    depsToHoursMap.set(depName, depHours + hours)
                }

                e.estimations.forEach(p => {
                    const positionName = p.userPositionName
                    const hours = p.hours

                    if (!userPositionToHoursMap.has(positionName)) {
                        userPositionToHoursMap.set(positionName, hours)
                    }
                    else {
                        const positionHours = userPositionToHoursMap.get(positionName) as number
                        userPositionToHoursMap.set(positionName, positionHours + hours)
                    }
                });
            });
        });

        arg.depsToHoursRecords = DepartmentsPlan.getDepartmentListOrderedByHours(depsToHoursMap, project.totalHours)
        arg.depsToHoursChartData = DepartmentsPlan.getDataForDepartmentsHoursChart(depsToHoursMap)

        arg.userPositionsToHoursChartData = DepartmentsPlan.getDataForDepartmentsHoursChart(userPositionToHoursMap)
        arg.userPositionsToHoursRecords = DepartmentsPlan.getUserPositionsListOrderedByHours(userPositionToHoursMap, project.totalHours)
    }

    private static getDataForDepartmentsHoursChart(arg: Map<string, number>): ProjectStatisticsChartData {
        const res = new ProjectStatisticsChartData()

        const sortFunc = (a: string, b: string) => {
            const h1 = arg.get(a) as number
            const h2 = arg.get(b) as number
            return (h1 && h2 && h1 > h2 ? -1 : 1);
        }

        Array.from(arg.keys()).sort(sortFunc).forEach(p => {
            const depName = p
            const hours = arg.get(depName) as number

            res.labels.push(depName)
            res.datasets[0].data.push(hours)
            res.datasets[0].backgroundColor.push(getColor(depName))
        });

        return res
    }

    private static getDepartmentListOrderedByHours(arg: Map<string, number>, projectTotalHours: number): ProjectStatisticsRecord[] {
        const sortFunc = (a: string, b: string) => {
            const h1 = arg.get(a) as number
            const h2 = arg.get(b) as number
            return (h1 && h2 && h1 > h2 ? -1 : 1);
        }

        const arr = Array.from(arg.keys()).sort(sortFunc).map(i => {

            const hours = arg.get(i) as number
            const percent = (100 * hours / projectTotalHours).toFixed(2)
            const color = getColor(i)

            return { name: i, color: color, hours: hours, percent: percent }
        })

        return arr
    }

    private static getUserPositionsListOrderedByHours(arg: Map<string, number>, projectTotalHours: number): ProjectStatisticsRecord[] {
        const sortFunc = (a: string, b: string) => {
            const h1 = arg.get(a) as number
            const h2 = arg.get(b) as number
            return (h1 && h2 && h1 > h2 ? -1 : 1);
        }

        console.log(arg)
        const sortedArr = Array.from(arg.keys()).filter(i => arg.get(i) as number > 0).sort(sortFunc)
        console.log(sortedArr)

        const arr = sortedArr.map(i => {

            const hours = arg.get(i) as number
            const percent = (100 * hours / projectTotalHours).toFixed(2)
            const rec = { name: i, hours: hours, percent: percent, color: getColor(i) }
            return rec
        })

        return arr
    }

}