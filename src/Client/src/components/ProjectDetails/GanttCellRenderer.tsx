import { useEffect, useRef, useState } from "react";
import { dateAsShortStr } from "../../common/dateFormatter";
import { ProjectTaskUnitEstimationVm } from "../../models/ProjectTaskUnitEstimationVm";
import { useAppSelector, useAppDispatch } from '../../redux/hooks'

export const GanttCellRenderer = (props: any) => {
    const { width, value, startDate } = props
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ganttDivHeight, setGanttDivHeight] = useState<number>(0)
    const ganttChartZoomLevel = useAppSelector(state => state.projectDetailsReducer.ganttChartZoomLevel)

    const estimations = value as ProjectTaskUnitEstimationVm[]
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
        estimationToDraw.forEach(e => {
            const startX = ganttChartZoomLevel * (e.start.getTime() - startDt.getTime()) / (1000 * 3600 * 24)
            const lineWidth = ganttChartZoomLevel * (e.end.getTime() - e.start.getTime()) / (1000 * 3600 * 24)

            drawLine(
                startX, top + e.lineHeight / 2,
                startX + lineWidth, top + e.lineHeight / 2,
                e.color, e.lineHeight)
            top += e.lineHeight + 1
            totalHeight += e.lineHeight + 1
        });

        setGanttDivHeight(totalHeight)
    }, [estimations])

    return (
        <div style={{
            height: ganttDivHeight,
            marginLeft: "-4px",
            paddingRight: "8px"
        }}
            title={getCanvasTitle(estimations)}>
            <canvas ref={canvasRef} width={width}></canvas>
        </div>)
}

const getCanvasTitle = (arg: ProjectTaskUnitEstimationVm[]): string => {
    if (!arg || arg.length === 0) {
        return ""
    }
    return dateAsShortStr(arg[0].start) + " - " + dateAsShortStr(arg[0].end)
}