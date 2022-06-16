import Handsontable from "handsontable";
import { NavigateHelper } from "../../../common/navigateHelper";

export const ProjectNameCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const rowId = instance.getDataAtCell(row, 0);

    if (rowId[0] === 'p') {
        const text = document.createElement("div")
        text.innerText = value
        text.style.display = 'inline-block'

        const link = document.createElement("div")
        link.innerText = " ..."
        link.style.display = 'inline-block'
        link.style.cursor = 'pointer'
        link.onclick = () => {
            const projectId = (value as string).split(':')[0] 
            NavigateHelper.navigate(`/projects/${projectId}`)
        }

        td.innerText = ''
        td.appendChild(text)
        td.appendChild(link) 
    }
}