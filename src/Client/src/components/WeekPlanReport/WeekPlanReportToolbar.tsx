import { Button, Grid, Stack, TextField, Typography } from "@mui/material"
import { useTranslation } from "react-i18next";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { dateAsShortStr } from "../../common/dateFormatter";
import moment from "moment";
import { DatePicker } from "@mui/lab";

export type WeekSummaryProps = {
    week: Date,
    setWeek: (arg: Date) => void
}

export const WeekPlanReportToolbar: React.FunctionComponent<WeekSummaryProps> = ({ week, setWeek }) => {
    const { t } = useTranslation()

    const onWeekChangedByArrowButtons = (direction: number) => {
        if (!week) {
            return
        }

        let dt = new Date(week)
        dt.setDate(dt.getDate() + 7 * direction)

        setWeek(dt)
    }

    const onWeekChangedByDatetimePicker = (newValue: number | null | undefined, keyboardInputValue?: string) => {
        if (!newValue) {
            return
        }

        // get nearest monday
        let dt = new Date(newValue)
        while (dt.getDay() !== 1) {
            dt.setDate(dt.getDate() - 1)
        }

        setWeek(dt)
    }

    if (!week) {
        return <></>
    }

    return <div>

        <div style={{
            position: "fixed", top: "5em", background: "white", zIndex: 99,
            height: "3em", paddingTop: "8px", marginTop: "-20px", width: "100%", marginLeft: "-1em", paddingLeft: "2em"
        }}>
            <Grid container>
                <Grid item xs={12}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        <Typography
                            variant='h6'
                            style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                            {t('week-plan')} #{moment(week).format('W')}
                        </Typography>
                        <DatePicker
                            views={['day']}
                            label={t('start')}
                            inputFormat="yyyy-MM-DD"
                            value={week}
                            onChange={onWeekChangedByDatetimePicker}
                            renderInput={(params) =>
                                <TextField
                                    sx={{ width: 170 }}
                                    size="small"
                                    {...params}
                                />}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => { onWeekChangedByArrowButtons(-1) }}
                            startIcon={<ArrowLeftIcon />}
                        >
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => { onWeekChangedByArrowButtons(+1) }}
                            startIcon={<ArrowRightIcon />}
                        >
                        </Button>

                    </Stack>
                </Grid>
            </Grid>
        </div>
    </div>
}