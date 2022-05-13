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
                estimations?.map((i, idx) => {
                    return (
                        <div key={i.id} style={
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
                                //   backgroundColor: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
                                backgroundColor: i.color,
                                display: "inline-block",
                                height: i.lineHeight + "px",
                                width: "20px",
                                marginLeft: "-2px",
                                marginTop: "2px",
                                marginRight: "2px"
                            }}>
                            </span>
                            <span style={{ maxWidth: "200px", whiteSpace: "pre-wrap", display: "inline-block" }}>{i.unitName + " " + ProjectTaskUnitEstimationVm.getTotalHours(i)}</span>
                            <span style={{ float: "right" }}>
                                {
                                    (i.departmentHeadHours !== 0)
                                        ? <div>{t('departmentHeadHours')}: {i.departmentHeadHours}</div>
                                        : <></>
                                }
                                {
                                    (i.chiefSpecialistHours !== 0)
                                        ? <div>{t('chiefSpecialistHours')}: {i.chiefSpecialistHours}</div>
                                        : <></>
                                }
                                {
                                    (i.leadEngineerHours !== 0)
                                        ? <div>{t('leadEngineerHours')}: {i.leadEngineerHours}</div>
                                        : <></>
                                }
                                {
                                    (i.engineerOfTheFirstCategoryHours !== 0)
                                        ? <div>{t('engineerOfTheFirstCategoryHours')}: {i.engineerOfTheFirstCategoryHours}</div>
                                        : <></>
                                }
                                {
                                    (i.engineerOfTheSecondCategoryHours !== 0)
                                        ? <div>{t('engineerOfTheSecondCategoryHours')}: {i.engineerOfTheSecondCategoryHours}</div>
                                        : <></>
                                }
                                {
                                    (i.engineerOfTheThirdCategoryHours !== 0)
                                        ? <div>{t('engineerOfTheThirdCategoryHours')}: {i.engineerOfTheThirdCategoryHours}</div>
                                        : <></>
                                }
                                {
                                    (i.techniclaWriterHours !== 0)
                                        ? <div>{t('techniclaWriterHours')}: {i.techniclaWriterHours}</div>
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