import { useEffect, useRef, useState } from "react";
import { dateAsShortStrFromNumber } from "../../../common/dateFormatter";
import { ProjectTaskDepartmentEstimationVm } from "../../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm";
import { ProjectTaskVm } from "../../../models/ProjectDetails/ProjectTaskVm";
import { useAppSelector } from '../../../hooks/redux.hook'

export const GanttCellRenderer = (props: any) => {
    const { row, width, value, startDate, tasks } = props
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ganttDivHeight, setGanttDivHeight] = useState<number>(0)
    const ganttChartZoomLevel = useAppSelector(state => state.projectDetailsReducer.ganttChartZoomLevel)

    const rowIdx = row as number
    const estimations = value as ProjectTaskDepartmentEstimationVm[]
    const projectTasks = tasks as ProjectTaskVm[]
    const startDt = startDate as Date

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number) => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d')
        if (context) {
            context.strokeStyle = color
            context.lineWidth = lineWidth

            context.beginPath()
            context.moveTo(x1, y1)
            context.lineTo(x2, y2)
            context.closePath()

            context.stroke()
        }
    }

    useEffect(() => {
        const estimationToDraw = estimations?.filter(i => i.totalHours > 0)
            .sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1))

        let totalHeight = 0
        let top = 5

        // estimation is assigned wit departments
        if (estimationToDraw.length > 0) {
            estimationToDraw.forEach(e => {
                const startX = ganttChartZoomLevel * (new Date(e.start).getTime() - startDt.getTime()) / (1000 * 3600 * 24)
                const lineWidth = ganttChartZoomLevel * (new Date(e.end).getTime() - new Date(e.start).getTime()) / (1000 * 3600 * 24)

                drawLine(
                    startX, top + e.lineHeight / 2,
                    startX + lineWidth, top + e.lineHeight / 2,
                    e.color, e.lineHeight)
                top += e.lineHeight + 1
                totalHeight += e.lineHeight + 1
            });
        }
        // no estimations, only start and end dates
        else {
            if (projectTasks.length > rowIdx) {

                const noEstimationsLineHeight = 5
                const noEstimationsLineColor = "#D0D0D0"

                const taskStart = projectTasks[rowIdx].start
                const taskEnd = projectTasks[rowIdx].end

                const startX = ganttChartZoomLevel * (new Date(taskStart).getTime() - new Date(startDt).getTime()) / (1000 * 3600 * 24) - 2
                const lineWidth = ganttChartZoomLevel * (new Date(taskEnd).getTime() - new Date(taskStart).getTime()) / (1000 * 3600 * 24) + 2

                drawLine(
                    startX, top + noEstimationsLineHeight / 2,
                    startX + lineWidth, top + noEstimationsLineHeight / 2,
                    noEstimationsLineColor, noEstimationsLineHeight)
            }
        }

        setGanttDivHeight(totalHeight)
    }, [estimations, ganttChartZoomLevel, startDt, projectTasks, rowIdx, row])

    if (projectTasks.length === 0) {
        return <></>
    }

    return (
        <div
            style={{
                height: ganttDivHeight,
                marginLeft: "-4px",
                paddingRight: "8px"
            }}
            title={getCanvasTitle(estimations)}>
            <canvas
                ref={canvasRef}
                width={width}>

            </canvas>
        </div>)
}

const getCanvasTitle = (arg: ProjectTaskDepartmentEstimationVm[]): string => {
    if (!arg || arg.length === 0) {
        return ""
    }

    return dateAsShortStrFromNumber(arg[0].start) + " - " + dateAsShortStrFromNumber(arg[0].end)
}