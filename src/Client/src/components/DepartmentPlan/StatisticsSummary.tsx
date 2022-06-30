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

export const StatisticsSummary: React.FunctionComponent<StatisticsSummaryProps> = ({ start, end, projectStatistics, plan }) => {
    const { t } = useTranslation();
    const [hoursInWeeks, setHoursInWeeks] = useState<number>(0)
    const [hoursInProjects, setHoursInProjects] = useState<number>(0)
    const [hoursInDepartmentPlan, setHoursInDepartmentPlan] = useState<number>(0)
    const [externalProjectsProportion, setExternalProjectsProportion] = useState<number>(0)
    const [departmentLoad, setDepartmentLoad] = useState<number>(0)

    const calcHoursInProjects = (): number => {
        if (projectStatistics && projectStatistics.length > 0) {
            const hours = projectStatistics.map(i => i.plannedTaskHoursForDepartment)?.reduce((p, c) => { return p + c })
            setHoursInProjects(hours)

            return hours
        }

        return 0
    }

    const calcHoursInDepartmentPlan = () => {
        if (projectStatistics && projectStatistics.length > 0) {
            const hours = projectStatistics.map(i => i.plannedTaskHoursByDepartment)?.reduce((p, c) => { return p + c })
            setHoursInDepartmentPlan(hours)
        }
    }

    const calcHoursInWeeks = (): number => {
        let mondaysCount = 0
        const dt = new Date(start)
        const endDate = new Date(end)
        while (dt < endDate) {
            if (dt.getDay() === 1) {
                mondaysCount += 1
            }

            dt.setDate(dt.getDate() + 1)
        }

        const res = mondaysCount * 8 * 5 * getEmployeeNumber()
        setHoursInWeeks(mondaysCount * 8 * 5 * getEmployeeNumber())

        return res
    }

    const getEmployeeNumber = (): number => {
        return plan?.map(i => i.rate)?.reduce((p, c) => { return p + c })
    }

    const calsExternalProjectsProportion = () => {
        if (projectStatistics.length === 0) {
            return
        }

        const internal = projectStatistics
            .filter(i => i.projectType === 0)
            .map(i => i.plannedTaskHoursForDepartment)
            .reduce((p, c) => { return p + c })

        const external = projectStatistics
            .filter(i => i.projectType === 1)
            .map(i => i.plannedTaskHoursForDepartment)
            .reduce((p, c) => { return p + c })

        let res = 100 * external / (external + internal)
        res = Math.round(res * 100) / 100
        setExternalProjectsProportion(res)
    }

    const calcDepartmentLoad = () => {
        const weeksHours = calcHoursInWeeks()

        let res = weeksHours === 0
            ? 0
            : 100 * calcHoursInProjects() / calcHoursInWeeks()
        res = Math.round(res * 100) / 100
        setDepartmentLoad(res)
    }

    useEffect(() => {
        calcHoursInWeeks()
        calcHoursInDepartmentPlan()
        calcHoursInProjects()
        calsExternalProjectsProportion()
        calcDepartmentLoad()
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
            <li>
                {t('department-load')}: {departmentLoad}%
            </li>
            <li>
                {t('external-projects-proportion')}: {externalProjectsProportion}%
            </li>
        </ul>
    </div>

}