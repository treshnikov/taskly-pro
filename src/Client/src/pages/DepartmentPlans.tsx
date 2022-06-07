import { Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHttp } from "../hooks/http.hook";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useNavigate } from "react-router-dom";

type DepartmentShortInfoVm = {
    id: string,
    name: string,
    shortName: string
}

export const DepartmentPlans: React.FunctionComponent = () => {
    const { request } = useHttp()
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [departments, setDepartments] = useState<DepartmentShortInfoVm[]>([])

    useEffect(() => {
        async function fetchDepartments() {
            const departments = await request<DepartmentShortInfoVm[]>("/api/v1/departments/forPlan")
            setDepartments(departments)
        }
        fetchDepartments()


    }, [request])


    return (
        <div className='page-container'>
            <h3>{t('departments')}</h3>
            <List dense={true} sx={{ maxWidth: 500 }}>

                {
                    departments.map(d =>
                        <ListItem
                            key={d.id}
                            secondaryAction={
                                <Button onClick={e => navigate("/departmentPlans/"+ d.id + "/" + d.name)}>
                                    {t('open')}
                                </Button>
                            }
                        >
                            <ListItemAvatar>
                                <AccountTreeIcon />
                            </ListItemAvatar>
                            <ListItemText
                                primary={d.shortName ? d.shortName : d.name}
                                secondary={d.shortName ? d.name : null}
                            />
                        </ListItem>
                    )
                }

            </List>
        </div>
    )
}