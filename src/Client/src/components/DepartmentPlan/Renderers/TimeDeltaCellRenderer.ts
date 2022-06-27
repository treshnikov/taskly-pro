import Handsontable from "handsontable";
import { GOOD_PLANING_TIME_COLOR, TOO_MANY_HOURS_PLANNED_COLOR } from "../DepartmentPlanConst";

export const TimeDeltaCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const t1 = instance.getDataAtCell(row, 2) as number
    const t2 = instance.getDataAtCell(row, 3) as number
    const delta = t2 - t1
    
    const text = document.createElement("div")
    text.innerText = (delta > 0 ? "+" : "") + delta.toString()
    text.style.background = delta > 0 ? GOOD_PLANING_TIME_COLOR : TOO_MANY_HOURS_PLANNED_COLOR
    

    td.innerText = ''
    td.appendChild(text)
}