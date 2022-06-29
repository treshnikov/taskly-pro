import HotTable, { HotColumn } from "@handsontable/react"
import { useTranslation } from "react-i18next"
import { ProjectStatisticsVm } from "../../models/DepartmentPlan/DepartmentPlanStatisticsClasses"
import { StatisticsProjectNameCellRenderer } from "./Renderers/StatisticsProjectNameCellRenderer"
import { TimeDeltaCellRenderer } from "./Renderers/TimeDeltaCellRenderer"

export type ProjectStatisticsTableProps = {
    projectStatistics: ProjectStatisticsVm[]
}

export const ProjectStatisticsTable: React.FunctionComponent<ProjectStatisticsTableProps> = (props) => {
    const { t } = useTranslation();

   return <div style={{ overflow: "auto" }}>
        <h4 style={{ marginTop: 0 }}>
            {t('projects')}
        </h4>
        <HotTable
            columnSorting={true}
            data={props.projectStatistics}
            colHeaders={["Id", t('project'), t('project-plan-time') + ", " + t('hour'), t('department-plan-time') + ", " + t('hour'), t('difference') + ", " + t('hour'), '']}
            fillHandle={false}
            manualRowMove={false}
            manualColumnMove={false}
            wordWrap={true}
            manualColumnResize={true}
            stretchH={"last"}
            height={"400px"}
            licenseKey='non-commercial-and-evaluation'
        >
            <HotColumn data={"id"} className='htCenter' readOnly type={"text"} />
            <HotColumn data={"name"} readOnly renderer={StatisticsProjectNameCellRenderer} />
            <HotColumn data={"plannedTaskHoursForDepartment"} className='htCenter' readOnly type={"numeric"} />
            <HotColumn data={"plannedTaskHoursByDepartment"} className='htCenter' readOnly type={"numeric"} />
            <HotColumn data={"deltaHours"} readOnly renderer={TimeDeltaCellRenderer} />
            <HotColumn readOnly />
        </HotTable>
    </div>

}