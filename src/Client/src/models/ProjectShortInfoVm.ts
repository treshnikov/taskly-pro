export class ProjectShortInfoVm {
    id: string = ''
    name: string = ''    
    shortName: string = '' 
    company: string = '' 
    isOpened: boolean = false 
    projectManager: string = '' 
    chiefEngineer: string = '' 
    start: Date = new Date() 
    end: Date = new Date()
    closeDate: Date = new Date()
    сustomer: string = '' 
    сontract: string = ''     
}

export class ProjectTaskUnitEstimationVm {
    id: string = '';
    unitId: string = '';
    unitName: string = '';
    departmentHeadHours: number = 0;
    leadEngineerHours: number = 0;
    engineerOfTheFirstCategoryHours: number = 0;
    engineerOfTheSecondCategoryHours: number = 0;
    engineerOfTheThirdCategoryHours: number = 0;
    chiefSpecialistHours: number = 0;
    techniclaWriterHours: number = 0;
}

export class ProjectTaskVm {
    id: string = '';
    start: string = '';
    end: string = '';
    description: string = '';
    estimations: ProjectTaskUnitEstimationVm[] = [];
}

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