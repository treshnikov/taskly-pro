import { DatePicker } from "@mui/lab"
import { Box, Button, Divider, FormControl, Grid, InputLabel, Menu, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { RefObject, useEffect, useState } from "react";
import HotTable from "@handsontable/react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { setCollapsedRows, setEndDate, setHiddenRows, setStartDate, toggleShowStatistics } from "../../redux/departmentPlanSlice";
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { DepartmentPlanHelper } from "../../models/DepartmentPlan/DepartmentPlanHelper";
import { toast } from 'react-toastify'
import BarChartIcon from '@mui/icons-material/BarChart';
import { DepartmentPlanStatistics } from "./DepartmentPlanStatistics";

type ProjectSelectItem = {
    id: string,
    name: string
}

type DepartmentPlanToolbarProps = {
    hotTableRef: RefObject<HotTable>,
    departmentName: string,
    departmentId: string,
    plan: DepartmentUserPlan[]
}

export const DepartmentPlanToolbar: React.FunctionComponent<DepartmentPlanToolbarProps> = ({ hotTableRef, departmentName, departmentId, plan }) => {
    const { request } = useHttp()
    const { t } = useTranslation()

    const dispatch = useAppDispatch()
    const startDate = useAppSelector(state => state.departmentPlanReducer.startDate)
    const endDate = useAppSelector(state => state.departmentPlanReducer.endDate)
    const collapsedRows = useAppSelector(state => state.departmentPlanReducer.collapsedRows)

    const projectsWithEstimation: ProjectSelectItem = { id: 'projects-with-estimation', name: t('projects-with-estimation') }
    const allProjectsItem: ProjectSelectItem = { id: 'all-projects', name: t('all-projects') }
    const [projectFilter, setprojectFilter] = useState<string>(projectsWithEstimation.id);
    const [projectSelectItems, setProjectSelectItems] = useState<ProjectSelectItem[]>([])

    const onProjectFilterChanged = (event: SelectChangeEvent) => {
        const projId = event.target.value as string
        setprojectFilter(projId)

        if (projId === allProjectsItem.id) {
            // workaround to avoid freezing of select mui component in Firefox
            setTimeout(() => {
                updateHiddenRows([])
            }, 0)
            return
        }

        if (projId === projectsWithEstimation.id) {
            // workaround to avoid freezing of select mui component in Firefox
            setTimeout(() => {
                updateHiddenRows(DepartmentPlanHelper.getProjectRows(plan, i => !i.hours))
            }, 0)
            return
        }

        // workaround to avoid freezing of select mui component in Firefox
        setTimeout(() => {
            updateHiddenRows(DepartmentPlanHelper.getProjectRows(plan, i => i.projectId.toString() !== projId))
        }, 0)
    };

    const collapseAllRows = (): void => {
        if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.collapseAll()
        }
    }

    const expandAllRows = (): void => {
        if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.expandAll()
        }
    }

    const saveChanges = async () => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return;
        }
        const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any;
        const collapsedRows: number[] = plugin.collapsingUI.collapsedRows as number[];
        dispatch(setCollapsedRows(collapsedRows))
        const data = DepartmentPlanHelper.preparePlanFToSendToServer(plan, new Date(startDate));

        // using hooks causes render and the table renders all its rows expanded 
        // even if they were collapsed previously  
        // this fact brings us to a need to save and restore collapsed rows
        await request("/api/v1/departments/plan", "POST",
            { departmentId: departmentId, data: data },
            [{ name: 'Content-Type', value: 'application/json' }]);

        toast.success(t('changes-saved'))

        plugin.collapsingUI.collapseMultipleChildren(collapsedRows);
    };

    const toogleDepartmentStatisticsForm = () => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return;
        }
        const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any;
        const currentCollapsedRows: number[] = plugin.collapsingUI.collapsedRows as number[];
        
        dispatch(setCollapsedRows(currentCollapsedRows))
        dispatch(toggleShowStatistics())

        setTimeout(() => {
            plugin.collapsingUI.collapseMultipleChildren(currentCollapsedRows);
        }, 4000);
    }

    const updateHiddenRows = (hiddenRows: number[]) => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return;
        }
        const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any;
        const collapsedRows: number[] = plugin.collapsingUI.collapsedRows as number[];
        dispatch(setCollapsedRows(collapsedRows))
        dispatch(setHiddenRows(hiddenRows))

        setTimeout(() => {
            plugin.collapsingUI.collapseMultipleChildren(collapsedRows);
        }, 100);
    }

    useEffect(() => {
        // extract list of all projects bounded with the given department
        if (plan.length > 0 && plan[0].__children.length > 0) {
            const depProjects = plan[0].__children.map(i => {
                const p: ProjectSelectItem = {
                    name: i.project,
                    id: i.projectId.toString()
                }
                return p
            })

            setProjectSelectItems(depProjects)
        }
    }, [plan])

    return <div>
        <div style={{ position: "fixed", top: "5em", left: "1em" }}>
            <Grid container>
                <Grid item xs={12}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        <Typography variant='h6' style={{ maxWidth: "200px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{departmentName}</Typography>

                        <DatePicker
                            views={['day']}
                            label={t('start')}
                            inputFormat="yyyy-MM-DD"
                            value={startDate}
                            onChange={(newValue) => { if (newValue) { dispatch(setStartDate(new Date(newValue))) } }}
                            renderInput={(params) =>
                                <TextField
                                    sx={{ width: 145 }}
                                    size="small"
                                    {...params}
                                />}
                        />
                        <DatePicker
                            views={['day']}
                            label={t('end')}
                            inputFormat="yyyy-MM-DD"
                            value={endDate}
                            onChange={(newValue) => { if (newValue) { dispatch(setEndDate(new Date(newValue))) } }}
                            renderInput={(params) => <TextField sx={{ width: 145 }} size="small" {...params} />}
                        />
                        <Box sx={{ width: 250 }}>
                            <FormControl fullWidth>
                                <InputLabel id="projectLabelId">{t('project')}</InputLabel>
                                <Select
                                    size="small"
                                    labelId="projectLabelId"
                                    id="demo-simple-select"
                                    value={projectFilter}
                                    label={t('project')}
                                    onChange={onProjectFilterChanged}
                                >
                                    <MenuItem
                                        value={projectsWithEstimation.id}>
                                        {projectsWithEstimation.name}
                                    </MenuItem>
                                    <MenuItem
                                        value={allProjectsItem.id}>
                                        {allProjectsItem.name}
                                    </MenuItem>
                                    <Divider />
                                    {
                                        projectSelectItems.map(i => {
                                            return (
                                                <MenuItem
                                                    key={"projSelect" + i.id}
                                                    value={i.id}>
                                                    {i.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<SaveAltIcon />}
                            onClick={saveChanges}>
                            {t('save')}
                        </Button>

                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddBoxIcon />}
                            onClick={e => { expandAllRows() }}>
                            {t('expand')}
                        </Button>

                        <Button variant="contained" size="small" startIcon={<IndeterminateCheckBoxIcon />}
                            onClick={e => { collapseAllRows() }}>
                            {t('collapse')}
                        </Button>

                        <Button
                            variant='contained'
                            size='small'
                            onClick={e => { toogleDepartmentStatisticsForm() }}
                            startIcon={<BarChartIcon />}>
                            {t('statistics')}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </div>
        <DepartmentPlanStatistics 
            departmentId={departmentId} 
            departmentName={departmentName} 
            start={new Date(startDate)} 
            end={new Date(endDate)} 
            plan={plan}/>
    </div>

}