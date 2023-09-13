import { ConsoleColorLog } from "../ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../ConsoleColorLog/LogColors";

export class ScreenAction {
    private screenActionName = "";
    private screenActionDOMRef = "";

    constructor(screenActionName: string, screenActionDOMRef: string){

        if(screenActionName.length === 0 || screenActionDOMRef.length === 0){
            throw new Error(`Provided Screen Action with name ${screenActionName} and action DOM ref ${screenActionDOMRef} cannot be empty`);
        }

        this.screenActionName = screenActionName;
        this.screenActionDOMRef = screenActionDOMRef;

        this.isJquerySelectorValid(screenActionName, screenActionDOMRef);
    }

    public getScreenActionName(): string {
        return this.screenActionName;
    }
    
    public getScreenActionDOMRef(): string {
        return this.screenActionDOMRef;
    }
    
    public isJquerySelectorValid(screenActionName: string, screenActionDOMRef: string): void {
        try{
            $(screenActionDOMRef);
        }catch(err){
            ConsoleColorLog.singleLog(`The Jquery selector set for ScreenAction: ${screenActionName} is not valid: `, screenActionDOMRef, LogColors.RED);
        }
    }
}