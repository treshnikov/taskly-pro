import { useTranslation } from "react-i18next";
import { ProjectStatisticsVm } from "../../models/DepartmentPlan/DepartmentPlanStatisticsClasses"
import { Chart, ChartData, ChartType, registerables } from 'chart.js';
import { Chart as ChartJs } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { getColor } from "../../common/getColor";

Chart.register(
    ...registerables
)

type ProjectsPieChartProps = {
    projectStatistics: ProjectStatisticsVm[]
    kind: "common" | "external-internal"
}

export const ProjectsPieChart: React.FunctionComponent<ProjectsPieChartProps> = ({ projectStatistics, kind }) => {
    const { t } = useTranslation();
    const options = {
        layout: { padding: 0 },
        legend: { display: "" },
        maintainAspectRatio: false,
        responsive: true,
        animation: { duration: 0 },
        responsiveAnimationDuration: 0,
        plugins: { legend: { display: false } }
    }

    const [chartData, setChartData] = useState<ChartData<ChartType, number[], string>>()

    useEffect(() => {
        projectStatistics.sort((a, b) => {
            return kind === "external-internal"
                ? a.projectType > b.projectType
                    ? 0
                    : 1
                : a.plannedTaskHoursForDepartment > b.plannedTaskHoursForDepartment
                    ? 0
                    : 1
        })

        let ch: ChartData<ChartType, number[], string> = {
            labels: [],
            datasets: [
                {
                    type: 'doughnut',
                    data: [],
                    animation: false,
                    backgroundColor: projectStatistics.map(i => kind === "common"
                        ? getColor(i.name)
                        : i.projectType === 0
                            ? "#ffc300"
                            : "#34568b"),
                    borderWidth: 0
                },
            ]
        }

        projectStatistics.forEach(p => {
            ch.labels?.push(p.name)
            ch.datasets[0].data.push(p.plannedTaskHoursForDepartment)
        })

        setChartData(ch)
    }, [projectStatistics])

    if (!chartData) {
        return <></>
    }

    return <div style={{ height: "150px" }}>
        <ChartJs type='doughnut' options={options} data={chartData as ChartData} />
    </div>

}