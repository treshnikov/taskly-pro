import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dateToRequestStr } from "../../common/dateFormatter";
import { useHttp } from "../../hooks/http.hook";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { DayInfoVm } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { toggleShowUserHolidays } from "../../redux/departmentPlanSlice";
import { UserHolidays } from "./UserHolidays";

export type UserInfoProps = {
    start: number
    end: number
}

export const UserInfo: React.FunctionComponent<UserInfoProps> = (props) => {
    const { t } = useTranslation();
    const { request } = useHttp()
    const dispatch = useAppDispatch()
    const showUserHolidays = useAppSelector(state => state.departmentPlanReducer.showUserHolidays)
    const showUserHolidaysUserName = useAppSelector(state => state.departmentPlanReducer.showUserHolidaysUserName)
    const [days, setDays] = useState<DayInfoVm[]>([])
    const [selectedTab, setSelectedTab] = useState('10');

    const tabStyle = { border: 0, color: "#373737" }

    const selectedTabChanged = (e: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    }

    const onClose = () => {
        dispatch(toggleShowUserHolidays(""))
    }

    useEffect(() => {
        if (!showUserHolidays) {
            return
        }

        const startDate = new Date(props.start)
        startDate.setMonth(0)
        startDate.setDate(1)
        
        const endDate = new Date(props.end)
        endDate.setMonth(11)
        endDate.setDate(31)

        request<DayInfoVm[]>(`/api/v1/users/${showUserHolidaysUserName}/days/${dateToRequestStr(startDate)}/${dateToRequestStr(endDate)}`,
            "GET", null, [{ name: 'Content-Type', value: 'application/json' }])
            .then(data => {
                setDays(data)
            })

    }, [showUserHolidays])

    return (
        <div>
            <Dialog
                scroll="paper"
                maxWidth="lg"
                PaperProps={{ style: { minHeight: "90%", maxHeight: "90%", minWidth: "95%", maxWidth: "95%" } }}
                open={showUserHolidays}
                onClose={e => onClose()}
                aria-labelledby="usrHolidays_"
            >
                <DialogTitle
                    id="usrHolidays_">
                    {showUserHolidaysUserName}
                </DialogTitle>
                <Divider />
                <DialogContent
                    sx={{ padding: 0 }}>
                    <TabContext
                        value={selectedTab}>
                        <Box
                            sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList
                                onChange={selectedTabChanged}>
                                <Tab
                                    label={t('non-working-days')}
                                    style={tabStyle}
                                    value="10" />
                            </TabList>
                        </Box>
                        <TabPanel value="10">
                            <UserHolidays
                                start={props.start}
                                end={props.end}
                                days={days} />
                        </TabPanel>
                    </TabContext>
                </DialogContent>
                <DialogActions>
                    <Button
                        size='small'
                        variant="contained"
                        onClick={e => onClose()}>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}