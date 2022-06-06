import { useTranslation } from 'react-i18next';
import { getColor } from '../../../common/getColor';
import { DepartmentPlanUserRecordVm as DepartmentPlanUserRecordVm } from '../../../models/DepartmentPlan/DepartmentPlanClasses';

export const ProjectNameRenderer = (props: any) => {
    const { plan, value } = props
    const p = plan as DepartmentPlanUserRecordVm[]
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