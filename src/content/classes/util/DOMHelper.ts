export class DOMHelper {
    static getFirstDOMNodeByJquerySelector(jquerySelector: string): HTMLElement | null {
        const DOMNode: JQuery | null = $(jquerySelector);
        if(DOMNode && DOMNode.length > 0){
            return  DOMNode.first()[0] as HTMLElement;
        }else{
            return null;
        }
    }
}