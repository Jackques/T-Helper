import { Screen } from "./Screen";
import { ScreenNavStateComboTinder } from "./screenStateComboTinder.enum";

export class ScreenList {
    private screenList: Screen[] = [];

    constructor(screenList: Screen[]){
        this.screenList = screenList;
    }

    public getActionDOMRef(screenName: ScreenNavStateComboTinder, screenActionName: string): string {
        const screen = this.getScreenByScreenName(screenName);
        return screen.getScreenActionActionDOMRefByActionName(screenActionName);
    }

    private getScreenByScreenName(screenName: ScreenNavStateComboTinder): Screen {
        const screenAction = this.screenList.find(screen => screen.getScreenName() === screenName);
        if(!screenAction){
            throw new Error(`Screen action: ${screenName} was not found`);
        }

        return screenAction;
    }
}