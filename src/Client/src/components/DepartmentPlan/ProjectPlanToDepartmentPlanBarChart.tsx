import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartType, ChartData, LineElement, PointElement, } from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { WeekStatistics } from '../../models/DepartmentPlan/DepartmentPlanStatisticsClasses';
import { dateAsShortStr } from '../../common/dateFormatter';
import { DepartmentUserPlan } from '../../models/DepartmentPlan/DepartmentPlanClasses';

ChartJS.register(
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    Legend,
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

        const ch: ChartData<ChartType, number[], string> = {
            labels: [],
            datasets: [
                { data: [], backgroundColor: 'grey', label: t('available-hours-per-week') + " (" + availableHoursPerWeek + ")", type: 'line', borderWidth: 2, borderColor: 'grey', fill: true, pointRadius: 0 },
                { data: [], backgroundColor: 'rgb(255, 99, 132)', label: '', type: 'bar', borderColor: "white", stack: 'stack1' },
                { data: [], backgroundColor: 'rgb(75, 192, 192)', label: '', type: 'bar', borderColor: "white", stack: 'stack2' }
            ]
        }

        ch.datasets[1].label = t('project-plan-time')
        ch.datasets[2].label = t('department-plan-time')

        weeks.forEach(w => {
            ch.datasets[0].data.push(availableHoursPerWeek)
            ch.datasets[1].data.push(w.projectPlannedHours)
            ch.datasets[2].data.push(w.departmentPlannedHours)
            ch.labels?.push(dateAsShortStr(new Date(w.weekStart)))
        })

        setChartData(ch)
    }, [weeks])

    if (!chartData) {
        return <></>
    }

    return <div style={{ height: "400px" }}>
        <h4 style={{ marginTop: 0 }}>
            {t('project-to-department-plan-hours')}
        </h4>
        <Chart type='bar' options={options} data={chartData as ChartData} />
    </div>
} 