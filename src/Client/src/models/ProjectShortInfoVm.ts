import { dateAsShortStr } from "../common/dateFormatter"

export class ProjectShortInfoVm {
    id: string = ''
    name: string = ''
    shortName: string = ''
    company: string = ''
    isOpened: boolean = false
    isExternal: boolean = false
    projectManager: string = ''
    chiefEngineer: string = ''
    start: number = 0
    end: number = 0
    closeDate: number | null = 0
    сustomer: string = ''
    сontract: string = ''

    // calculated
    startAsStr: string = ''
    endAsStr: string = ''
    closeDateAsStr: string = ''

    public static init(arg: ProjectShortInfoVm) {
        arg.startAsStr =  dateAsShortStr(new Date(arg.start))
        arg.endAsStr = dateAsShortStr(new Date(arg.end))
        if (arg.closeDate) {
            arg.closeDateAsStr = dateAsShortStr(new Date(arg.closeDate))
        }
    }
}
