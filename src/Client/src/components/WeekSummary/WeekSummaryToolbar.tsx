import { Button, Grid, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { useEffect, useState } from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { dateAsShortStr } from "../../common/dateFormatter";
import moment from "moment";

export type WeekSummaryProps = {
    week: Date,
    setWeek: (arg: Date) => void
}

export const WeekSummaryToolbar: React.FunctionComponent<WeekSummaryProps> = ({ week, setWeek }) => {
    const { request } = useHttp()
    const { t } = useTranslation()

    const onWeekChanged = (direction: number) => {
        if (!week) {
            return
        }

        let dt = new Date(week)
        dt.setDate(dt.getDate() + 7 * direction)

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
                            {t('week-summary')} #{moment(week).format('W')} {dateAsShortStr(week)}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => { onWeekChanged(-1) }}
                            startIcon={<ArrowLeftIcon />}
                        >
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => { onWeekChanged(+1) }}
                            startIcon={<ArrowRightIcon />}
                        >
                        </Button>

                    </Stack>
                </Grid>
            </Grid>
        </div>
    </div>
}