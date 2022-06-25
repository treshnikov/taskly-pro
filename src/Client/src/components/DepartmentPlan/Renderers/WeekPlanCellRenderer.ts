import Handsontable from "handsontable";
import { GOOD_PLANING_TIME_COLOR, ID_COLUMN_INDEX, NOT_ENOUGH_HOURS_PLANNED_COLOR, RATE_COLUMN_INDEX, STATIC_COLUMNS_COUNT, TOO_MANY_HOURS_PLANNED_COLOR, WEEKS_AVAILABILITY_MAP_COLUMN_INDEX, WEEK_HAS_NO_ASSIGNED_PROJECT_TASKS_COLOR } from "../DepartmentPlanConst";

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
            td.style.background = GOOD_PLANING_TIME_COLOR
        }
        else {
            if (valueAsFloat > planTime) {
                td.style.background = TOO_MANY_HOURS_PLANNED_COLOR
            }
            else {
                td.style.background = NOT_ENOUGH_HOURS_PLANNED_COLOR
            }
        }
    }

    // render cell with project information
    if (id[0] === 'p') {
        const weeksAvailabilityMap = instance.getDataAtCell(row, WEEKS_AVAILABILITY_MAP_COLUMN_INDEX)
        if (weeksAvailabilityMap[col - STATIC_COLUMNS_COUNT] === false) {
            td.style.background = WEEK_HAS_NO_ASSIGNED_PROJECT_TASKS_COLOR
        }
    }
}