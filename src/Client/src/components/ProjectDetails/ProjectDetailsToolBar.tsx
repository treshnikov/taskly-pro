import { Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { zoomInGanttChart, zoomOutGanttChart, toggleShowDetails, addTask, removeTask, toggleCompactMode, orderTasks, toggleShowStatistics, toggleShowDepartmentsPlan } from '../../redux/projectDetailsSlice';
import { useTranslation } from "react-i18next";
import RemoveIcon from '@mui/icons-material/Remove';
import SortIcon from '@mui/icons-material/Sort';
import { ProjectDetailsDepartemntsPlan } from "./ProjectDetailsDepartemntsPlan";
import { ProjectDetailsStatistics } from "./ProjectDetailsStatistics";
import { useHttp } from "../../hooks/http.hook";
import { IProjectTaskDepartmentEstimationVm } from "../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm";
import { IProjectTaskVm } from "../../models/ProjectDetails/ProjectTaskVm";
import { RefObject, useEffect } from "react";
import HotTable from "@handsontable/react";

type ProjectDetailsToolBarProps = {
    hotTableRef: RefObject<HotTable>
}

export const ProjectDetailsToolBar: React.FunctionComponent<ProjectDetailsToolBarProps> = ({ hotTableRef }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showDetails = useAppSelector(state => state.projectDetailsReducer.showDetails)
    const compactMode = useAppSelector(state => state.projectDetailsReducer.compactMode)
    const projectShortName = useAppSelector(state => state.projectDetailsReducer.project.shortName)
    const selectedRowIdx = useAppSelector(state => state.projectDetailsReducer.selectedRowIdx)
    const lastSelectedRowIdx = useAppSelector(state => state.projectDetailsReducer.lastSelectedRowIdx)
    const projectId = useAppSelector(state => state.projectDetailsReducer.project.id)
    const project = useAppSelector(state => state.projectDetailsReducer.project)

    const { request } = useHttp()

    const selectRow = (rowIdx: number): void => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return
        }

        if (rowIdx < 0) {
            return
        }

        const lastRowIdx = hotTableRef.current.hotInstance.countRows() - 1
        if (rowIdx > lastRowIdx) {
            return
        }

        hotTableRef.current.hotInstance.selectCell(rowIdx, 1)
    }

    const selectLastRow = (): void => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return
        }

        selectRow(hotTableRef.current.hotInstance.countRows() - 1)
    }

    const onAddNewTask = () => {
        async function getData() {
            const newTask = await request<IProjectTaskVm>("/api/v1/projects/", "POST", projectId, [{ name: 'Content-Type', value: 'application/json' }])
            const defaultTaskEstimations = await request<IProjectTaskDepartmentEstimationVm[]>("/api/v1/projects/defaultEstimations")
            newTask.departmentEstimations = defaultTaskEstimations
            dispatch(addTask({ task: newTask }))
        }
        getData().then(i => {
            selectLastRow()
            window.scrollTo(0, document.body.scrollHeight)
        })
    }

    const onDeleteTask = () => {
        async function removeData() {
            const taskId = project.tasks[selectedRowIdx].id
            await request<IProjectTaskVm>("/api/v1/projects/", "DELETE", taskId, [{ name: 'Content-Type', value: 'application/json' }])
        }

        const idx = selectedRowIdx
        dispatch(removeTask())
        removeData().then(i => {
            selectRow(idx - 1 > 0 ? idx - 1 : 0)
        })
    }

    return (
        <div style={{ position: "fixed", top: "5em", left: "1em" }}>
            <Grid container  >
                <Grid item xs={12} >
                    <Stack direction="row" spacing={1} alignItems={"center"}>
                        <Typography variant='h6' style={{ maxWidth: "200px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{projectShortName}</Typography>
                        <Button variant='contained' size='small' onClick={e => { onAddNewTask() }} startIcon={<PlaylistAddIcon />}>{t('add')}</Button>
                        <Button variant='contained' size='small' onClick={e => { onDeleteTask() }} disabled={selectedRowIdx < 0} startIcon={<RemoveIcon />}>{t('remove')}</Button>
                        <Button variant='contained' size='small' onClick={e => { dispatch(orderTasks()) }} startIcon={<SortIcon />}>{t('order-tasks')}</Button>
                        <Button variant='contained' size='small' onClick={e => { dispatch(toggleShowDepartmentsPlan()) }} disabled={selectedRowIdx < 0} startIcon={<BarChartIcon />}>{t('departments')}</Button>
                        <Button variant='contained' size='small' onClick={e => { dispatch(toggleShowStatistics()) }} startIcon={<BarChartIcon />}>{t('statistics')}</Button>
                        <FormControlLabel label={t('compact-mode')} control={<Checkbox checked={compactMode} onChange={e => { dispatch(toggleCompactMode()) }} size='small' />} />
                        <FormControlLabel label={t('show-details')} disabled={compactMode} control={<Checkbox checked={showDetails} onChange={e => { dispatch(toggleShowDetails()) }} size='small' />} />
                        <Button variant='text' size='small' startIcon={<ZoomInIcon />} onClick={e => { dispatch(zoomInGanttChart()) }} ></Button>
                        <Button variant='text' size='small' startIcon={<ZoomOutIcon />} onClick={e => { dispatch(zoomOutGanttChart()) }} ></Button>
                    </Stack>
                </Grid>

            </Grid>
            <ProjectDetailsStatistics />
            <ProjectDetailsDepartemntsPlan afterClose={() => {
                if (lastSelectedRowIdx === -1) {
                    return
                }
            }} />
        </div>
    )
}