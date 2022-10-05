import Handsontable from "handsontable";
import { ServicesStorageHelper } from "../../../common/servicesStorageHelper";
import { GOOD_PLANING_TIME_COLOR, ID_COLUMN_INDEX, NOT_ENOUGH_HOURS_PLANNED_COLOR, STATIC_COLUMNS_COUNT, TOO_MANY_HOURS_PLANNED_COLOR, WEEKS_AVAILABILITY_MAP_COLUMN_INDEX, WEEKS_HOURS_SHOULD_BE_PLANNED_MAP_COLUMN_INDEX, WEEK_HAS_NO_ASSIGNED_PROJECT_TASKS_COLOR } from "../DepartmentPlanConst";

export const WeekPlanCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const id = instance.getDataAtCell(row, ID_COLUMN_INDEX);
    td.style.textAlign = 'center'

    // rows with user name contain summary info that should not be editable
    if (id[0] === 'u') {
        const hoursAvailableForPlanning = instance.getDataAtCell(row, WEEKS_HOURS_SHOULD_BE_PLANNED_MAP_COLUMN_INDEX)[col - STATIC_COLUMNS_COUNT]

        cellProperties.readOnly = true
        td.style.fontStyle = 'italic'

        let hoursAvailableForPlanningAsFloat = parseFloat(hoursAvailableForPlanning)
        td.title = `${ServicesStorageHelper.t('should-be-planned')} ${hoursAvailableForPlanningAsFloat}${ServicesStorageHelper.t('hour')}`

        let plannedHoursAsFloat = value == null ? 0 : parseFloat(value)
        if (isNaN(plannedHoursAsFloat)) {
            plannedHoursAsFloat = 0.0
        }

        td.style.fontWeight = '500'
        if (plannedHoursAsFloat === hoursAvailableForPlanningAsFloat) {
            td.style.background = GOOD_PLANING_TIME_COLOR
        }
        else {
            if (plannedHoursAsFloat > hoursAvailableForPlanningAsFloat) {
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