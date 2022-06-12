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

type ProjectDetailsToolBarProps = {
    scrollToTheLastRowFunc: (rowIdx: number) => void
}

export const ProjectDetailsToolBar: React.FunctionComponent<ProjectDetailsToolBarProps> = ({ scrollToTheLastRowFunc }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showDetails = useAppSelector(state => state.projectDetailsReducer.showDetails)
    const compactMode = useAppSelector(state => state.projectDetailsReducer.compactMode)
    const projectShortName = useAppSelector(state => state.projectDetailsReducer.project.shortName)
    const selectedRowIdx = useAppSelector(state => state.projectDetailsReducer.selectedRowIdx)
    const lastSelectedRowIdx = useAppSelector(state => state.projectDetailsReducer.lastSelectedRowIdx)
    const { request } = useHttp()

    const onAddNewTask = () => {
        async function getData() {
            let defaultTaskEstimations = await request<IProjectTaskDepartmentEstimationVm[]>("/api/v1/projects/defaultEstimations")
            dispatch(addTask({ defaultEstimations: defaultTaskEstimations }))
        }
        getData()
        window.scrollTo(0, document.body.scrollHeight)
    }

    return (
        <>
            <Grid container  >
                <Grid item xs={12} >
                    <Stack direction="row" spacing={1} paddingTop={1} paddingBottom={1}>
                        <Typography variant='h6' style={{ maxWidth: "200px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{projectShortName}</Typography>
                        <Button variant='contained' size='small' onClick={e => { onAddNewTask() }} startIcon={<PlaylistAddIcon />}>{t('add')}</Button>
                        <Button variant='contained' size='small' onClick={e => { dispatch(removeTask()) }} disabled={selectedRowIdx < 0} startIcon={<RemoveIcon />}>{t('remove')}</Button>
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
                //scrollToTheLastRowFunc(lastSelectedRowIdx)
            }} />
        </>
    )
}