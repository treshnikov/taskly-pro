import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectTaskUnitEstimationVm } from "../../models/ProjectTaskUnitEstimationVm";

export const DepartmentsCellRenderer = (props: any) => {
    const { value } = props
    const estimations = value as ProjectTaskUnitEstimationVm[]
    const { t } = useTranslation();

    return (
        <>
            {
                estimations?.sort((a, b) => (a.totalHours < b.totalHours ? 1 : -1)).map((i, idx) => {
                    return (
                        <div key={"dep_" + i.id.toString()} style={
                            (estimations?.length - 1 === idx) ?
                                {
                                    width: "100%",
                                    fontSize: "11px",
                                    display: "table",
                                } :
                                {
                                    width: "100%",
                                    fontSize: "11px",
                                    display: "table",
                                    borderBottom: "solid rgb(204, 204, 204) 0.8px"
                                }}>
                            <span style={{
                                backgroundColor: i.color,
                                display: "inline-block",
                                verticalAlign: "top",
                                height: i.lineHeight + "px",
                                width: "20px",
                                marginLeft: "-2px",
                                marginTop: "5px",
                                marginRight: "2px"
                            }}>
                            </span>
                            <span style={{
                                maxWidth: "220px",
                                whiteSpace: "pre-wrap",
                                display: "inline-block"
                            }}>{i.unitName + " " + i.totalHours + t('hour')}</span>
                            <span style={{  display: "block", fontSize: "10px", color: "dimgray" }}>
                                <div style={{width: "20px", display: "inline-block"}}></div>
                                {
                                    (i.departmentHeadHours !== 0)
                                        ? <div style={{display: "inline", marginRight: "5px"}}>{t('departmentHeadHours')}: {i.departmentHeadHours + t('hour')}</div>
                                        : <></>
                                }
                                {
                                    (i.chiefSpecialistHours !== 0)
                                        ? <div style={{display: "inline", marginRight: "5px"}}>{t('chiefSpecialistHours')}: {i.chiefSpecialistHours + t('hour')}</div>
                                        : <></>
                                }
                                {
                                    (i.leadEngineerHours !== 0)
                                        ? <div style={{display: "inline", marginRight: "5px"}}>{t('leadEngineerHours')}: {i.leadEngineerHours + t('hour')}</div>
                                        : <></>
                                }
                                {
                                    (i.engineerOfTheFirstCategoryHours !== 0)
                                        ? <div style={{display: "inline", marginRight: "5px"}}>{t('engineerOfTheFirstCategoryHours')}: {i.engineerOfTheFirstCategoryHours + t('hour')}</div>
                                        : <></>
                                }
                                {
                                    (i.engineerOfTheSecondCategoryHours !== 0)
                                        ? <div style={{display: "inline", marginRight: "5px"}}>{t('engineerOfTheSecondCategoryHours')}: {i.engineerOfTheSecondCategoryHours + t('hour')}</div>
                                        : <></>
                                }
                                {
                                    (i.engineerOfTheThirdCategoryHours !== 0)
                                        ? <div style={{display: "inline", marginRight: "5px"}}>{t('engineerOfTheThirdCategoryHours')}: {i.engineerOfTheThirdCategoryHours + t('hour')}</div>
                                        : <></>
                                }
                                {
                                    (i.techniclaWriterHours !== 0)
                                        ? <div style={{display: "inline", marginRight: "5px"}}>{t('techniclaWriterHours')}: {i.techniclaWriterHours + t('hour')}</div>
                                        : <></>
                                }
                            </span>
                        </div>
                    )
                })
            }
        </>
    );
}