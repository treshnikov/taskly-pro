import HotTable, { HotColumn } from "@handsontable/react";
import { CellChange, ChangeSource } from "handsontable/common";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ProjectNameRenderer } from "../components/DepartmentPlan/Renderers/ProjectNameRenderer";
import { useHttp } from "../hooks/http.hook";
import { DepartmentPlanFlatRecordVm, DepartmentPlanFlatRecordVmHelper, DepartmentPlanUserRecordVm } from "../models/DepartmentPlan/DepartmentPlanClasses";

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string }>()!.id
    const { request } = useHttp()
    const { t } = useTranslation();
    const [plan, setPlan] = useState<DepartmentPlanUserRecordVm[]>([])
    const [flatPlan, setFlatPlan] = useState<DepartmentPlanFlatRecordVm[]>([])
    const [headers, setHeaders] = useState<string[]>([])

    useEffect(() => {
        async function fetchData() {
            //todo pass start and end date
            const depPlan = await request<DepartmentPlanUserRecordVm[]>(`/api/v1/departments/${departmentId}/2022-01-01/2022-12-31/plan`, 'GET')
            setPlan(depPlan)
        }
        fetchData()
    }, [])

    useEffect(() => {
        // build headers
        let headers: string[] = ["User", "Position", "Project"]
        const weekCount = (plan.length > 0 && plan[0].projects.length > 0)
            ? plan[0].projects[0].plans.length
            : 0
        headers = headers.concat(Array.from(Array(weekCount).keys()).map(i => new Date(plan[0].projects[0].plans[i].weekStart).toLocaleDateString()))
        setHeaders(headers)

        // build flat plan
        const flatPlan = DepartmentPlanFlatRecordVmHelper.buildFlatPlan(plan)
        setFlatPlan(flatPlan)
        console.log(flatPlan)
    }, [plan])


    return (
        <div className='page-container'>
            DepartmentDetailedPlan {departmentId}
            <br />
            <HotTable
                id="projectDetailsTable"
                data={flatPlan}
                colHeaders={headers}
                columnSorting={false}
                rowHeaders={true}
                nestedRows={true}
                renderAllRows={true}
                manualRowMove={true}
                wordWrap={true}
                fillHandle={false}
                manualColumnResize={true}

                afterSelection={(row: number, column: number, row2: number, column2: number, preventScrolling: { value: boolean }, selectionLayerLevel: number) => {
                    preventScrolling.value = true
                }}

                beforeChange={(changes: CellChange[], source: ChangeSource) => {
                    //dispatch(onTaskAttributeChanged(changes))
                    return false
                }}

                beforeRowMove={(movedRows: number[], finalIndex: number, dropIndex: number | undefined, movePossible: boolean) => {
                    // dispatch(onTasksMoved({ movedRows, finalIndex }))
                    // scrollToRow(finalIndex)
                    return false
                }}

                afterSelectionEnd={(row: number, column: number, row2: number, column2: number, selectionLayerLevel: number) => {
                    //dispatch(onRowSelected(row))
                }}

                afterDeselect={() => {
                    // to allow capturing selectedRowIdx for dialog windows
                    // setTimeout(() => {
                    //     dispatch(onRowSelected(-1))
                    // }, 200);
                }}

                afterRender={(isForced: boolean) => {
                    // setTimeout(() => {
                    //     const tableHeight = document.querySelector<HTMLElement>(".htCore")?.offsetHeight
                    //     setTableHeight(50 + (tableHeight as number))
                    // }, 500);
                }}
                outsideClickDeselects={true}
                licenseKey='non-commercial-and-evaluation'
            >
                <HotColumn data={"userName"} wordWrap={false} type={"text"} />
                <HotColumn data={"userPosition"} wordWrap={false} type={"text"} />
                <HotColumn data={"project"} readOnly />

                {
                    headers.slice(3).map((header, idx) => {
                        return (<HotColumn data={"week" + (idx + 1).toString()} type={"text"} />)
                    })
                }


            </HotTable>
            {/* <pre>
                {JSON.stringify(plan, null, 2)}
            </pre> */}
        </div>)
}