import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dateAsShortStr } from "../../common/dateFormatter";
import { formatNumber } from "../../common/numberFormat";
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { ProjectStatisticsVm } from "../../models/DepartmentPlan/DepartmentPlanStatisticsClasses";

export type StatisticsSummaryProps = {
    start: number
    end: number
    projectStatistics: ProjectStatisticsVm[]
    plan: DepartmentUserPlan[]
}

export const StatisticsSummary: React.FunctionComponent<StatisticsSummaryProps> = ({start, end, projectStatistics, plan}) => {
    const { t } = useTranslation();
    const [hoursInWeeks, setHoursInWeeks] = useState<number>(0)
    const [hoursInProjects, setHoursInProjects] = useState<number>(0)
    const [hoursInDepartmentPlan, setHoursInDepartmentPlan] = useState<number>(0)

    const calcHoursInProjects = () => {
        if (projectStatistics && projectStatistics.length > 0) {
            const hours = projectStatistics.map(i => i.plannedTaskHoursForDepartment)?.reduce((p, c) => { return p + c })
            setHoursInProjects(hours)
        }
    }

    const calcHoursInDepartmentPlan = () => {
        if (projectStatistics && projectStatistics.length > 0) {
            const hours = projectStatistics.map(i => i.plannedTaskHoursByDepartment)?.reduce((p, c) => { return p + c })
            setHoursInDepartmentPlan(hours)
        }
    }

    const calcPlannedHours = () => {
        let mondaysCount = 0
        const dt = new Date(start)
        const endDate = new Date(end)
        while (dt < endDate) {
            if (dt.getDay() === 1) {
                mondaysCount += 1
            }

            dt.setDate(dt.getDate() + 1)
        }

        setHoursInWeeks(mondaysCount * 8 * 5 * getEmployeeNumber())
    }

    const getEmployeeNumber = (): number => {
        return plan?.map(i => i.rate)?.reduce((p, c) => { return p + c })
    }

    useEffect(() => {
        calcPlannedHours()
        calcHoursInDepartmentPlan()
        calcHoursInProjects()
    }, [start, end, plan, projectStatistics])

    return <div>
        <h4 style={{ marginTop: 0 }}>
            {t('info')}
        </h4>
        <ul>
            <li>
                {t('period')}: {t('from')} {dateAsShortStr(new Date(start))} {t('to')} {dateAsShortStr(new Date(end))}
            </li>
            <li>
                {t('available-time-for-planning')}: {formatNumber(hoursInWeeks)}{t('hour')} ({t('employees')} = {getEmployeeNumber()},  {t('weeks')} = {hoursInWeeks / 40 / getEmployeeNumber()})
            </li>
            <li>
                {t('project-plan-time')}: {formatNumber(hoursInProjects)}{t('hour')}
            </li>
            <li>
                {t('department-plan-time')}: {formatNumber(hoursInDepartmentPlan)}{t('hour')}
            </li>
        </ul>
    </div>

}