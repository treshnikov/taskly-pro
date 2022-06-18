/**
 * Workaround for passing a functions to Handsontable renderers that cannot be extended by adding new props without changing the source code of the component
 */
export class ServicesStorageHelper {
    public static navigateFunction: (url: string) => void
    public static navigate(url: string) {
        if (ServicesStorageHelper.navigateFunction){
            ServicesStorageHelper.navigateFunction(url)
        }
    }

    public static translateFunction: (arg: string) => string
    public static t(arg: string) : string {
        if (ServicesStorageHelper.translateFunction){
            return ServicesStorageHelper.translateFunction(arg)
        }

        return ""
    }

    public static dispatchFunction: (arg: any) => any
    public static dispatch(arg: any) : any {
        if (ServicesStorageHelper.dispatchFunction){
            return ServicesStorageHelper.dispatchFunction(arg)
        }

        return null
    }


}