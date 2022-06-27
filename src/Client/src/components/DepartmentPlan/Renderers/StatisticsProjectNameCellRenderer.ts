import Handsontable from "handsontable";
import { ServicesStorageHelper } from "../../../common/servicesStorageHelper";
import { ID_COLUMN_INDEX } from "../DepartmentPlanConst";

export const StatisticsProjectNameCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const projectId = instance.getDataAtCell(row, ID_COLUMN_INDEX)
    const text = document.createElement("div")
    text.innerText = value
    text.style.display = 'inline-block'

    const link = document.createElement("div")
    link.innerText = " ..."
    link.style.display = 'inline-block'
    link.style.cursor = 'pointer'
    link.onclick = () => {
        ServicesStorageHelper.navigate(`/projects/${projectId}`)
    }

    td.innerText = ''
    td.appendChild(text)
    td.appendChild(link)
}