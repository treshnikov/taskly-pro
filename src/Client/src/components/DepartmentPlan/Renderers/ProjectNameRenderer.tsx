import { useTranslation } from 'react-i18next';
import { DepartmentPlanUserRecordVm as DepartmentPlanUserRecordVm } from '../../../models/DepartmentPlan/DepartmentPlanClasses';

export const ProjectNameRenderer = (props: any) => {
    const { plan, row } = props
    const p = plan as DepartmentPlanUserRecordVm[]
    const rowIdx = row as number
    
    const { t } = useTranslation();

    return (
        <div>{rowIdx}</div>
    )
}