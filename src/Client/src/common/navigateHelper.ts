/**
 * Workaround for passing a navigate function to Handsontable renderers that cannot be extended by adding new props without changing the source code of the component
 */
export class NavigateHelper {
    public static navigateFunction: (url: string) => void;

    public static navigate(url: string) {
        if (NavigateHelper.navigateFunction){
            NavigateHelper.navigateFunction(url)
        }
    }
}