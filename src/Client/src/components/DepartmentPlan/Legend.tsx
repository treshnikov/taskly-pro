import { Divider, Stack } from "@mui/material"
import { useTranslation } from "react-i18next"
import { GOOD_PLANING_TIME_COLOR, NOT_ENOUGH_HOURS_PLANNED_COLOR, TOO_MANY_HOURS_PLANNED_COLOR, WEEK_HAS_NO_ASSIGNED_PROJECT_TASKS_COLOR } from "./DepartmentPlanConst"

export const Legend: React.FunctionComponent = () => {
    const { t } = useTranslation()

    const getLegendStyle = (color: string) => {
        return {
            background: color,
            width: "40px",
            height: "22px",
            border: "1px solid #ccc"
        }
    }

    const fontStyle = {
        fontSize: "11px",
        color: "#373737cc"
    }

    return <>
        <Stack direction={"row"} paddingTop={1} paddingRight={1} spacing={1} alignContent={"center"} alignItems={"center"}>

            <div
                style={getLegendStyle(GOOD_PLANING_TIME_COLOR)}>
            </div>
            <p style={fontStyle}>{t('work-planned')}</p>
            <Divider orientation="vertical" flexItem />

            <div
                style={getLegendStyle(NOT_ENOUGH_HOURS_PLANNED_COLOR)}>
            </div>
            <p style={fontStyle}>{t('not-enoght-hours-planned')}</p>
            <Divider orientation="vertical" flexItem />

            <div
                style={getLegendStyle(TOO_MANY_HOURS_PLANNED_COLOR)}>
            </div>
            <p style={fontStyle}>{t('planned-too-many-hours')}</p>
            <Divider orientation="vertical" flexItem />

            <div
                style={getLegendStyle(WEEK_HAS_NO_ASSIGNED_PROJECT_TASKS_COLOR)}>
            </div>
            <p style={fontStyle}>{t('no-plan-for-a-week')}</p>

        </Stack>
    </>
}