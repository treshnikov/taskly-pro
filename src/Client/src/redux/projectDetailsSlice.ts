import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useState } from "react"
import { useHttp as useHttp } from "../hooks/http.hook"
import { IProjectDetailedInfoVm, ProjectDetailedInfoVm, ProjectDetailedInfoVmHelper } from "../models/ProjectDetailedInfoVm"
import { ProjectTaskUnitEstimationVm } from "../models/ProjectTaskUnitEstimationVm"
import { ProjectTaskVm } from "../models/ProjectTaskVm"
import { RootState } from "./store"

export type ProjectId = string

const initialState: IProjectDetailedInfoVm = { ...new ProjectDetailedInfoVm() }

export const projectDetailsSlice = createSlice({
    name: "projectDetails",
    initialState: initialState,
    reducers: {
        useLoad(state: IProjectDetailedInfoVm, action: PayloadAction<ProjectId>) {
            //const [x, xx] = useState(123)
            const { request } = useHttp()
            console.log("load project details", action.payload)

            async function requestDetails() {
                let projectInfo = new ProjectDetailedInfoVm()
                projectInfo = await request<ProjectDetailedInfoVm>("/api/v1/projects/" + action.payload)

                let newTasks = projectInfo.tasks

                const testTask = new ProjectTaskVm()
                testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"
                testTask.start = new Date(2022, 3, 5, 0, 0, 0, 0)
                testTask.end = new Date(2022, 4, 8, 0, 0, 0, 0)

                const testEstimation1 = new ProjectTaskUnitEstimationVm()
                testEstimation1.id = "asdfasdfsdf"
                testEstimation1.unitName = "Отдел программирования РСУ"
                testEstimation1.chiefSpecialistHours = 120
                testEstimation1.leadEngineerHours = 40
                testEstimation1.engineerOfTheSecondCategoryHours = 90
                testEstimation1.engineerOfTheFirstCategoryHours = 40
                testEstimation1.engineerOfTheThirdCategoryHours = 120
                testEstimation1.techniclaWriterHours = 900

                const testEstimation2 = new ProjectTaskUnitEstimationVm()
                testEstimation2.id = "dfgsdfg"
                testEstimation2.unitName = "Отдел программирования СУПП"
                testEstimation2.chiefSpecialistHours = 800

                const testEstimation3 = new ProjectTaskUnitEstimationVm()
                testEstimation3.id = "iuthoi3hti2hpi"
                testEstimation3.unitName = "Отдел программирования с очень длинным именем"
                testEstimation3.engineerOfTheThirdCategoryHours = 16

                testTask.estimations = [testEstimation1, testEstimation2, testEstimation3]

                newTasks = [...newTasks, testTask]
                projectInfo.tasks = newTasks
                ProjectDetailedInfoVmHelper.init(projectInfo)
                state = projectInfo
            }

            requestDetails()
        }
    }
})

export const { useLoad: load } = projectDetailsSlice.actions
export const selectProjectDetails = (state: RootState) => state.projectDetails
export default projectDetailsSlice.reducer
