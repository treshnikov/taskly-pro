import Handsontable from "handsontable";
import { ServicesStorageHelper } from "../../../common/servicesStorageHelper";
import { toggleShowUserHolidays } from "../../../redux/departmentPlanSlice";
import { ID_COLUMN_INDEX, TOOLTIP_COLUMN_INDEX } from "../DepartmentPlanConst";

export const UserNameCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const id = instance.getDataAtCell(row, ID_COLUMN_INDEX)
    if (id[0] === 'u') {
        const text = document.createElement("div")
        text.innerText = value
        text.style.display = 'inline-block'

        const link = document.createElement("div")
        link.innerText = " ..."
        link.style.display = 'inline-block'
        link.style.cursor = 'pointer'
        link.onclick = () => {
            console.log(value)
            ServicesStorageHelper.dispatch(toggleShowUserHolidays(value))
        }

        td.innerText = ''
        td.appendChild(text)
        td.appendChild(link)
    }
}