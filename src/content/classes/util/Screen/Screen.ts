import { ScreenNavStateComboTinder } from "./screenStateComboTinder.enum";
import { ScreenAction } from "./ScreenAction";

export class Screen {
    private screenName: ScreenNavStateComboTinder | null = null;
    private screenActionsList: ScreenAction[] = [];

    constructor(screenName: ScreenNavStateComboTinder, screenActionsList: ScreenAction[]){
        if(screenActionsList.length === 0){
            throw new Error(`Screen actions list provided for screen name: ${screenName} cannot be empty`);
        }
        this.screenName = screenName;
        this.screenActionsList = screenActionsList;
    }

    // public addNewScreen(screenName: ScreenNavStateComboTinder, screenActionsList: ScreenAction[]): void {
    //     if(screenActionsList.length === 0){
    //         throw new Error(`Screen actions list provided for screen name: ${screenName} cannot be empty`);
    //     }
    // }

    public getScreenName(): ScreenNavStateComboTinder | null {
        if(this.screenName){
            return this.screenName;
        } 
        return null;
    }

    public getScreenActionActionDOMRefByActionName(screenActionName: string): string {
        const screenAction = this.screenActionsList.find(screenAction => screenAction.getScreenActionName() === screenActionName);
        if(!screenAction){
            throw new Error(`Screen action: ${screenActionName} was not found`);
        }

        return screenAction.getScreenActionDOMRef();
    }
}

// this class can contain logic for (attempting) to get DOM elements & check validity/existence of said elements

    