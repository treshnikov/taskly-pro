export class DepartmentUserVm {
    id: string = ''
    name: string = ''
    type: number = 0 // 0 - dep, 1 - user
    children?: DepartmentUserVm[] = [] 
}