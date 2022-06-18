import Handsontable from 'handsontable';
import { ServicesStorageHelper } from '../../../common/servicesStorageHelper';
import { ProjectTaskDepartmentEstimationVm } from "../../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm";
import { toggleShowDepartmentsPlan } from '../../../redux/projectDetailsSlice';

export const DepartmentsCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const estimations = value as ProjectTaskDepartmentEstimationVm[]
    const estimationsToRender = estimations?.filter(i => i.totalHours > 0)

    td.innerText = ''

    if (estimationsToRender.length === 0) {
        const text = document.createElement("div")
        text.style.width = "100%"
        text.style.height = "20px"
        text.ondblclick = () => {
            ServicesStorageHelper.dispatch(toggleShowDepartmentsPlan())
        }
        td.appendChild(text)
    }
    else {

        estimationsToRender.sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1)).map((i, idx) => {
            const container = document.createElement("div")
            container.ondblclick = () => {
                ServicesStorageHelper.dispatch(toggleShowDepartmentsPlan())
            }

            const colorFlag = document.createElement("span")
            colorFlag.style.backgroundColor = i.color
            colorFlag.style.display = "inline-block"
            colorFlag.style.verticalAlign = "top"
            colorFlag.style.height = i.lineHeight + "px"
            colorFlag.style.width = "20px"
            colorFlag.style.marginLeft = "-2px"
            colorFlag.style.marginTop = "5px"
            colorFlag.style.marginRight = "2px"

            const text = document.createElement("span")
            text.innerText = i.departmentName + " " + i.totalHours  + ServicesStorageHelper.t('hour')
            text.style.display = "inline-block"

            const link = document.createElement("span")
            link.innerText = " ..."
            link.style.cursor = "pointer"
            link.onclick = () => {
                ServicesStorageHelper.navigate(`/departmentPlans/${i.departmentId}/${i.departmentName}`)
            }

            container.appendChild(colorFlag)
            container.appendChild(text)
            container.appendChild(link)
            td.appendChild(container)

            const userEstimationContainer = document.createElement("span")
            userEstimationContainer.style.display = "block"
            userEstimationContainer.style.fontSize = "10px"
            userEstimationContainer.style.color = "dimgray"
            userEstimationContainer.style.marginTop = "-5px"
            userEstimationContainer.ondblclick = () => {
                ServicesStorageHelper.dispatch(toggleShowDepartmentsPlan())
            }

            const emptyDiv = document.createElement("div")
            emptyDiv.style.width = "20px"
            emptyDiv.style.display = "inline-block"
            userEstimationContainer.appendChild(emptyDiv)

            i.estimations.filter(f => f.hours !== 0).map(p => {
                const div = document.createElement("div")
                div.innerText = (p.userPositionIdent ? p.userPositionIdent : "") + ": " + p.hours + ServicesStorageHelper.t('hour')
                div.style.display = "inline"
                div.style.marginRight = "5px"
                userEstimationContainer.appendChild(div)
            })

            td.appendChild(userEstimationContainer)
        })

    }
}