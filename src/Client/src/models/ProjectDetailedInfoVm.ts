import { ProjectTaskUnitEstimationVm } from "./ProjectTaskUnitEstimationVm";
import { ProjectTaskVm } from "./ProjectTaskVm";


export class ProjectDetailedInfoVm {
    id: number = 0;
    name: string = '';
    shortName: string = '';
    company: string = '';
    isOpened: boolean = false;
    projectManager: string = '';
    chiefEngineer: string = '';
    start: string = '';
    end: string = '';
    closeDate: string = '';
    customer: string = '';
    contract: string = '';
    tasks: ProjectTaskVm[] = [];

    static init(arg: ProjectDetailedInfoVm) {
        let sumEstimation = 0
        const maxLineHeight = 60;

        arg.tasks?.forEach(t => {
            t.estimations?.forEach(e => {
                sumEstimation += ProjectTaskUnitEstimationVm.getTotalHours(e)
            });
        });

        arg.tasks?.forEach(t => {
            t.estimations?.forEach(e => {
                e.lineHeight = Math.max(3, Math.trunc(maxLineHeight * (ProjectTaskUnitEstimationVm.getTotalHours(e) / sumEstimation)))
                e.color = ProjectTaskUnitEstimationVm.getColor(e)
            });
        });
    }
}
