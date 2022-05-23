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

    return (
        <Grid container  >
            <Grid item xs={8} >
                <Stack direction="row" spacing={1} paddingTop={1} paddingBottom={1}>
                    <Button variant='contained' size='small'
                        onClick={e => {
                            dispatch(addTask())
                            window.scrollTo(0, document.body.scrollHeight)
                        }} startIcon={<PlaylistAddIcon />}>{t('add')}</Button>
                    <Button variant='contained' size='small' onClick={e => {dispatch(removeTask())}} disabled={selectedRowIdx < 0} startIcon={<RemoveIcon />}>{t('remove')}</Button>
                    <Button variant='contained' size='small' onClick={e => {dispatch(orderTasks())}} startIcon={<SortIcon />}>{t('order-tasks')}</Button>
                    <Button variant='contained' size='small' onClick={e => {dispatch(toggleShowDepartmentsPlan())}} disabled={selectedRowIdx < 0} startIcon={<BarChartIcon />}>{t('units')}</Button>
                    <Button variant='contained' size='small' onClick={e => {dispatch(toggleShowStatistics())}} startIcon={<BarChartIcon />}>{t('statistics')}</Button>
                    <FormControlLabel label={t('compact-mode')} control={<Checkbox checked={compactMode} onChange={e => { dispatch(toggleCompactMode()) }} size='small' />} />
                    <FormControlLabel label={t('show-details')} disabled={compactMode} control={<Checkbox checked={showDetails} onChange={e => { dispatch(toggleShowDetails()) }} size='small' />} />
                </Stack>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }} paddingTop={0} paddingBottom={1}>
                <Stack direction="row" paddingTop={1} paddingBottom={1} justifyContent="flex-end" >
                    <Button variant='text' size='small' startIcon={<ZoomInIcon />} onClick={e => { dispatch(zoomInGanttChart()) }} ></Button>
                    <Button variant='text' size='small' startIcon={<ZoomOutIcon />} onClick={e => { dispatch(zoomOutGanttChart()) }} ></Button>
                    <Typography variant='h5' style={{whiteSpace: "nowrap"}}>{projectShortName}</Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}