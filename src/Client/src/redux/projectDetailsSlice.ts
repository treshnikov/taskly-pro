import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IProjectDetailedInfoVm, ProjectDetailedInfoVm, ProjectDetailedInfoVmHelper } from "../models/ProjectDetailedInfoVm"
import { IProjectTaskUnitEstimationVm, ProjectTaskUnitEstimationVm } from "../models/ProjectTaskUnitEstimationVm"
import { IProjectTaskVm, ProjectTaskVm } from "../models/ProjectTaskVm"
import { RootState } from "./store"

export type ProjectId = string | undefined

interface ProjectDetailsState {
    state: IProjectDetailedInfoVm
}

const initialState: ProjectDetailsState = {
    state: {
        chiefEngineer: '',
        closeDate: new Date(),
        company: '',
        contract: '',
        customer: '',
        end: new Date(),
        id: 0,
        isOpened: false,
        name: '',
        projectManager: '',
        shortName: '',
        start: new Date(),
        tasks: [],
        weeks: []
    }
}

export const projectDetailsSlice = createSlice({
    name: "projectDetails",
    initialState: initialState,
    reducers: {
        loadProjectDetails(state: ProjectDetailsState, action: PayloadAction<ProjectId>) {
            let projectInfo: IProjectDetailedInfoVm = new ProjectDetailedInfoVm()
            //projectInfo = new ProjectDetailedInfoVm() // await request<ProjectDetailedInfoVm>("/api/v1/projects/" + action.payload)
            projectInfo.id = 123
            projectInfo.tasks = []
            projectInfo.weeks = []
            projectInfo.start = new Date()
            projectInfo.end = new Date()

            let newTasks = projectInfo.tasks

            const testTask: IProjectTaskVm = new ProjectTaskVm()
            testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"
            testTask.start = new Date(2022, 3, 5, 0, 0, 0, 0)
            testTask.end = new Date(2022, 4, 8, 0, 0, 0, 0)

            const testEstimation1: IProjectTaskUnitEstimationVm = new ProjectTaskUnitEstimationVm()
            testEstimation1.id = "asdfasdfsdf"
            testEstimation1.unitName = "Отдел программирования РСУ"
            testEstimation1.chiefSpecialistHours = 120
            testEstimation1.leadEngineerHours = 40
            testEstimation1.engineerOfTheSecondCategoryHours = 90
            testEstimation1.engineerOfTheFirstCategoryHours = 40
            testEstimation1.engineerOfTheThirdCategoryHours = 120
            testEstimation1.techniclaWriterHours = 900

            const testEstimation2: IProjectTaskUnitEstimationVm = new ProjectTaskUnitEstimationVm()
            testEstimation2.id = "dfgsdfg"
            testEstimation2.unitName = "Отдел программирования СУПП"
            testEstimation2.chiefSpecialistHours = 800

            const testEstimation3: IProjectTaskUnitEstimationVm = new ProjectTaskUnitEstimationVm()
            testEstimation3.id = "iuthoi3hti2hpi"
            testEstimation3.unitName = "Отдел программирования с очень длинным именем"
            testEstimation3.engineerOfTheThirdCategoryHours = 16

            testTask.estimations = [testEstimation1, testEstimation2, testEstimation3]

            newTasks = [...newTasks, testTask]
            projectInfo.tasks = newTasks
            ProjectDetailedInfoVmHelper.init(projectInfo as IProjectDetailedInfoVm)

            state.state = projectInfo
        }
    }
})

export const { loadProjectDetails } = projectDetailsSlice.actions
export const selectProjectDetails = (state: RootState) => state.projectDetailsReducer
export default projectDetailsSlice.reducer
