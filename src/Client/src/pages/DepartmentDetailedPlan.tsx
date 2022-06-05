import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string }>()!.id
    const { request } = useHttp()
    const { t } = useTranslation();
    const [content, setContent] = useState<string>("")

    useEffect(() => {
        async function fetchData() {
            //todo pass start and end date
            const departmentPlan = await request(`/api/v1/departments/${departmentId}/2022-01-01/2022-12-31/plan`, 'GET')
            setContent(JSON.stringify(departmentPlan, null, 2))
        }
        fetchData()
    }, [])

    return (
        <div className='page-container'>
            DepartmentDetailedPlan {departmentId}
            <br/>
            <pre>{content}</pre>
        </div>)
}