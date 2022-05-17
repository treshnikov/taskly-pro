export class ProjectShortInfoVm {
    id: string = ''
    name: string = ''
    shortName: string = ''
    company: string = ''
    isOpened: boolean = false
    type: number = 0 // 0 - internal, 1 - external
    projectManager: string = ''
    chiefEngineer: string = ''
    start: Date = new Date()
    end: Date = new Date()
    closeDate: Date = new Date()
    сustomer: string = ''
    сontract: string = ''
}
