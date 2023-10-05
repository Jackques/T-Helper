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
        new ScreenElement('Name', '*[data-testid="profile-name"]', '', true, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('Age', '*[data-testid="profile-age"]', '', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT, (value: string) => value.replace(", ", "").trim()),

        new ScreenElement('Job', getJobHappn, '', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('School', getSchoolHappn, '', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('Has-profiletext', getProfileTextHappn, '', false, ScreenRetrievalMethod.GET_ELEMENT_EXISTS),
        new ScreenElement('Is-verified', 'svg[data-testid="profile-badges-verified"]', '', false, ScreenRetrievalMethod.GET_ELEMENT_EXISTS),
        new ScreenElement('Amount-of-pictures', 'img[radius="large"]', '', false, ScreenRetrievalMethod.GET_ELEMENTS_AMOUNT),
    ], 'swipe', true, true),
    new Screen(ScreenNavStateComboTinder.Chat, [
        new ScreenAction('sendMessage', 'textarea[data-testid="sender-input"]')
    ], [], 'chat', false, false),
    new Screen(ScreenNavStateComboTinder.UnknownScreen, [

    ], [], 'other', false, false)
]

function getJobHappn(): HTMLElement | null {
    
    const workIconElement = $('[data-testid="BriefcaseIcon"]');
    if(!workIconElement || workIconElement.length === 0){
        console.warn(`Could not find work icon for job Screen Element`);
        return null;
    }

    const parentWorkIconElement = $(workIconElement).parent().parent();
    if(!parentWorkIconElement || parentWorkIconElement.length === 0){
        console.warn(`Could not find parent elements from work icon for job Screen Element`);
        return null;
    }

    const textElement = $(parentWorkIconElement).find("p:first");
    if(!textElement || textElement.length === 0){
        console.warn(`Could not find text containing job for job Screen Element`);
        return null;
    }

    return textElement[0];
}

function getSchoolHappn(): HTMLElement | null {
    
    const schoolIconElement = $('[data-testid="SchoolIcon"]');
    if(!schoolIconElement || schoolIconElement.length === 0){
        console.warn(`Could not find work icon for job Screen Element`);
        return null;
    }

    const parentSchoolIconElement = $(schoolIconElement).parent().parent();
    if(!parentSchoolIconElement || parentSchoolIconElement.length === 0){
        console.warn(`Could not find parent elements from work icon for job Screen Element`);
        return null;
    }

    const textElement = $(parentSchoolIconElement).find("p:first");
    if(!textElement || textElement.length === 0){
        console.warn(`Could not find text containing job for job Screen Element`);
        return null;
    }

    return textElement[0];
}

function getProfileTextHappn(): HTMLElement | null {
    const infoElement = $('[data-testid="infos-section"]');
    if(!infoElement || infoElement.length === 0){
        console.warn(`Could not find info element for profileText Screen Element`);
        return null;
    }

    const nextElement = infoElement.next();
    if(!nextElement || nextElement.length === 0){
        console.warn(`Could not find next element for infoElement for getting profileText Screen Element`);
        return null;
    }

    if(nextElement.is('div') && nextElement.children().length > 0){
        return nextElement[0];
    }

    return null;
}