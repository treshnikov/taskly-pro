import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string }>()!.id
    const { request } = useHttp()
    const { t } = useTranslation();

    return (
        <div className='page-container'>
            DepartmentDetailedPlan {departmentId}
        </div>)
}