import { ScreenNavStateComboTinder } from "src/content/classes/util/Screen/screenStateComboTinder.enum";

export interface screenDOMHref {
    screenName: ScreenNavStateComboTinder;

    swipeActionLike: string,
    swipeActionPass: string,
    swipeActionSuperlike: string,

    chatActionSendMessage: string,
}
//todo: create a seperate class out of this, need to contain logic for getting/setting the appropiate classes for eacxh screen 
    // ALSO this class can contain logic for (attempting) to get DOM elements & check validity/existence of said elements