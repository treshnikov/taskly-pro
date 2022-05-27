import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/redux.hook';
import { ProjectTaskDepartmentEstimationVm } from "../../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm";
import { toggleShowDepartmentsPlan } from '../../../redux/projectDetailsSlice';

export const DepartmentsCellRenderer = (props: any) => {
    const { showDetails, value } = props
    const dispatch = useAppDispatch()
    const estimations = value as ProjectTaskDepartmentEstimationVm[]
    const { t } = useTranslation();
    const showDetailsAsBool = showDetails as boolean

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
        <>
            {
                estimationsToRender.sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1)).map((i, idx) => {
                    return (
                        <div
                            onDoubleClick={e => { dispatch(toggleShowDepartmentsPlan()) }}
                            key={"dep_" + i.id.toString()}
                            style={
                                (estimations?.filter(i => i.totalHours > 0).length - 1 === idx) ?
                                    {
                                        width: "100%",
                                        fontSize: "11px",
                                        display: "table",
                                    } :
                                    {
                                        width: "100%",
                                        fontSize: "11px",
                                        display: "table",
                                        borderBottom: "solid rgb(204, 204, 204) 0.8px"
                                    }}>
                            <span style={{
                                backgroundColor: i.color,
                                display: "inline-block",
                                verticalAlign: "top",
                                height: i.lineHeight + "px",
                                width: "20px",
                                marginLeft: "-2px",
                                marginTop: "5px",
                                marginRight: "2px"
                            }}>
                            </span>
                            <span style={{
                                maxWidth: "220px",
                                whiteSpace: "pre-wrap",
                                display: "inline-block"
                            }}>{i.departmentName + " " + i.totalHours + t('hour')}</span>
                            <span style={{ display: showDetailsAsBool ? "block" : "none", fontSize: "10px", color: "dimgray" }}>
                                <div style={{ width: "20px", display: "inline-block" }}></div>
                                {
                                    i.estimations.filter(f => f.hours !== 0).map(p => {
                                        //console.log(i.id + p.userPositionId + p.hours)
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
        </>
    );
}