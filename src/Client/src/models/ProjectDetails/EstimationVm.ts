export interface IEstimationVm{
    userPositionId: string
    userPositionIdent: string
    hours: number
}

export class EstimationVm implements IEstimationVm {
    userPositionId: string = ''
    userPositionIdent: string = ''
    hours: number = 0
}
