import HotTable from "@handsontable/react";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { DepartmentUserPlan, DepartmentPlanUserRecordVm } from "../models/DepartmentPlan/DepartmentPlanClasses";
import { DepartmentPlanHelper } from "../models/DepartmentPlan/DepartmentPlanHelper";
import moment from "moment";
import { DepartmentPlanToolbar } from "../components/DepartmentPlan/DepartmentPlanToolbar";
import { ServicesStorageHelper } from "../common/servicesStorageHelper";
import { Legend } from "../components/DepartmentPlan/Legend";
import { MemorizedScheduleTable, ScheduleTable } from "../components/DepartmentPlan/ScheduleTable";
import { useAppSelector } from "../hooks/redux.hook";

const initPlan: DepartmentUserPlan[] = [{
    id: '',
    userName: '',
    userPosition: '',
    project: '',
    hours: '',
    rate: 0,
    tooltip: '',
    weeksAvailabilityMap: [],
    __children: [],
}]

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string, name?: string }>()!.id
    const departmentName = useParams<{ id?: string, name?: string }>()!.name

    const { request } = useHttp()
    const navigate = useNavigate()

    // unfortunately, we must store the state locally because passing such an amount of records to redux causes low performance even the records will be frozen
    const [plan, setPlan] = useState<DepartmentUserPlan[]>(initPlan)

    // workaround for passing a navigate function to ProjectNameCellRenderer that cannot be extended by adding new props without changing the source code of the component
    ServicesStorageHelper.navigateFunction = (arg: string) => { navigate(arg) }

    const startDate = useAppSelector(state => state.departmentPlanReducer.startDate)
    const endDate = useAppSelector(state => state.departmentPlanReducer.endDate)

    useEffect(() => {
        request<DepartmentPlanUserRecordVm[]>(`/api/v1/departments/${departmentId}/${moment(startDate).format("YYYY-MM-DD")}/${moment(endDate).format("YYYY-MM-DD")}/plan`, 'GET')
            .then(depPlan => {
                const flatPlan = DepartmentPlanHelper.buildFlatPlan(depPlan)
                setPlan(flatPlan)
            })
    }, [])

    console.log('render main')

    return (
        <div
            className='page-container'>
            <DepartmentPlanToolbar
                departmentName={departmentName as string}
                departmentId={departmentId as string}
                plan={plan}
            ></DepartmentPlanToolbar>
            <div
                style={{ marginTop: "8em" }}>
                <ScheduleTable
                    departmentId={departmentId as string}
                    departmentName={departmentName as string}
                    plan={plan}
                />
                <Legend />
            </div>
        </div>
    )
}
