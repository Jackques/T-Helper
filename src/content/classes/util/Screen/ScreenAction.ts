export class ScreenAction {
    private screenActionName = "";
    private screenActionDOMRef = "";

    constructor(screenActionName: string, screenActionDOMRef: string){

        if(screenActionName.length === 0 || screenActionDOMRef.length === 0){
            throw new Error(`Provided Screen Action with name ${screenActionName} and action DOM ref ${screenActionDOMRef} cannot be empty`);
        }

        this.screenActionName = screenActionName;
        this.screenActionDOMRef = screenActionDOMRef;
    }

    public getScreenActionName(): string {
        return this.screenActionName;
    }
    
    public getScreenActionDOMRef(): string {
        return this.screenActionDOMRef;
    }
}