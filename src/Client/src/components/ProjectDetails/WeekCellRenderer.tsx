import { ProjectTaskVm } from "../../models/ProjectTaskVm";
import { ProjectTaskUnitEstimationVm } from "../../models/ProjectTaskUnitEstimationVm";
import { useTranslation } from 'react-i18next';

export const WeekCellRenderer = (props: any) => {
    const { col, value } = props
    const estimations = value as ProjectTaskUnitEstimationVm[]
    const { t } = useTranslation();

    return (
        <>
            {
                estimations?.sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1)).map((e, idx) => {
                    return (
                        <div
                            key={"est_week_" + e.id.toString()}
                            style={
                                {
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    width: "100%",
                                    fontSize: "11px",
                                    display: "table",
                                    backgroundColor: e.color,
                                    //display: "inline-block",
                                    height: e.lineHeight + "px",
                                    marginTop: "2px",
                                    marginLeft: "-4px",
                                    paddingRight: "8px"
    
                                }}>
                        </div>
                    )
                })
            }
        </>
    )
}