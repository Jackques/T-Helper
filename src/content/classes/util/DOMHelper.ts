export class DOMHelper {
    static getFirstDOMNodeByJquerySelector(jquerySelector: string): HTMLElement | null {
        const DOMNode: JQuery | null = $(jquerySelector);
        if (DOMNode && DOMNode.length > 0) {
            return DOMNode.first()[0] as HTMLElement;
        } else {
            return null;
        }
    }

    static getJqueryElementsByJquerySelector(jquerySelector: string): JQuery<HTMLElement> | null {
        const JqueryElements: JQuery | null = $(jquerySelector);
        if (JqueryElements && JqueryElements.length > 0) {
            return JqueryElements;
        } else {
            return null;
        }
    }

    static getJqueryElementsByFindingInJqueryElement($baseElement: JQuery<HTMLElement>, searchElementPath: string): JQuery<HTMLElement> | null {
        const baseElement: JQuery | null = $($baseElement);
        const JqueryElements: JQuery | null = $(searchElementPath);
        if (baseElement.length > 0 && JqueryElements.length > 0) {
            const foundElements = $($baseElement).find(searchElementPath);
            if(foundElements.length > 0){
                return foundElements;
            }
            return null;
        } else {
            return null;
        }
    }
}