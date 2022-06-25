import Handsontable from "handsontable";
import { ID_COLUMN_INDEX, RATE_COLUMN_INDEX, STATIC_COLUMNS_COUNT, WEEKS_AVAILABILITY_MAP_COLUMN_INDEX } from "../DepartmentPlanConst";

export const WeekPlanCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const id = instance.getDataAtCell(row, ID_COLUMN_INDEX);
    td.style.textAlign = 'center'

    // rows with user name contain summary info that should not be editable
    if (id[0] === 'u') {
        cellProperties.readOnly = true
        td.style.fontStyle = 'italic'

        const rateAsString = (instance.getDataAtCell(row, RATE_COLUMN_INDEX).toString() as string).replace(",", ".")
        let planTime = 40.0
        const rateAsNumber = parseFloat(rateAsString)
        if (!isNaN(rateAsNumber)) {
            planTime = planTime * rateAsNumber
        }

        let valueAsFloat = value == null ? 0 : parseFloat(value)
        if (isNaN(valueAsFloat)) {
            valueAsFloat = 0.0
        }

        td.style.fontWeight = '500'
        if (valueAsFloat === planTime) {
            td.style.background = '-webkit-linear-gradient(bottom, #ecffebaa 100%, white 100%)'
        }
        else {
            if (valueAsFloat > planTime) {
                td.style.background = '-webkit-linear-gradient(bottom, #ffcccc88 100%, white 100%)'
            }
            else {
                td.style.background = '-webkit-linear-gradient(bottom, #ffffe0aa 100%, white 100%)'
            }
        }
    }

    // render cell with project information
    if (id[0] === 'p') {
        const weeksAvailabilityMap = instance.getDataAtCell(row, WEEKS_AVAILABILITY_MAP_COLUMN_INDEX)
        if (weeksAvailabilityMap[col - STATIC_COLUMNS_COUNT] === false) {
            td.style.background = '#f3f4f5cc'
        }
    }
}