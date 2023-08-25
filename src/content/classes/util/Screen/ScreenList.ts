import { Screen } from "./Screen";
import { ScreenNavStateComboTinder } from "./screenStateComboTinder.enum";

export class ScreenController {
    private screenList: Screen[] = [];
    private currentScreen: ScreenNavStateComboTinder = ScreenNavStateComboTinder.UnknownScreen;
    private previousScreen: ScreenNavStateComboTinder = ScreenNavStateComboTinder.UnknownScreen;

    constructor(screenList: Screen[]){
        this.screenList = screenList;
    }

    // TODO TODO TODO: Can io hopefully remove this soon to be unused method?
    public getActionDOMRef(screenName: ScreenNavStateComboTinder, screenActionName: string): string {
        const screen = this.getScreenByScreenName(screenName);
        return screen.getScreenActionActionDOMRefByActionName(screenActionName);
    }

    public updateCurrentScreen(newScreen: ScreenNavStateComboTinder): void {
        this.previousScreen = this.currentScreen;
        this.currentScreen = newScreen;
    }

    public isChatScreen(): boolean {
        // Gets if the UiHelpers need to be re-added after a single swipe on this screen.
        // e.g. in tinder on screens swipe & explore, you stay on the screen and get ready for another new swipe.
        // e.g. in tinder on screen swipegold, you open said screen, swipe, and you're back on the swipegold overview

        const currentScreen = this.screenList.find((screen)=>{
            return screen.getScreenName() === this.currentScreen;
        });

        if(!currentScreen){
            throw new Error(`Could not get screen ${this.currentScreen} in screen list. Please check the set screen list.`);
        }

        return currentScreen.getScreenIsChatScreen();
    }

    public isSwipeScreen(): boolean {
        // Gets if the UiHelpers need to be re-added after a single swipe on this screen.
        // e.g. in tinder on screens swipe & explore, you stay on the screen and get ready for another new swipe.
        // e.g. in tinder on screen swipegold, you open said screen, swipe, and you're back on the swipegold overview

        const currentScreen = this.screenList.find((screen)=>{
            return screen.getScreenName() === this.currentScreen;
        });

        if(!currentScreen){
            throw new Error(`Could not get screen ${this.currentScreen} in screen list. Please check the set screen list.`);
        }

        return currentScreen.getScreenIsSwipeScreen();
    }

    public isCurrentScreenMultiSwipe(): boolean {
        // Gets if the UiHelpers need to be re-added after a single swipe on this screen.
        // e.g. in tinder on screens swipe & explore, you stay on the screen and get ready for another new swipe.
        // e.g. in tinder on screen swipegold, you open said screen, swipe, and you're back on the swipegold overview

        const currentScreen = this.screenList.find((screen)=>{
            return screen.getScreenName() === this.currentScreen;
        });

        if(!currentScreen){
            throw new Error(`Could not get screen ${this.currentScreen} in screen list. Please check the set screen list.`);
        }

        return currentScreen.getScreenIsMultiSwipe();
    }

    public isCurrentScreenNeedsUIAdjustments(): boolean {
        // Gets if the screen needs UI adjustments
        // e.g. in tinder on the swipe screen it is preferable to take away a little bit of space on the right side of the screen

        const currentScreen = this.screenList.find((screen)=>{
            return screen.getScreenName() === this.currentScreen;
        });

        if(!currentScreen){
            throw new Error(`Could not get screen ${this.currentScreen} in screen list. Please check the set screen list.`);
        }

        return currentScreen.getScreenNeedsUiAdjustments();
    }

    // public getCurrentScreen(): ScreenNavStateComboTinder {
    //     return this.currentScreen;
    // }
    public getCurrentScreen(): Screen {
        const currentScreen = this.screenList.find((screen)=>{
            return screen.getScreenName() === this.currentScreen;
        });

        if(!currentScreen){
            throw new Error(`Could not get screen ${this.currentScreen} in screen list. Please check the set screen list.`);
        }

        return currentScreen;
    }

    private getScreenByScreenName(screenName: ScreenNavStateComboTinder): Screen {
        const screenAction = this.screenList.find(screen => screen.getScreenName() === screenName);
        if(!screenAction){
            throw new Error(`Screen action: ${screenName} was not found`);
        }

        return screenAction;
    }
}