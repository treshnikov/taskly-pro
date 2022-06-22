import { useTranslation } from 'react-i18next';
import { getColor } from '../../../common/getColor';

export const ProjectNameRenderer = (props: any) => {
    const { value } = props
    const valueAsStr = value as string

    const { t } = useTranslation();

    if (!value || valueAsStr === "") {
        return <></>
    }

    return (
        <div style={{ display: 'inline-flex' }}>
            <span style={{ width: "5px", backgroundColor: getColor(valueAsStr), marginRight: "3px", marginTop: "3px" }}></span>
            <span>{valueAsStr}</span>
        </div>
    )
}