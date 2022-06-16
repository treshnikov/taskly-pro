import Handsontable from "handsontable";

export const WeekPlanCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

    const rowId = instance.getDataAtCell(row, 0);

    // rows with user name contain summary info that should not be editable
    if (rowId[0] === 'u') {
        cellProperties.readOnly = true
        td.style.fontStyle = 'italic'

        const valueAsFloat = parseFloat(value)
        if (!isNaN(valueAsFloat)) {
            td.style.fontWeight = '500'
            if (valueAsFloat === 40) {
                td.style.background = '-webkit-linear-gradient(bottom, #ecffebaa 100%, white 100%)'
            }
            else {
                if (valueAsFloat > 40) {
                    td.style.background = '-webkit-linear-gradient(bottom, #ffcccc88 100%, white 100%)'
                }
                else {
                    td.style.background = '-webkit-linear-gradient(bottom, #ffffe0aa 100%, white 100%)'
                }
            }
        }
        else {
            td.style.background = '-webkit-linear-gradient(bottom, #f8f8f8 100%, white 100%)'
        }
    }
}