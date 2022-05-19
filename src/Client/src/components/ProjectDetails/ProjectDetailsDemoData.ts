import { ProjectDetailedInfoVm } from "../../models/ProjectDetails/ProjectDetailedInfoVm"
import { ProjectTaskUnitEstimationVm } from "../../models/ProjectDetails/ProjectTaskUnitEstimationVm"
import { ProjectTaskVm } from "../../models/ProjectDetails/ProjectTaskVm"

export function populateDemoTasks(projectInfo: ProjectDetailedInfoVm) {
    let newTasks = projectInfo.tasks
  
    const testTask = new ProjectTaskVm()
    testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"
    testTask.start = new Date(2022, 3, 5, 0, 0, 0, 0).getTime()
    testTask.end = new Date(2022, 4, 8, 0, 0, 0, 0).getTime()
  
    const testEstimation1 = new ProjectTaskUnitEstimationVm()
    testEstimation1.id = "asdfasdfsdf"
    testEstimation1.unitName = "Отдел программирования РСУ"
    testEstimation1.estimations = [
      { userPositionId: '1', userPositionIdent: 'И1', hours: 80 },
      { userPositionId: '2', userPositionIdent: 'И2', hours: 240 },
      { userPositionId: '3', userPositionIdent: 'И3', hours: 360 },
    ]
  
    const testEstimation2 = new ProjectTaskUnitEstimationVm()
    testEstimation2.id = "dfgsdfg"
    testEstimation2.unitName = "Отдел программирования СУПП"
    testEstimation2.estimations = [
      { userPositionId: '4', userPositionIdent: 'ГС', hours: 180 },
    ]
  
    const testEstimation3 = new ProjectTaskUnitEstimationVm()
    testEstimation3.id = "iuthoi3hti2hpi"
    testEstimation3.unitName = "Отдел программирования с очень длинным именем"
    testEstimation3.estimations = [
      { userPositionId: '5', userPositionIdent: 'DB', hours: 40 },
    ]
  
    testTask.unitEstimations = [testEstimation1, testEstimation2, testEstimation3]
  
    newTasks = [...newTasks, testTask]
    projectInfo.tasks = newTasks
  }