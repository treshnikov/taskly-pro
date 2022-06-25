import Handsontable from "handsontable";

export const WeekPlanCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const id = instance.getDataAtCell(row, 0);
    td.style.textAlign = 'center'

    // rows with user name contain summary info that should not be editable
    if (id[0] === 'u') {
        cellProperties.readOnly = true
        td.style.fontStyle = 'italic'

        const rateAsString = (instance.getDataAtCell(row, 3).toString() as string).replace(",", ".")
        let planTime = 40.0
        const rateAsNumber = parseFloat(rateAsString)
        if (!isNaN(rateAsNumber)) {
            planTime = planTime * rateAsNumber
        }

        let valueAsFloat = parseFloat(value)
        if (isNaN(valueAsFloat)) {
            valueAsFloat = 0
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
        const weeksAvailabilityMap = instance.getDataAtCell(row, 2)
        const staticColumnsCount = 8
        if (weeksAvailabilityMap[col - staticColumnsCount] === true) {
            td.style.background = '-webkit-linear-gradient(bottom, #ecffebdd 10%, white 10%)'
        }
        else {
            td.style.background = '-webkit-linear-gradient(bottom, #ffccccbb 10%, white 10%)'

        }
    }
}