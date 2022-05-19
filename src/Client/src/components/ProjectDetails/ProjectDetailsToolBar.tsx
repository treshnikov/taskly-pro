import { Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from "@mui/material"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ganttZoomIn, ganttZoomOut, toggleShowDetails } from '../../redux/projectDetailsSlice';

export const ProjectDetailsToolBar: React.FunctionComponent = () => {
    const dispatch = useAppDispatch()
    const showDetails = useAppSelector(state => state.projectDetailsReducer.showDetails)
    const projectShortName = useAppSelector(state => state.projectDetailsReducer.projectShortName)
    return (
        <Grid container  >
            <Grid item xs={8} >
                <Stack direction="row" spacing={1} paddingTop={1} paddingBottom={1}>
                    <Button variant='contained' size='small' startIcon={<PlaylistAddIcon />}>Add</Button>
                    <Button variant='contained' size='small' startIcon={<BarChartIcon />}>Statistics</Button>
                    <Button variant='contained' size='small' startIcon={<ZoomInIcon />} onClick={e => { dispatch(ganttZoomIn()) }} >Zoom in</Button>
                    <Button variant='contained' size='small' startIcon={<ZoomOutIcon />} onClick={e => { dispatch(ganttZoomOut()) }} >Zoom out</Button>
                    <FormControlLabel label="Show details" control={<Checkbox checked={showDetails} onChange={e => { dispatch(toggleShowDetails()) }} size='small' />} />
                </Stack>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }} paddingTop={1} paddingBottom={1}>
                <Typography variant='h5'>{projectShortName}</Typography>
            </Grid>
        </Grid>
    )
}