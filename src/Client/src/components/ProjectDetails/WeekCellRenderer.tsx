import { ProjectTaskUnitEstimationVm } from "../../models/ProjectTaskUnitEstimationVm";

export const WeekCellRenderer = (props: any) => {
    const { col, value, firstMonday } = props
    const estimations = value as ProjectTaskUnitEstimationVm[]

    const startDate = firstMonday as Date
    const colDate = new Date(startDate)
    colDate.setDate(colDate.getDate() + (col - 5) * 7)
    const startDateToCheck = new Date(estimations[0].start)
    startDateToCheck.setDate(startDateToCheck.getDate() - 7)

    const draw =
        estimations &&
        estimations.length > 0 &&
        colDate >= startDateToCheck &&
        colDate <= estimations[0].end

    if (!draw) {
        return (<></>)
    }

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