export class UnitUserVm {
    id: string = ''
    name: string = ''
    type: number = 0 // 0 - unit, 1 - user
    children?: UnitUserVm[] = [] 
}