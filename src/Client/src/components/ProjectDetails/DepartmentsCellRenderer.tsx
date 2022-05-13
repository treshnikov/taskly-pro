import { useTranslation } from 'react-i18next';
import { ProjectTaskUnitEstimationVm, } from '../../models/ProjectShortInfoVm';

export const  DepartmentsCellRenderer = (props: any) => {
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
                  backgroundColor: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
                  display: "inline-block",
                  height: "15px",
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
                     ? <div>Рук: {i.departmentHeadHours}</div>
                     : <></>
                  }
                  {
                    (i.chiefSpecialistHours !== 0)
                     ? <div>ГС: {i.chiefSpecialistHours}</div>
                     : <></>
                  }
                  {
                    (i.leadEngineerHours !== 0)
                     ? <div>ВИ: {i.leadEngineerHours}</div>
                     : <></>
                  }
                  {
                    (i.engineerOfTheFirstCategoryHours !== 0)
                     ? <div>И1: {i.engineerOfTheFirstCategoryHours}</div>
                     : <></>
                  }
                  {
                    (i.engineerOfTheSecondCategoryHours !== 0)
                     ? <div>И2: {i.engineerOfTheSecondCategoryHours}</div>
                     : <></>
                  }
                  {
                    (i.engineerOfTheThirdCategoryHours !== 0)
                     ? <div>И3: {i.engineerOfTheThirdCategoryHours}</div>
                     : <></>
                  }
                  {
                    (i.techniclaWriterHours !== 0)
                     ? <div>Т: {i.techniclaWriterHours}</div>
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