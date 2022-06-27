import HotTable, { HotColumn } from "@handsontable/react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dateAsShortStr, dateToRequestStr } from "../../common/dateFormatter";
import { formatNumber } from "../../common/numberFormat";
import { useHttp } from "../../hooks/http.hook";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { toggleShowStatistics } from "../../redux/departmentPlanSlice";
import { StatisticsProjectNameCellRenderer } from "./Renderers/StatisticsProjectNameCellRenderer";
import { TimeDeltaCellRenderer } from "./Renderers/TimeDeltaCellRenderer";

export type DepartmentPlanStatisticsProps = {
    departmentId: string
    start: Date
    end: Date
    departmentName: string
    plan: DepartmentUserPlan[]
}

interface DepartmentStatisticsVm {
    projects: ProjectStatisticsVm[]
}

interface ProjectStatisticsVm {
    id: number
    name: string
    plannedTaskHoursForDepartment: number
    plannedTaskHoursByDepartment: number
    deltaHours: number
}

export const DepartmentPlanStatistics: React.FunctionComponent<DepartmentPlanStatisticsProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showStatistics = useAppSelector(state => state.departmentPlanReducer.showStatistics)
    const { request } = useHttp()

    const [projectStatistics, setProjectStatistics] = useState<ProjectStatisticsVm[]>([])
    const [hoursInWeeks, setHoursInWeeks] = useState<number>(0)
    //const [totalHoursForDepartment, setTotalHoursForDepartment] = useState<number>(0)
    //const [totalHoursByDepartment, setTotalHoursByDepartment] = useState<number>(0)

    const onClose = () => {
        dispatch(toggleShowStatistics())
    }

    useEffect(() => {
        if (!showStatistics) {
            return
        }

        request(`/api/v1/departments/${props.departmentId}/${dateToRequestStr(props.start)}/${dateToRequestStr(props.end)}/statistics`,
            "GET",
            null,
            [{ name: 'Content-Type', value: 'application/json' }])
            .then(data => setProjectStatistics((data as DepartmentStatisticsVm).projects))


        calcPlannedHours()
    }, [showStatistics])

    const getEmployeeNumber = (): number => {
        return props.plan?.map(i => i.rate)?.reduce((p, c) => { return p + c })
    }

    const calcPlannedHours = () => {
        let mondaysCount = 0
        const dt = props.start
        while (dt < props.end) {
            if (dt.getDay() === 1) {
                mondaysCount += 1
            }

            dt.setDate(dt.getDate() + 1)
        }

        setHoursInWeeks(mondaysCount * 8 * 5 * getEmployeeNumber())
    }

    if (projectStatistics.length === 0) {
        return <></>
    }

    return (
        <div>
            <Dialog
                scroll="paper"
                maxWidth="lg"
                PaperProps={{ style: { minHeight: "90%", maxHeight: "90%", minWidth: "95%", maxWidth: "95%" } }}
                open={showStatistics}
                onClose={e => onClose()}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    id="responsive-dialog-title">
                    {props.departmentName}. {t('statistics')}
                </DialogTitle>
                <Divider />
                <DialogContent
                    style={{ overflowX: "hidden" }}>
                    <div>
                        <h4 style={{ marginTop: 0 }}>
                            {t('info')}
                        </h4>
                        <ul>
                            <li>
                                {t('period')}: {t('from')} {dateAsShortStr(props.start)} {t('to')} {dateAsShortStr(props.end)}
                            </li>
                            <li>
                                {t('available-time-for-planning')}: {formatNumber(hoursInWeeks)}{t('hour')} ({t('employees')} = {getEmployeeNumber()},  {t('weeks')} = {hoursInWeeks / 40 / getEmployeeNumber()})
                            </li>
                            <li>
                                {t('project-plan-time')}: {formatNumber(projectStatistics.map(i => i.plannedTaskHoursForDepartment)?.reduce((p, c) => { return p + c }))}{t('hour')}
                            </li>
                            <li>
                                {t('department-plan-time')}: {formatNumber(projectStatistics.map(i => i.plannedTaskHoursByDepartment)?.reduce((p, c) => { return p + c }))}{t('hour')}
                            </li>
                        </ul>
                        <h4>
                            Детализация по проектам
                        </h4>
                        <HotTable
                            style={{ width: "80%" }}
                            columnSorting={true}
                            data={projectStatistics}
                            colHeaders={["Id", t('project'), t('project-plan-time') + ", " + t('hour'), t('department-plan-time') + ", " + t('hour'), t('difference') + ", " + t('hour')]}
                            fillHandle={false}
                            manualRowMove={false}
                            manualColumnMove={false}
                            wordWrap={true}
                            manualColumnResize={true}
                            licenseKey='non-commercial-and-evaluation'
                        >
                            <HotColumn data={"id"} className='htCenter' readOnly type={"text"} />
                            <HotColumn data={"name"} readOnly renderer={StatisticsProjectNameCellRenderer} />
                            <HotColumn data={"plannedTaskHoursForDepartment"} className='htCenter' readOnly type={"text"} />
                            <HotColumn data={"plannedTaskHoursByDepartment"} className='htCenter' readOnly type={"text"} />
                            <HotColumn data={"deltaHours"} readOnly renderer={TimeDeltaCellRenderer} />
                        </HotTable>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        size='small'
                        variant="contained"
                        onClick={e => onClose()}>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

