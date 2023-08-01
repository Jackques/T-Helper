import { CategoryStatus } from "./CategoryStatus";
import { LogColors } from "./LogColors";

export class ConsoleColorLog {

    private static currentActiveCategoryColor = LogColors.NONE;
    private static currentCategoryStatus = CategoryStatus.END;

    public static singleLog(message: string, value: unknown, color: LogColors = LogColors.LIGHTGREY): void {
        const colorValue = this._getValueColor(value);

        if(typeof value === "string" && value.length === 0){
            value = "EMPTY STRING"
        }
        // eslint-disable-next-line no-console
        debugger;
        console.log("%c" + message + " : " + "%c" + value, "color:" + color + "; font-weight:bold; background-color: "+ this.currentActiveCategoryColor+";", "color:" + colorValue);
    }

    public static multiLog(message: string, value: unknown, color: LogColors = LogColors.LIGHTGREY, hasUnderline: boolean): void {
        const colorValue = this._getValueColor(value);
        // eslint-disable-next-line no-console
        console.log("%c" + message + " :", "color:" + color + "; font-weight:bold; background-color: "+ this.currentActiveCategoryColor+";");
        // eslint-disable-next-line no-console
        console.log("%c" + value, "color:" + colorValue + "; font-weight:bold;");
        if(hasUnderline){
            // eslint-disable-next-line no-console
            console.log("%c ================================================", "color:" + color + ";");
        }
    }

    public static startCategorizedLogs(categoryStatus: CategoryStatus, color: LogColors = LogColors.LIGHTGREY): void {
        // starting multiple categories at the same time is not yet supported!

        if(categoryStatus === CategoryStatus.START && this.currentCategoryStatus === CategoryStatus.START){
            throw Error(`A currently started category cannot be started again. End the current category first.`);
        }

        if(categoryStatus === CategoryStatus.END && this.currentCategoryStatus === CategoryStatus.END){
            throw Error(`A currently ended category cannot be ended again. Start a new category first.`);
        }

        if(categoryStatus === CategoryStatus.START){
            this.currentCategoryStatus = CategoryStatus.START;
            this.currentActiveCategoryColor = color;
        }else{
            this.currentCategoryStatus = CategoryStatus.END;
            this.currentActiveCategoryColor = LogColors.NONE;
        }
    }

    private static _getValueColor(value: unknown): LogColors {
        let result = LogColors.LIGHTGREY;

        switch (typeof value) {
            case "boolean":
              result = value ? LogColors.GREEN : LogColors.RED;
              break;
            case null:
            case "undefined":
              result = LogColors.RED;
              break;
            default:
                result = LogColors.LIGHTGREY;
          }
          return result;
    }
}

/*
HINT: MULTIPLE COLORS IN 1 LINE IS POSSIBLE:
console.log(
  'Nothing here %cHi Cat %cHey Bear', // Console Message
  'color: blue',
  'color: red', // CSS Style
);
*/

