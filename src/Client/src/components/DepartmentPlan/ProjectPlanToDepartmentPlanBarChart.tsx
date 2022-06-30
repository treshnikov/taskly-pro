import React, { useEffect, useState } from 'react';
import { Chart, ChartData, ChartType, registerables } from 'chart.js';
import { Chart as ChartJs } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { WeekStatistics } from '../../models/DepartmentPlan/DepartmentPlanStatisticsClasses';
import { dateAsShortStr } from '../../common/dateFormatter';
import { DepartmentUserPlan } from '../../models/DepartmentPlan/DepartmentPlanClasses';
import { getColor } from '../../common/getColor';

Chart.register(
    ...registerables
)

export type ProjectPlanToDepartmentPlanBarChartProps = {
    weeks: WeekStatistics[]
    plan: DepartmentUserPlan[]
    kind: "projects" | "department"
}

export const ProjectPlanToDepartmentPlanBarChart: React.FunctionComponent<ProjectPlanToDepartmentPlanBarChartProps> = ({ weeks, plan, kind }) => {
    const { t } = useTranslation();
    const options = {
        cutoutPercentage: 70,
        layout: { padding: 25 },
        legend: { display: "" },
        maintainAspectRatio: false,
        responsive: true,
        scales: { x: { stacked: true }, y: { stacked: true } },
        animation: { duration: 0 },
        responsiveAnimationDuration: 0,
        plugins: { legend: { display: false } }
    }

    const [chartData, setChartData] = useState<ChartData<ChartType, number[], string>>()

    const getAvailableHoursPerWeek = (): number => {
        const employeeNumber = plan?.map(i => i.rate)?.reduce((p, c) => { return p + c }, 0)
        return employeeNumber * 40
    }

    useEffect(() => {
        const availableHoursPerWeek = getAvailableHoursPerWeek()
        let ch: ChartData<ChartType, number[], string> = {
            labels: [],
            datasets: [
                { data: [], animation: false, backgroundColor: 'grey', label: t('available-hours-per-week') + " (" + availableHoursPerWeek + ")", type: 'line', borderWidth: 2, borderColor: 'grey', fill: false, pointRadius: 0 },
            ]
        }

        let uniqueProjects: string[] = []
        weeks.forEach(w => {
            if (kind === "projects") {
                w.projectPlanDetails.forEach(d => {
                    uniqueProjects.push(d.projectName)
                })
            }

            if (kind === "department") {
                w.departmentPlanDetails.forEach(d => {
                    uniqueProjects.push(d.projectName)
                })
            }
        })
        uniqueProjects = uniqueProjects.filter((v, i, a) => a.indexOf(v) === i)

        // populate datasets
        uniqueProjects.forEach(p => {
            ch.datasets.push({ data: [], backgroundColor: getColor(p), label: p, animation: false, type: 'bar', borderColor: "white", stack: 'projPlanStack' })
        })

        weeks.forEach(w => {
            ch.datasets[0].data.push(availableHoursPerWeek)
            uniqueProjects.forEach(p => {
                const ds = ch.datasets.find(j => j.label === p)
                const details = kind === "projects"
                    ? w.projectPlanDetails.find(j => j.projectName === p)
                    : w.departmentPlanDetails.find(j => j.projectName === p)
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
            {kind === "projects" ? t('project-plan-time') : t('department-plan-time')}
        </h4>
        <ChartJs type='bar' options={options} data={chartData as ChartData} />
    </div>
} 