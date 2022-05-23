import { IProjectDetailedInfoVm } from "./ProjectDetailedInfoVm";

export class DepartmentsPlan {
    records: Map<string, number> = new Map()

    public static init(arg: DepartmentsPlan, project: IProjectDetailedInfoVm) {
        arg.records.clear();

        project.tasks?.forEach(task => {
            task.unitEstimations?.forEach(e => {
                const depName = e.unitName
                const hours = e.totalHours
                
                if (!arg.records.has(depName)) {
                    arg.records.set(depName, hours)
                }
                else {
                    const depHours = arg.records.get(depName) as number
                    arg.records.set(depName, depHours + hours)
                }
            });
        });
    }
}