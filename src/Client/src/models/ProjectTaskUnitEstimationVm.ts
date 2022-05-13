
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

    static getTotalHours(arg: ProjectTaskUnitEstimationVm) {
        return arg.departmentHeadHours + arg.leadEngineerHours + arg.engineerOfTheFirstCategoryHours + arg.engineerOfTheSecondCategoryHours
            + arg.engineerOfTheThirdCategoryHours + arg.chiefSpecialistHours + arg.techniclaWriterHours;
    }

    static getHash(arg: ProjectTaskUnitEstimationVm) {
        var hash = 0, i, chr;
        if (arg.id.length === 0) return hash;
        for (i = 0; i < arg.id.length; i++) {
            chr = arg.id.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }

    static getColor(arg: ProjectTaskUnitEstimationVm) {
        const colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"];
        return colors[this.getHash(arg) % 32]
    }
}
