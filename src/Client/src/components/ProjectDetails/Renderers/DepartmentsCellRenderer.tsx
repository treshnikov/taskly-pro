import Handsontable from 'handsontable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { ProjectTaskDepartmentEstimationVm } from "../../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm";
import { toggleShowDepartmentsPlan } from '../../../redux/projectDetailsSlice';

export const DepartmentsCellRenderer2 = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const estimations = value as ProjectTaskDepartmentEstimationVm[]
    const estimationsToRender = estimations?.filter(i => i.totalHours > 0)

    td.innerText = ''

    if (estimationsToRender.length === 0) {
        const text = document.createElement("div")
        text.style.width = "100%"
        text.style.height = "20px"
        text.ondblclick = () => {
            //todo {dispatch(toggleShowDepartmentsPlan())}
            alert("dispatch(toggleShowDepartmentsPlan())")
        }
        td.appendChild(text)
    }
    else {

        estimationsToRender.sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1)).map((i, idx) => {
            const container = document.createElement("div")
            container.ondblclick = () => {
                //todo {dispatch(toggleShowDepartmentsPlan())}
                alert("dispatch(toggleShowDepartmentsPlan())")
            }

            const colorFlag = document.createElement("span")
            colorFlag.style.backgroundColor = i.color
            colorFlag.style.display = "inline-block"
            colorFlag.style.verticalAlign = "top"
            colorFlag.style.height = i.lineHeight + "px"
            colorFlag.style.width = "20px"
            colorFlag.style.marginLeft = "-2px"
            colorFlag.style.marginTop = "5px"
            colorFlag.style.marginRight = "2px"

            const text = document.createElement("span")
            text.innerText = i.departmentName + " " + i.totalHours
            text.style.display = "inline-block"

            const link = document.createElement("span")
            link.innerText = " ..."
            link.style.cursor = "pointer"
            link.onclick = () => {
                alert("open dep")
            }

            container.appendChild(colorFlag)
            container.appendChild(text)
            container.appendChild(link)
            td.appendChild(container)

            if (true) {
                const detailsContainer = document.createElement("span")
                detailsContainer.style.display = "block"
                detailsContainer.style.fontSize = "10px"
                detailsContainer.style.color = "dimgray"
                detailsContainer.style.marginTop = "-5px"
                detailsContainer.ondblclick = () => {
                    //todo {dispatch(toggleShowDepartmentsPlan())}
                    alert("dispatch(toggleShowDepartmentsPlan())")
                }

                const emptyDiv = document.createElement("div")
                emptyDiv.style.width = "20px"
                emptyDiv.style.display = "inline-block"
                detailsContainer.appendChild(emptyDiv)

                i.estimations.filter(f => f.hours !== 0).map(p => {
                    const div = document.createElement("div")
                    div.innerText = (p.userPositionIdent ? p.userPositionIdent : "") + ": " + p.hours
                    div.style.display = "inline"
                    div.style.marginRight = "5px"
                    detailsContainer.appendChild(div)
                })

                td.appendChild(detailsContainer)
            }
        })

    }
}

export const DepartmentsCellRenderer = (props: any) => {
    const { value } = props
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const estimations = value as ProjectTaskDepartmentEstimationVm[]
    const { t } = useTranslation();

    const departmentCellStyle = {
        width: "100%",
        fontSize: "11px",
        display: "table",
    }

    const departmentLastCellStyle = {
        width: "100%",
        fontSize: "11px",
        display: "table",
        borderBottom: "solid rgb(204, 204, 204) 0.8px"
    }

    const departmentColorFlagStyle = (color: string, lineHeight: number): any => {
        return {

            backgroundColor: color,
            display: "inline-block",
            verticalAlign: "top",
            height: lineHeight + "px",
            width: "20px",
            marginLeft: "-2px",
            marginTop: "5px",
            marginRight: "2px"
        }
    }

    const estimationsToRender = estimations?.filter(i => i.totalHours > 0)
    if (estimationsToRender.length === 0) {
        return (
            <div
                onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }} style={{ width: "100%", height: "20px" }}>
            </div>
        )
    }

    return (
        <React.Fragment>
            {
                estimationsToRender.sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1)).map((i, idx) => {
                    return (
                        <div
                            key={"dep_" + i.id.toString()}
                            style={(estimations?.filter(i => i.totalHours > 0).length - 1 === idx) ? departmentCellStyle : departmentLastCellStyle}>

                            <span style={departmentColorFlagStyle(i.color, i.lineHeight)} onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }} />

                            <span style={{ maxWidth: "220px", whiteSpace: "pre-wrap", display: "inline-block" }} onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }}>
                                {i.departmentName + " " + i.totalHours + t('hour')}
                            </span>

                            <div style={{ display: "inline-block", cursor: "pointer" }}
                                onClick={e => {
                                    navigate(`/departmentPlans/${i.departmentId}/${i.departmentName}`)
                                }}>
                                &nbsp;...
                            </div>

                            <span style={{ display: "block", fontSize: "10px", color: "dimgray" }} onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }}>
                                <div style={{ width: "20px", display: "inline-block" }}></div>
                                {
                                    i.estimations.filter(f => f.hours !== 0).map(p => {
                                        return (
                                            <div key={p.id + p.userPositionId + p.hours}
                                                style={{ display: "inline", marginRight: "5px" }}>{p.userPositionIdent}: {p.hours + t('hour')}</div>
                                        )
                                    }
                                    )
                                }
                            </span>
                        </div>
                    )
                })
            }
        </React.Fragment>

    );
}