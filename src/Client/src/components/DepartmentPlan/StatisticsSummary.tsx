import { useTranslation } from "react-i18next";
import { dateAsShortStr } from "../../common/dateFormatter";
import { formatNumber } from "../../common/numberFormat";
import { DepartmentStatisticsSummary } from "../../models/DepartmentPlan/DepartmentPlanStatisticsClasses";

export type StatisticsSummaryProps = {
    summary: DepartmentStatisticsSummary
}

export const StatisticsSummary: React.FunctionComponent<StatisticsSummaryProps> = ({ summary }) => {
    const { t } = useTranslation();

    return <div>
        <h4 style={{ marginTop: 0 }}>
            {t('info')}
        </h4>
        <ul>
            <li>
                {t('period')}: {t('from')} {dateAsShortStr(new Date(summary.start))} {t('to')} {dateAsShortStr(new Date(summary.end))}
            </li>
            <li>
                {t('available-time-for-planning')}: {formatNumber(summary.availableHoursForPlanning)}{t('hour')}
            </li>
            <li>
                {t('project-plan-time')}: {formatNumber(summary.hoursPlannedForDepartment)}{t('hour')}
            </li>
            <li>
                {t('department-plan-time')}: {formatNumber(summary.hoursPlannedByHeadOfDepartment)}{t('hour')}
            </li>
            <li>
                {t('department-vactaions-time')}: {formatNumber(summary.sumOfVacationHours)}{t('hour')}
            </li>
            <li>
                {t('department-load')}: {summary.workLoadPercentage}%
            </li>
            <li>
                {t('external-projects-proportion')}: {summary.externalProjectsRateInPercentage}%
            </li>
        </ul>
    </div>

}