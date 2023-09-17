import { Screen } from "../../util/Screen/Screen";
import { ScreenAction } from "../../util/Screen/ScreenAction";
import { ScreenElement } from "../../util/Screen/ScreenElement";
import { ScreenRetrievalMethod } from "../../util/Screen/ScreenRetrievalMethod.enum";
import { ScreenNavStateComboTinder } from "../../util/Screen/screenStateComboTinder.enum";

export const screensHappn: Screen[] = [

    new Screen(
        ScreenNavStateComboTinder.Swipe, [
        new ScreenAction('like', 'div[data-testid="action-list-container"] button[data-testid="profile-btn-like"]'),
        new ScreenAction('pass', 'div[data-testid="action-list-container"] button[data-testid="profile-btn-reject"]'),
        new ScreenAction('superlike', 'div[data-testid="action-list-container"] button[data-testid="profile-btn-flashnote"]')
    ], [
        new ScreenElement('Name', 'p[data-testid="profile-name"]', '', true, ScreenRetrievalMethod.GET_TEXT_ELEMENT, getHappnProfileName),//TODO TODO TODO: Get the position of the first comma i.e. "Lonneke, 25 jaar, 3 uur geleden.."
        new ScreenElement('Age', 'p[data-testid="profile-name"]', '', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT, getHappnProfileAge),
        new ScreenElement('Job', 'div[data-testid="profile-job"]', 'p:first', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('School', 'div[data-testid="profile-job"]', 'p:last', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('Has-profiletext', 'p[data-testid="profile-description"]', '', false, ScreenRetrievalMethod.GET_ELEMENT_EXISTS),
        new ScreenElement('Is-verified', 'svg[data-testid="profile-badges-verified"]', '', false, ScreenRetrievalMethod.GET_ELEMENT_EXISTS),
        new ScreenElement('Amount-of-pictures', 'div[data-testid="profile-image-container"]', '', false, ScreenRetrievalMethod.GET_ELEMENTS_AMOUNT),
    ], 'swipe', true, true),
    new Screen(ScreenNavStateComboTinder.Chat, [
        new ScreenAction('sendMessage', 'textarea[data-testid="sender-input"]')
    ], [], 'chat', false, false),
    new Screen(ScreenNavStateComboTinder.UnknownScreen, [

    ], [], 'other', false, false)
]

function getHappnProfileName(profileString: string): string {
    const seperatedProfileString = profileString.split(',');
    if(seperatedProfileString.length > 3){
        // if got more than three comma's in string, throw error (because something is wrong with name or not set correctly.. because MAYBE technically.. a name could contain a comma?)
        throw new Error(`Profile name string detected more than 3 comma's. Cannot accurately get name from this string without risking corrupted data. Please check the logic for getHappnProfileName.`);
    }

    if(seperatedProfileString[0].length === 0){
        // is string empty string? throw error.. something is wrong with the logic
        throw new Error(`Profile name string, name part appears to be empty string. Cannot accurately get name from this string without risking corrupted data. Please check the logic for getHappnProfileName.`);
    }

    return seperatedProfileString[0];
}

function getHappnProfileAge(profileString: string): string {
    const seperatedProfileString = profileString.split(',');

    if(seperatedProfileString.length > 3){
        throw new Error(`Profile name string detected more than 3 comma's. Cannot accurately get age from this string without risking corrupted data. Please check the logic for getHappnProfileAge.`);
    }

    if(seperatedProfileString[1].length === 0){
        // is string empty string? throw error.. something is wrong with the logic
        throw new Error(`Profile name string, age part appears to be emptry string. Cannot accurately get age from this string without risking corrupted data. Please check the logic for getHappnProfileAge.`);
    }

    const ageString: string = seperatedProfileString[1].replaceAll(/[^0-9]/g, '');
    return ageString;
}