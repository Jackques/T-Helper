export class ScreenAction {
    private screenActionName = "";
    private screenActionDOMRef = "";
    // private swipeActionLike: string | null = null;
    // private swipeActionPass: string | null = null;
    // private swipeActionSuperlike: string | null = null;

    // private chatActionSendMessage: string | null= null;

    // 2. screen -> add swipe action 1 (like, "div>a>div.className", getText OR getAttributeValue, buttonClick), 
    // swipe action 2 (this swipe action was not found);
    // like, 
    // pass, 
    // superlike, 
    // extrasuperlikewithmessage,

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