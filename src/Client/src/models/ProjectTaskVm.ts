import { ProjectTaskUnitEstimationVm } from "./ProjectTaskUnitEstimationVm";


export class ProjectTaskVm {
    id: string = '';
    start: string = '';
    end: string = '';
    description: string = '';
    estimations: ProjectTaskUnitEstimationVm[] = [];
}
