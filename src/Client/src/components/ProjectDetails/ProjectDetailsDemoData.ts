import { ProjectDetailedInfoVm } from "../../models/ProjectDetails/ProjectDetailedInfoVm"
import { ProjectTaskDepartmentEstimationVm } from "../../models/ProjectDetails/ProjectTaskDepartmentEstimationVm"
import { ProjectTaskVm } from "../../models/ProjectDetails/ProjectTaskVm"

export function populateDemoTasks(projectInfo: ProjectDetailedInfoVm) {
  let newTasks = projectInfo.tasks

  const testTask = new ProjectTaskVm()
  testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"
  testTask.start = new Date(2022, 3, 5, 0, 0, 0, 0).getTime()
  testTask.end = new Date(2022, 4, 8, 0, 0, 0, 0).getTime()

  const testEstimation1 = new ProjectTaskDepartmentEstimationVm()
  testEstimation1.id = "asdfasdfsdf"
  testEstimation1.departmentName = "Отдел программирования РСУ"
  testEstimation1.estimations = [
    {id: '1', userPositionId: '1', userPositionName: 'И1', userPositionIdent: 'И1', hours: 80 },
    {id: '2', userPositionId: '2', userPositionName: 'И2', userPositionIdent: 'И2', hours: 240 },
    {id: '3', userPositionId: '3', userPositionName: 'И3', userPositionIdent: 'И3', hours: 360 },
  ]

  const testEstimation2 = new ProjectTaskDepartmentEstimationVm()
  testEstimation2.id = "dfgsdfg"
  testEstimation2.departmentName = "Отдел программирования СУПП"
  testEstimation2.estimations = [
    {id: '4', userPositionId: '4', userPositionName: 'ГС', userPositionIdent: 'ГС', hours: 180 },
  ]

  const testEstimation3 = new ProjectTaskDepartmentEstimationVm()
  testEstimation3.id = "iuthoi3hti2hpi"
  testEstimation3.departmentName = "Отдел программирования с очень длинным именем"
  testEstimation3.estimations = [
    {id: '5', userPositionId: '5', userPositionName: 'DB', userPositionIdent: 'DB', hours: 40 },
  ]

  testTask.departmentEstimations = [testEstimation1, testEstimation2, testEstimation3]

  newTasks = [...newTasks, testTask]
  projectInfo.tasks = newTasks
}