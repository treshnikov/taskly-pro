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
                  <div>И1</div>
                  <div>И1</div>
                  <div>И1</div>
                  <div>И1</div>
                </span>
              </div>
            )
          })
        }
      </>
    );
  }