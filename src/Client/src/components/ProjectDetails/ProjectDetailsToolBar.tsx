import { Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { zoomInGanttChart, zoomOutGanttChart, addTask, removeTask, toggleCompactMode, orderTasks, toggleShowStatistics, toggleShowDepartmentsPlan } from '../../redux/projectDetailsSlice';
import { useTranslation } from "react-i18next";
import RemoveIcon from '@mui/icons-material/Remove';
import SortIcon from '@mui/icons-material/Sort';
import { ProjectDetailsDepartemntsPlan } from "./ProjectDetailsDepartemntsPlan";
import { ProjectDetailsStatistics } from "./ProjectDetailsStatistics";
import { useHttp } from "../../hooks/http.hook";
import { IProjectTaskDepartmentEstimationVm, ProjectTaskDepartmentEstimationVm } from "../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm";
import { ProjectTaskVm } from "../../models/ProjectDetails/ProjectTaskVm";
import { RefObject } from "react";
import HotTable from "@handsontable/react";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { generateGuid } from "../../common/guidGenerator";
import { dateAsShortStr } from "../../common/dateFormatter";
import { EstimationVm } from "../../models/ProjectDetails/EstimationVm";
import { toast } from 'react-toastify'

type ProjectDetailsToolBarProps = {
    hotTableRef: RefObject<HotTable>
}

export const ProjectDetailsToolBar: React.FunctionComponent<ProjectDetailsToolBarProps> = ({ hotTableRef }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const compactMode = useAppSelector(state => state.projectDetailsReducer.compactMode)
    const projectShortName = useAppSelector(state => state.projectDetailsReducer.project.shortName)
    const selectedRowIdx = useAppSelector(state => state.projectDetailsReducer.selectedRowIdx)
    const project = useAppSelector(state => state.projectDetailsReducer.project)

    const { request } = useHttp()

    const selectRow = (rowIdx: number): void => {
        if (rowIdx < 0 ||
            !hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance ||
            rowIdx > hotTableRef.current.hotInstance.countRows() - 1) {
            return
        }

        hotTableRef.current.hotInstance.selectCell(rowIdx, 1)
    }

    const selectLastRow = (): void => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return
        }

        const lastIdx = hotTableRef.current.hotInstance.countRows() - 1
        selectRow(lastIdx)
    }

    const onAddNewTask = () => {
        async function getData() {
            const newTask = new ProjectTaskVm()
            newTask.id = generateGuid()
            newTask.comment = "..."
            newTask.description = "..."
            newTask.totalHours = 0
            newTask.start = project.start
            newTask.end = project.end
            newTask.startAsStr = dateAsShortStr(new Date(project.start))
            newTask.endAsStr = dateAsShortStr(new Date(project.end))
            newTask.departmentEstimations = await request<IProjectTaskDepartmentEstimationVm[]>("/api/v1/projects/defaultEstimations")

            dispatch(addTask({ task: newTask }))
        }

        getData()
            .then(i => {
                selectRow(selectedRowIdx + 1)
            })
    }

    const onDeleteTask = () => {
        const idx = selectedRowIdx
        dispatch(removeTask())
        const newRowIdx = idx - 1 > 0 ? idx - 1 : 0
        selectRow(newRowIdx)
    }

    const saveChanges = async () => {
        const newTasks: ProjectTaskVm[] = []

        project.tasks.forEach(t => {
            const newTask: ProjectTaskVm =
            {
                id: t.id,
                comment: t.comment,
                description: t.description,
                totalHours: t.totalHours,
                start: t.start,
                end: t.end,
                startAsStr: t.startAsStr,
                endAsStr: t.endAsStr,
                departmentEstimations: []
            }

            t.departmentEstimations.filter(i => (i as IProjectTaskDepartmentEstimationVm).totalHours > 0).forEach(e => {
                const est = e as ProjectTaskDepartmentEstimationVm

                const newEst: ProjectTaskDepartmentEstimationVm = {
                    id: est.id,
                    departmentName: est.departmentName,
                    departmentId: est.departmentId,
                    departmentShortName: est.departmentShortName,
                    estimations: [],
                    lineHeight: est.lineHeight,
                    totalHours: est.totalHours,
                    color: est.color,
                    start: est.start,
                    end: est.end
                }

                est.estimations.forEach(ue => {
                    if ((ue as EstimationVm).hours > 0) {
                        const newUserEst = { ...ue as EstimationVm }
                        newEst.estimations.push(newUserEst)
                    }
                })

                newTask.departmentEstimations.push(newEst)
            })

            newTasks.push(newTask)
        })

        await request("/api/v1/projects/saveProjectChanges", "POST",
            { projectId: project.id, tasks: newTasks },
            [{ name: 'Content-Type', value: 'application/json' }]);

        toast.success(t('changes-saved'))
    }

    return (
        <div style={{ position: "fixed", top: "5em", left: "1em" }}>
            <Grid container  >
                <Grid item xs={12} >
                    <Stack direction="row" spacing={1} alignItems={"center"}>
                        <Typography variant='h6' style={{ maxWidth: "200px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{projectShortName}</Typography>
                        <Button variant="contained" size="small" startIcon={<SaveAltIcon />} onClick={saveChanges}> {t('save')}  </Button>
                        <Button variant='contained' size='small' onClick={e => { onAddNewTask() }} startIcon={<PlaylistAddIcon />}>{t('add')}</Button>
                        <Button variant='contained' size='small' onClick={e => { onDeleteTask() }} disabled={selectedRowIdx < 0} startIcon={<RemoveIcon />}>{t('remove')}</Button>
                        <Button variant='contained' size='small' onClick={e => { dispatch(orderTasks()) }} startIcon={<SortIcon />}>{t('order-tasks')}</Button>
                        <Button variant='contained' size='small' onClick={e => { dispatch(toggleShowDepartmentsPlan()) }} disabled={selectedRowIdx < 0} startIcon={<BarChartIcon />}>{t('estimation')}</Button>
                        <Button variant='contained' size='small' onClick={e => { dispatch(toggleShowStatistics()) }} startIcon={<BarChartIcon />}>{t('statistics')}</Button>
                        <FormControlLabel label={t('compact-mode')} control={<Checkbox checked={compactMode} onChange={e => { dispatch(toggleCompactMode()) }} size='small' />} />
                        <Button style={{ display: compactMode ? 'none' : 'inline' }} variant='text' size='small' startIcon={<ZoomInIcon />} onClick={e => { dispatch(zoomInGanttChart()) }} ></Button>
                        <Button style={{ display: compactMode ? 'none' : 'inline' }} variant='text' size='small' startIcon={<ZoomOutIcon />} onClick={e => { dispatch(zoomOutGanttChart()) }} ></Button>
                    </Stack>
                </Grid>

            </Grid>
            <ProjectDetailsStatistics />
            <ProjectDetailsDepartemntsPlan />
        </div>
    )
}