import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dateToRequestStr } from "../../common/dateFormatter";
import { useHttp } from "../../hooks/http.hook";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { toggleShowStatistics } from "../../redux/departmentPlanSlice";
import { ProjectPlanToDepartmentPlanBarChart } from "./ProjectPlanToDepartmentPlanBarChart";
import { StatisticsSummary } from "./StatisticsSummary";
import { ProjectStatisticsTable } from "./ProjectStatisticsTable";
import { DepartmentStatisticsSummary, DepartmentStatisticsVm, ProjectStatisticsVm, WeekStatistics as WeekStatistics } from "../../models/DepartmentPlan/DepartmentPlanStatisticsClasses";
import { ProjectsPieChart } from "./ProjectsPieChart";

export type DepartmentPlanStatisticsProps = {
    departmentId: string
    start: number
    end: number
    departmentName: string
    plan: DepartmentUserPlan[]
}

export const DepartmentPlanStatistics: React.FunctionComponent<DepartmentPlanStatisticsProps> = (props) => {
    const { t } = useTranslation();
    const { request } = useHttp()
    const dispatch = useAppDispatch()
    const showStatistics = useAppSelector(state => state.departmentPlanReducer.showStatistics)

    const [projectStatistics, setProjectStatistics] = useState<ProjectStatisticsVm[]>([])
    const [weeksStatistics, setWeeksStatistics] = useState<WeekStatistics[]>([])
    const [selectedTab, setSelectedTab] = useState('1');
    const [statisticsSummary, setStatisticSummary] = useState<DepartmentStatisticsSummary>({start: 0, end: 0, availableHoursForPlanning: 0, hoursPlannedForDepartment: 0, hoursPlannedByHeadOfDepartment: 0, workLoadPercentage: 0, externalProjectsRateInPercentage: 0})

    const selectedTabChanged = (e: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    }

    const onClose = () => {
        dispatch(toggleShowStatistics())
    }

    const tabStyle = { border: 0, color: "#373737" }

    useEffect(() => {
        if (!showStatistics) {
            return
        }

        setSelectedTab('1')
        request(`/api/v1/departments/${props.departmentId}/${dateToRequestStr(new Date(props.start))}/${dateToRequestStr(new Date(props.end))}/statistics`,
            "GET", null, [{ name: 'Content-Type', value: 'application/json' }], false)
            .then(data => {
                const statistics = (data as DepartmentStatisticsVm)
                setProjectStatistics(statistics.projects)
                setWeeksStatistics(statistics.weeks)
                setStatisticSummary(statistics.summary)
            })

    }, [showStatistics])

    return (
        <div>
            <Dialog
                scroll="paper"
                maxWidth="lg"
                PaperProps={{ style: { minHeight: "90%", maxHeight: "90%", minWidth: "95%", maxWidth: "95%" } }}
                open={showStatistics}
                onClose={e => onClose()}
                aria-labelledby="depStat"
            >
                <DialogTitle
                    id="depStat">
                    {props.departmentName}. {t('statistics')}
                </DialogTitle>
                <Divider />
                <DialogContent
                    sx={{ padding: 0 }}>
                    <TabContext
                        value={selectedTab}>
                        <Box
                            sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList
                                onChange={selectedTabChanged}>
                                <Tab
                                    label={t('info')}
                                    style={tabStyle}
                                    value="1" />
                                <Tab
                                    label={t('plans')}
                                    style={tabStyle}
                                    value="3" />
                                <Tab
                                    label={t('projects')}
                                    style={tabStyle}
                                    value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <StatisticsSummary
                                summary={statisticsSummary}
                            />
                        </TabPanel>
                        <TabPanel value="2">
                            <ProjectStatisticsTable
                                projectStatistics={projectStatistics} />
                        </TabPanel>
                        <TabPanel value="3">
                            <ProjectPlanToDepartmentPlanBarChart
                                kind="projects"
                                weeks={weeksStatistics}
                                plan={props.plan} />
                            <div style={{ height: "50px" }} />
                            <ProjectPlanToDepartmentPlanBarChart
                                kind="department"
                                weeks={weeksStatistics}
                                plan={props.plan} />
                        </TabPanel>
                    </TabContext>
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