export const DateCellRenderer = (props: any) => {
    const { value } = props
    const date = value as Date

    return (
        <>{date.toLocaleDateString()}</>
    )
}