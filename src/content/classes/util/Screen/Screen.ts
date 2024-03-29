import { ScreenNavStateComboTinder } from "./screenStateComboTinder.enum";
import { ScreenAction } from "./ScreenAction";
import { ScreenType } from "./ScreenTypeEnum";
import { ScreenElement } from "./ScreenElement";

export class Screen {
    private screenName: ScreenNavStateComboTinder | null = null;
    private screenActionsList: ScreenAction[] = [];
    private screenElementsList: ScreenElement[] = [];
    private isSwipeScreen: ScreenType = ScreenType.OTHER;
    private isMultiSwipeScreen = false;
    private isNeedsUIAdjustments = false;

    constructor(screenName: ScreenNavStateComboTinder, screenActionsList: ScreenAction[], screenElementsList: ScreenElement[], screenType: string, isMultiSwipeScreen: boolean, isNeedsUIAdjustments: boolean){
        this.screenName = screenName;
        this.screenActionsList = screenActionsList;
        this.screenElementsList = screenElementsList;
        this.isSwipeScreen = this._setScreenType(screenType);
        this.isMultiSwipeScreen = isMultiSwipeScreen;
        this.isNeedsUIAdjustments = isNeedsUIAdjustments;
    }

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

    public clearValuesScreenElements(): void {
        this.screenElementsList.forEach((screenElement: ScreenElement) => {
            screenElement.clearValue();
        });
    }

    public getScreenIsChatScreen(): boolean {
        return this.isSwipeScreen === ScreenType.CHAT;
    }

    public getScreenIsSwipeScreen(): boolean {
        return this.isSwipeScreen === ScreenType.SWIPE;
    }

    public getScreenIsMultiSwipe(): boolean {
        return this.isMultiSwipeScreen;
    }

    public getScreenNeedsUiAdjustments(): boolean {
        return this.isNeedsUIAdjustments;
    }

    public getScreenElements(): ScreenElement[] {
        return this.screenElementsList;
    }

    private _setScreenType(screenType: string): ScreenType {
        switch (screenType) {
            case ScreenType.SWIPE:
                return ScreenType.SWIPE
            case ScreenType.CHAT:
                return ScreenType.CHAT
            case ScreenType.OTHER:
                return ScreenType.OTHER;
            default:
                throw new Error(`ScreenType: ${screenType} was not recognized. Please make sure the provided screenType is a recognized screen type as defined in the screen type enum.`);
        }
    }
}

// this class can contain logic for (attempting) to get DOM elements & check validity/existence of said elements

    