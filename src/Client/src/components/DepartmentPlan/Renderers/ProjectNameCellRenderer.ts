import Handsontable from "handsontable";
import { ServicesStorageHelper } from "../../../common/servicesStorageHelper";

export const ProjectNameCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const id = instance.getDataAtCell(row, 0)

    // render cell with project information
    if (id[0] === 'p') {
        const tooltip = instance.getDataAtCell(row, 1)
        
        const text = document.createElement("div")
        text.innerText = value
        text.style.display = 'inline-block'
        text.title = tooltip

        const link = document.createElement("div")
        link.innerText = " ..."
        link.style.display = 'inline-block'
        link.style.cursor = 'pointer'
        link.onclick = () => {
            const projectId = (value as string).split(':')[0]
            ServicesStorageHelper.navigate(`/projects/${projectId}`)
        }

        td.innerText = ''
        td.appendChild(text)
        td.appendChild(link)
    }
}