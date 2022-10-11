import { Button, Grid, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { useEffect, useState } from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { dateAsShortStr } from "../../common/dateFormatter";
import moment from "moment";

export const WeekSummaryToolbar: React.FunctionComponent = (props) => {
    const { request } = useHttp()
    const { t } = useTranslation()
    const [week, setWeek] = useState<Date>()

    const onWeekChanged = (direction: number) => {
        if (!week)
        {
            return
        }

        let dt = new Date(week)
        dt.setDate(dt.getDate() + 7 * direction)

        setWeek(dt)
    }

    useEffect(() => {
        // get nearest monday
        let dt = new Date()
        while (dt.getDay() !== 1) {
            dt.setDate(dt.getDate() - 1)
        }
        setWeek(dt)
    }, [])

    useEffect(() => {
        if (!week)
        {
            return
        }

        // fetch week summary
    }, [week])


    if (!week)
    {
        return <></>
    }

    return <div>
        <div style={{ position: "fixed", top: "5em", left: "1em" }}>
            <Grid container>
                <Grid item xs={12}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        <Typography
                            variant='h6'
                            style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                            {t('week-summary')} #{moment(week).format('W')} {dateAsShortStr(week)}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {onWeekChanged(-1)}}
                            startIcon={<ArrowLeftIcon />}
                        >
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {onWeekChanged(+1)}}
                            startIcon={<ArrowRightIcon />}
                        >
                        </Button>

                    </Stack>
                </Grid>
            </Grid>
        </div>
    </div>
}