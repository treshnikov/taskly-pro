import { useEffect, useRef, useState } from "react";
import useTilg from "tilg";
import { ProjectTaskUnitEstimationVm } from "../../models/ProjectTaskUnitEstimationVm";

export const GanttCellRenderer = (props: any) => {
    const { col, value, firstMonday } = props
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ganttDivHeight, setGanttDivHeight] = useState<number>(0)

    const estimations = value as ProjectTaskUnitEstimationVm[]
    const startDate = firstMonday as Date
    const colDate = new Date(startDate)
    colDate.setDate(colDate.getDate() + (col - 5) * 7)
    const startDateToCheck = estimations && estimations.length >= 1
        ? new Date(estimations[0].start)
        : new Date()
    startDateToCheck.setDate(startDateToCheck.getDate() - 7)

    // const draw =
    //     estimations &&
    //     estimations.length > 0 &&
    //     colDate >= startDateToCheck &&
    //     colDate <= estimations[0].end

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
            drawLine(
                0, top + e.lineHeight / 2,
                500, top + e.lineHeight / 2,
                e.color, e.lineHeight)
            top += e.lineHeight + 1
            totalHeight += e.lineHeight + 1
        });

        setGanttDivHeight(totalHeight)
    }, [estimations])

    return (
        <div style={{ height: ganttDivHeight }}>
            <canvas ref={canvasRef} width={500}></canvas>
        </div>)
}