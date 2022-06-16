import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { ProjectTaskDepartmentEstimationVm } from "../../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm";
import { toggleShowDepartmentsPlan } from '../../../redux/projectDetailsSlice';

export const DepartmentsCellRenderer = (props: any) => {
    const { showDetails, value } = props
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const estimations = value as ProjectTaskDepartmentEstimationVm[]
    const { t } = useTranslation();
    const showDetailsAsBool = showDetails as boolean

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

    if (estimations?.length === 0) {
        return (
            <div onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }} style={{ width: "100%", height: "20px" }}></div>
        )
    }

    const estimationsToRender = estimations?.filter(i => i.totalHours > 0)

    if (estimationsToRender.length === 0) {
        return (
            <div
                onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }}
                style={{ width: "100%", height: "20px" }}>
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

                            <span style={{ display: showDetailsAsBool ? "block" : "none", fontSize: "10px", color: "dimgray" }} onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }}>
                                <div style={{ width: "20px", display: "inline-block" }}></div>
                                {
                                    i.estimations.filter(f => f.hours !== 0).map(p => {
                                        return (
                                            <div key={p.id + p.userPositionId + p.hours}
                                                style={{
                                                    display: "inline",
                                                    marginRight: "5px"
                                                }}>{p.userPositionIdent}: {p.hours + t('hour')}</div>
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