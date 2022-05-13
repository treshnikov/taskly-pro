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
}
