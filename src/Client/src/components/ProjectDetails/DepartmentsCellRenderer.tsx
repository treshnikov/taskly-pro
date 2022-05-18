import { useTranslation } from 'react-i18next';
import { ProjectTaskUnitEstimationVm } from "../../models/ProjectTaskUnitEstimationVm";

export const DepartmentsCellRenderer = (props: any) => {
    const { showDetails, value } = props
    const estimations = value as ProjectTaskUnitEstimationVm[]
    const { t } = useTranslation();
    const showDetailsAsBool = showDetails as boolean

    return (
        <>
            {
                estimations?.filter(i => i.totalHours > 0).sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1)).map((i, idx) => {
                    return (
                        <div key={"dep_" + i.id.toString()} style={
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
                            }}>{i.unitName + " " + i.totalHours + t('hour')}</span>
                            <span style={{ display: showDetailsAsBool ? "block" : "none", fontSize: "10px", color: "dimgray" }}>
                                <div style={{ width: "20px", display: "inline-block" }}></div>
                                {
                                    i.estimations.map(p => {
                                        if (p.hours === 0)
                                            return (
                                                <></>
                                            )

                                        return (
                                            <div key={i.id + p.userPositionId} 
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