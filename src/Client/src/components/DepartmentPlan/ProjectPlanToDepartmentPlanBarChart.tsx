import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartType, ChartData, LineElement, PointElement, } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { WeekStatistics } from '../../models/DepartmentPlan/DepartmentPlanStatisticsClasses';
import { dateAsShortStr } from '../../common/dateFormatter';
import { DepartmentUserPlan } from '../../models/DepartmentPlan/DepartmentPlanClasses';
import { getColor } from '../../common/getColor';

ChartJS.register(
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip
);

export type ProjectPlanToDepartmentPlanBarChartProps = {
    weeks: WeekStatistics[]
    plan: DepartmentUserPlan[]
}

export const ProjectPlanToDepartmentPlanBarChart: React.FunctionComponent<ProjectPlanToDepartmentPlanBarChartProps> = ({ weeks, plan }) => {
    const { t } = useTranslation();
    const options = {
        cutoutPercentage: 70,
        layout: { padding: 25 },
        legend: { display: "hidden" },
        maintainAspectRatio: false,
        responsive: true,
        scales: { x: { stacked: true }, y: { stacked: true } }
    }

    const [chartData, setChartData] = useState<ChartData<ChartType, number[], string>>()

    const getAvailableHoursPerWeek = (): number => {
        const employeeNumber = plan?.map(i => i.rate)?.reduce((p, c) => { return p + c })
        return employeeNumber * 40
    }

    useEffect(() => {
        const availableHoursPerWeek = getAvailableHoursPerWeek()
        let ch: ChartData<ChartType, number[], string> = {
            labels: [],
            datasets: [
                { data: [], backgroundColor: 'grey', label: t('available-hours-per-week') + " (" + availableHoursPerWeek + ")", type: 'line', borderWidth: 2, borderColor: 'grey', fill: true, pointRadius: 0 },
            ]
        }

        let uniqueProjects: string[] = []
        weeks.forEach(w => {
            w.projectPlanDetails.forEach(d => {
                uniqueProjects.push(d.projectName)
            })
        })
        uniqueProjects = uniqueProjects.filter((v, i, a) => a.indexOf(v) === i)

        // populate datasets
        uniqueProjects.forEach(p => {
            ch.datasets.push({ data: [], backgroundColor: getColor(p), label: p, type: 'bar', borderColor: "white", stack: 'projPlanStack' })
        })

        weeks.forEach(w => {
            ch.datasets[0].data.push(availableHoursPerWeek)
            uniqueProjects.forEach(p => {
                const ds = ch.datasets.find(j => j.label === p)
                const details = w.projectPlanDetails.find(j => j.projectName === p)
                ds?.data.push(details ? details.hours : 0)
            })

            ch.labels?.push(dateAsShortStr(new Date(w.weekStart)))
        })

        setChartData(ch)
    }, [weeks])

    if (!chartData) {
        return <></>
    }

    return <div style={{ height: "400px" }}>
        <h4 style={{ marginTop: 0 }}>
            {t('project-plan-time')}
        </h4>
        <Chart type='bar' options={options} data={chartData as ChartData} />
    </div>
} 