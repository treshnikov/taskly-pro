import { IProjectDetailedInfoVm } from "./ProjectDetailedInfoVm";
import { ProjectTaskUnitEstimationVmHelper } from "./ProjectTaskUnitEstimationVm";

export class ProjectStatisticsChartDatasets {
    data: number[] = []
    backgroundColor: string[] = []
}

export class ProjectStatisticsChartData {
    labels: string[] = []
    datasets: ProjectStatisticsChartDatasets[] = [new ProjectStatisticsChartDatasets()]
    hoverOffset: number = 4
}

export type ProjectStatisticsDepartmentRecord = {
    name: string, 
    color: string, 
    hours: number, 
    percent: string
}

export class DepartmentsPlan {

    chartData: ProjectStatisticsChartData = new ProjectStatisticsChartData()
    depRecords: ProjectStatisticsDepartmentRecord[] = []

    public static init(arg: DepartmentsPlan, project: IProjectDetailedInfoVm) {
        const departmnetToHoursMap: Map<string, number> = new Map()
        departmnetToHoursMap.clear();

        project.tasks?.forEach(task => {
            task.unitEstimations?.forEach(e => {
                const depName = e.unitName
                const hours = e.totalHours

                if (!departmnetToHoursMap.has(depName)) {
                    departmnetToHoursMap.set(depName, hours)
                }
                else {
                    const depHours = departmnetToHoursMap.get(depName) as number
                    departmnetToHoursMap.set(depName, depHours + hours)
                }
            });
        });

        arg.depRecords = DepartmentsPlan.getDepartmentListOrderedByHours(departmnetToHoursMap, project.totalHours)
        arg.chartData = DepartmentsPlan.getDataForDepartmentsHoursChart(departmnetToHoursMap)
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
            res.datasets[0].backgroundColor.push(ProjectTaskUnitEstimationVmHelper.getColor(depName))
        });

        return res
    }

    private static getDepartmentListOrderedByHours(arg: Map<string, number>, projectTotalHours: number): ProjectStatisticsDepartmentRecord[] {
        const sortFunc = (a: string, b: string) => {
            const h1 = arg.get(a) as number
            const h2 = arg.get(b) as number
            return (h1 && h2 && h1 > h2 ? -1 : 1);
        }

        const arr = Array.from(arg.keys()).sort(sortFunc).map(i => {

            const hours = arg.get(i) as number
            const percent = (100 * hours / projectTotalHours).toFixed(2)
            const color = ProjectTaskUnitEstimationVmHelper.getColor(i)

            return { name: i, color: color, hours: hours, percent: percent }
        })

        return arr
    }
}