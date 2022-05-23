export interface IEstimationVm{
    id: string
    userPositionId: string
    userPositionIdent: string
    userPositionName: string
    hours: number
}

export class EstimationVm implements IEstimationVm {
    id: string = ''
    userPositionId: string = ''
    userPositionIdent: string = ''
    userPositionName: string = ''
    hours: number = 0
}
