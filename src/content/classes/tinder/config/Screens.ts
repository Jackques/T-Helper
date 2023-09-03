import { Screen } from "../../util/Screen/Screen";
import { ScreenAction } from "../../util/Screen/ScreenAction";
import { ScreenElement } from "../../util/Screen/ScreenElement";
import { ScreenRetrievalMethod } from "../../util/Screen/ScreenRetrievalMethod.enum";
import { ScreenNavStateComboTinder } from "../../util/Screen/screenStateComboTinder.enum";

export const screens: Screen[] = [

new Screen(
    ScreenNavStateComboTinder.Swipe, [
        new ScreenAction('like', '.recsCardboard__cards div[class*="Bdc\\($c-ds-border-gamepad-like-default\\)"] button'),
        new ScreenAction('pass', '.recsCardboard__cards div[class*="Bdc\\($c-ds-border-gamepad-nope-default\\)"] button'),
        new ScreenAction('superlike', '.recsCardboard__cards div[class*="Bdc\\($c-ds-border-gamepad-super-like-default\\)"] button')
    ], [
        new ScreenElement('Name', '.recsCardboard__cards div.Ell', 'span[itemprop="name"]', true, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('Age', '.recsCardboard__cards div[class*="Animn\\($anim-slide-in-left\\)"]', 'span[itemprop="age"]', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),

        new ScreenElement('Job', getDOMPathForJob, 'div:last', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('School', getDOMPathForSchool, 'div:last', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
        new ScreenElement('City', getDOMPathForCity, 'div.C\\($c-ds-text-secondary\\)', true, ScreenRetrievalMethod.GET_TEXT_ELEMENT) //TODO TODO TODO: Check this
    ], 'swipe', true, true),
new Screen(ScreenNavStateComboTinder.SwipeGold, [
    new ScreenAction('like', 'div[class*="Bgi\\($g-ds-overlay-profile-button-gamepad\\)"] button:contains("Like"):not(:contains("Super"))'),
    new ScreenAction('pass', 'div[class*="Bgi\\($g-ds-overlay-profile-button-gamepad\\)"] button:contains("Nope")'),
    new ScreenAction('superlike', 'div[class*="Bgi\\($g-ds-overlay-profile-button-gamepad\\)"] button:contains("Super Like")')
], [
    new ScreenElement('Name', 'h1.Typs\\(display-1-strong\\)', '', true, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
    new ScreenElement('Age', 'span.Typs\\(display-2-strong\\)', '', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
    new ScreenElement('Job', getDOMPathForJob, 'div:last', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
    new ScreenElement('School', getDOMPathForSchool, 'div:last', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT),
    new ScreenElement('City', getDOMPathForCity, 'div:last', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT, (value: string) => value.replace("Woont in", "")),
    new ScreenElement('Has-profiletext', 'div.profileCard__card div[class*="$c-ds-background-primary"] div.BreakWord div', '', false, ScreenRetrievalMethod.GET_ELEMENT_EXISTS),
    new ScreenElement('Amount-of-pictures', 'div.profileCard__slider', 'span.keen-slider__slide', false, ScreenRetrievalMethod.GET_ELEMENTS_AMOUNT),
    new ScreenElement('Distance-in-km', getDOMPathForDistance, 'div[class*="$c-ds-text-secondary"]', false, ScreenRetrievalMethod.GET_TEXT_ELEMENT, (value: string) => value.replace(" km uit de buurt", "")),
], 'swipe', false, false),
new Screen(ScreenNavStateComboTinder.SwipeExplore, [
    new ScreenAction('like', 'div[class*="Bdc\\($c-ds-border-gamepad-like-default\\)"] button:contains("Like"):not(:contains("Super"))'),
    new ScreenAction('pass', 'div[class*="Bdc\\($c-ds-border-gamepad-nope-default\\)"] button:contains("Nope")'),
    new ScreenAction('superlike', 'div[class*="Bdc\\($c-ds-border-gamepad-super-like-default\\)"] button:contains("Super Like")')
], [], 'swipe', true, false),
new Screen(ScreenNavStateComboTinder.Chat, [
    new ScreenAction('sendMessage', "div.BdT > form > button[type='submit']")
], [], 'chat', false, false),
new Screen(ScreenNavStateComboTinder.UnknownScreen, [

], [], 'other', false, false)
]

function getDOMPathForJob(): HTMLElement | null {
    const jobSVG_D_properties = "M7.15 3.434h5.7V1.452a.728.728 0 0 0-.724-.732H7.874a.737.737 0 0 0-.725.732v1.982z";
    const jobDOMRow = $("path[d='"+jobSVG_D_properties+"']").first().parent().parent().parent().parent().get(0);

    if(jobDOMRow){
        return jobDOMRow;
    }
    return null;
}


function getDOMPathForSchool(): HTMLElement | null {
    const schoolSVG_D_properties = "M11.87 5.026L2.186 9.242c-.25.116-.25.589 0 .705l.474.204v2.622a.78.78 0 0 0-.344.657c0 .42.313.767.69.767.378 0 .692-.348.692-.767a.78.78 0 0 0-.345-.657v-2.322l2.097.921a.42.42 0 0 0-.022.144v3.83c0 .45.27.801.626 1.101.358.302.842.572 1.428.804 1.172.46 2.755.776 4.516.776 1.763 0 3.346-.317 4.518-.777.586-.23 1.07-.501 1.428-.803.355-.3.626-.65.626-1.1v-3.83a.456.456 0 0 0-.022-.145l3.264-1.425c.25-.116.25-.59 0-.705L12.13 5.025c-.082-.046-.22-.017-.26 0v.001zm.13.767l8.743 3.804L12 13.392 3.257 9.599l8.742-3.806zm-5.88 5.865l5.75 2.502a.319.319 0 0 0 .26 0l5.75-2.502v3.687c0 .077-.087.262-.358.491-.372.29-.788.52-1.232.68-1.078.426-2.604.743-4.29.743s-3.212-.317-4.29-.742c-.444-.161-.86-.39-1.232-.68-.273-.23-.358-.415-.358-.492v-3.687z";
    const schoolDOMRow = $("path[d='"+schoolSVG_D_properties+"']").first().parent().parent().parent().get(0);

    if(schoolDOMRow){
        return schoolDOMRow;
    }
    return null;
}

function getDOMPathForCity(): HTMLElement | null {
    const citySVG_D_properties = "M19.695 9.518H4.427V21.15h15.268V9.52zM3.109 9.482h17.933L12.06 3.709 3.11 9.482z";
    const cityDOMRow = $("path[d='"+citySVG_D_properties+"']").first().parent().parent().parent().parent().get(0);

    if(cityDOMRow){
        return cityDOMRow;
    }
    return null;
}
function getDOMPathForDistance(): HTMLElement | null {
    const distanceSVG_D_properties = "M11.436 21.17l-.185-.165a35.36 35.36 0 0 1-3.615-3.801C5.222 14.244 4 11.658 4 9.524 4 5.305 7.267 2 11.436 2c4.168 0 7.437 3.305 7.437 7.524 0 4.903-6.953 11.214-7.237 11.48l-.2.167zm0-18.683c-3.869 0-6.9 3.091-6.9 7.037 0 4.401 5.771 9.927 6.897 10.972 1.12-1.054 6.902-6.694 6.902-10.95.001-3.968-3.03-7.059-6.9-7.059h.001z";
    const distanceDOMRow = $("path[d='"+distanceSVG_D_properties+"']").first().parent().parent().parent().parent().get(0);

    if(distanceDOMRow){
        return distanceDOMRow;
    }
    return null;
}
