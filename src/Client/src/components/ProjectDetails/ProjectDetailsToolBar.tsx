import { Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { zoomInGanttChart, zoomOutGanttChart, toggleShowDetails, addTask } from '../../redux/projectDetailsSlice';
import { useTranslation } from "react-i18next";

type ProjectDetailsToolBarProps = {
    scrollToTheLastRowFunc: () => void
}

export const ProjectDetailsToolBar: React.FunctionComponent<ProjectDetailsToolBarProps> = ({ scrollToTheLastRowFunc }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showDetails = useAppSelector(state => state.projectDetailsReducer.showDetails)
    const projectShortName = useAppSelector(state => state.projectDetailsReducer.project.shortName)

    return (
        <Grid container  >
            <Grid item xs={6} >
                <Stack direction="row" spacing={1} paddingTop={1} paddingBottom={1}>
                    <Button variant='contained' size='small'
                        onClick={e => {
                            dispatch(addTask())
                            scrollToTheLastRowFunc()
                        }} startIcon={<PlaylistAddIcon />}>{t('add')}</Button>
                    <Button variant='contained' size='small' startIcon={<BarChartIcon />}>{t('statistics')}</Button>
                    <FormControlLabel label={t('show-details')} control={<Checkbox checked={showDetails} onChange={e => { dispatch(toggleShowDetails()) }} size='small' />} />
                </Stack>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }} paddingTop={1} paddingBottom={1}>
                <Stack direction="row" paddingTop={1} paddingBottom={1} justifyContent="flex-end" >
                    <Button variant='text' size='small' startIcon={<ZoomInIcon />} onClick={e => { dispatch(zoomInGanttChart()) }} ></Button>
                    <Button variant='text' size='small' startIcon={<ZoomOutIcon />} onClick={e => { dispatch(zoomOutGanttChart()) }} ></Button>
                    <Typography variant='h5'>{projectShortName}</Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}