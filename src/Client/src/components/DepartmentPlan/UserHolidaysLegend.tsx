import { Divider, Stack } from "@mui/material"
import { useTranslation } from "react-i18next"
import { MATERNITY_LEAVE_DAY_BACKGROUND_COLOR, VACATION_BACKGROUND_COLOR } from "./DepartmentPlanConst"

export const UserHolidaysLegend: React.FunctionComponent = () => {
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
        <Stack direction={"row"} position={"fixed"} paddingTop={1} paddingRight={1} spacing={1} alignContent={"center"} alignItems={"center"}>

            <div
                style={getLegendStyle(VACATION_BACKGROUND_COLOR)}>
            </div>
            <p style={fontStyle}>{t('vacation')}</p>
            <Divider orientation="vertical" flexItem />

            <div
                style={getLegendStyle(MATERNITY_LEAVE_DAY_BACKGROUND_COLOR)}>
            </div>
            <p style={fontStyle}>{t('maternity-leave')}</p>

        </Stack>
    </>
}