import HotTable, { HotColumn } from "@handsontable/react"
import { Grid } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ProjectStatisticsVm } from "../../models/DepartmentPlan/DepartmentPlanStatisticsClasses"
import { ProjectsPieChart } from "./ProjectsPieChart"
import { StatisticsProjectNameCellRenderer } from "./Renderers/StatisticsProjectNameCellRenderer"
import { TimeDeltaCellRenderer } from "./Renderers/TimeDeltaCellRenderer"

export type ProjectStatisticsTableProps = {
    projectStatistics: ProjectStatisticsVm[]
}

export const ProjectStatisticsTable: React.FunctionComponent<ProjectStatisticsTableProps> = ({ projectStatistics }) => {
    const { t } = useTranslation();

    return <>

        <Grid
            container>
            <Grid
                item
                xs={8}>
                <div style={{ overflow: "auto" }}>
                    <h4 style={{ marginTop: 0 }}>
                        {t('projects')}
                    </h4>
                    <HotTable
                        columnSorting={true}
                        data={projectStatistics}
                        columnHeaderHeight={50}
                        colHeaders={["Id", t('project'), t('project-plan-time-br') + ", " + t('hour'), t('department-plan-time-br') + ", " + t('hour'), t('difference') + ", " + t('hour'), '']}
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

            </Grid>
            <Grid
                item
                xs={4}>
                <div style={{ marginLeft: "30px" }}>
                    <h4 style={{ marginTop: 0 }}>
                        {t('estimation')}
                    </h4>
                    <ProjectsPieChart
                        projectStatistics={projectStatistics}
                        kind="common" />
                    <h4 style={{ marginTop: "30px" }}>
                        {t('external')} / {t('internal')}
                    </h4>
                    <ProjectsPieChart
                        projectStatistics={projectStatistics}
                        kind="external-internal" />
                </div>
            </Grid>
        </Grid>
    </>


}