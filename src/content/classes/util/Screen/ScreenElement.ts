import { DOMHelper } from "../DOMHelper";
import { ConsoleColorLog } from "../ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../ConsoleColorLog/LogColors";
import { ScreenRetrievalMethod } from "./ScreenRetrievalMethod.enum";

export class ScreenElement {
    private name = "";
    private DOMPath: string | (() => HTMLElement | null) = "";
    private DOMPathLastElement = "";
    private errorIfNotFound = false;
    private DOMRetrievalMethod: ScreenRetrievalMethod;
    private preManipulateValue: ((value: string) => string) | null = null;

    private currentValue: unknown;

    constructor(name: string, DOMPath: string | (() => HTMLElement | null), DOMPathLastElement: string, errorIfNotFound: boolean, DOMRetrievalMethod: ScreenRetrievalMethod, preManipulateValue?: ((value: string) => string)) {
        this.name = name;
        this.DOMPath = DOMPath;
        this.DOMPathLastElement = DOMPathLastElement;
        this.errorIfNotFound = errorIfNotFound;
        this.DOMRetrievalMethod = DOMRetrievalMethod;
        this.preManipulateValue = preManipulateValue ? preManipulateValue : null;

        this._isConfigDataValid();
        this._isErrorNotFoundIncorrect();
        this._isPreManipulateValueSet();
    }

    public collectData(): boolean {
        let elementPrePath: JQuery<HTMLElement> | null = null;
        // let result: string | null = null;
        // const elementPrePath: JQuery<HTMLElement> | null = typeof this.DOMPath === 'string' ? DOMHelper.getJqueryElementsByJquerySelector(this.DOMPath) : $(this.DOMPath() ? this.DOMPath() : "");
        if(typeof this.DOMPath === 'string'){
            elementPrePath = DOMHelper.getJqueryElementsByJquerySelector(this.DOMPath);
        }else if (typeof this.DOMPath === 'function'){
            const domPath = this.DOMPath();
            if(domPath){
                elementPrePath = $(domPath);
            }
        }
        
        if (elementPrePath !== null) {
            switch (this.DOMRetrievalMethod) {
                case ScreenRetrievalMethod.GET_TEXT_ELEMENT:
                    this.currentValue = this.getTextFromElement(elementPrePath, this.DOMPathLastElement);
                    return typeof this.currentValue === 'string' ? true : false;
                case ScreenRetrievalMethod.GET_ELEMENT_EXISTS:
                    this.currentValue = this.getIfElementExists(elementPrePath, this.DOMPathLastElement);
                    return typeof this.currentValue === 'boolean' ? true : false;
                case ScreenRetrievalMethod.GET_ELEMENTS_AMOUNT:
                    this.currentValue = this.getAmountOfElements(elementPrePath, this.DOMPathLastElement);
                    return typeof this.currentValue === 'number' ? true : false;
                default:
                    ConsoleColorLog.singleLog(`No implementation method configured for retrieval method: ${this.DOMRetrievalMethod}`, false, LogColors.RED);
                    return false;
            }
        }

        const errorMessage = `${this.name} - Could not find element by DOMPath/Function: ${this.DOMPath ? typeof this.DOMPath === 'string' : 'CHECK FUNCTION'}. Please check the DOMpath/function.`;

        if (this.errorIfNotFound) {
            alert(errorMessage);
            throw new Error(errorMessage);
        } else {
            ConsoleColorLog.singleLog(errorMessage, false, LogColors.YELLOW);
            return false;
        }
    }

    public getValueAsString(): string | undefined {
        if (!this._isCurrentValueValid()) {
            ConsoleColorLog.singleLog(`Could not return currentValue as it is falsy: ${this.currentValue}`, false, LogColors.RED);
            return undefined;
        }
        return this.currentValue as string;
    }

    public getValueAsNumber(): number | undefined {
        if (!this._isCurrentValueValid()) {
            ConsoleColorLog.singleLog(`Could not return currentValue as it is falsy: ${this.currentValue}`, false, LogColors.RED);
            return undefined;
        }

        const currentValueNumber = parseInt(this.currentValue as string);
        if (currentValueNumber) {
            return currentValueNumber;
        }

        ConsoleColorLog.singleLog(`Could not convert currentValue: ${this.currentValue} to number, attempted result is: ${currentValueNumber}`, false, LogColors.RED);
        return undefined;
    }

    public getValueAsBoolean(): boolean | undefined {
        if (!this._isCurrentValueValid()) {
            ConsoleColorLog.singleLog(`Could not return currentValue as it is falsy: ${this.currentValue}`, false, LogColors.RED);
            return undefined;
        }
        return this.currentValue as unknown as boolean;
    }

    public getName(): string {
        return this.name;
    }

    private _isConfigDataValid(): void {
        switch (true) {
            case !this.name || this.name.length === 0:
                throw new Error(`Provided property name: ${this.name} is not valid`);
            case typeof this.DOMPath === 'string' && this.DOMPath.length === 0 || !this.DOMPath:
                throw new Error(`Provided property name: ${this.DOMPath} is not valid`);
            case !this.DOMRetrievalMethod ? true : false:
                throw new Error(`Provided property name: ${this.DOMRetrievalMethod} is not valid`);
        }
    }

    private _isErrorNotFoundIncorrect(): void {
        if(this.errorIfNotFound && this.DOMRetrievalMethod === ScreenRetrievalMethod.GET_ELEMENT_EXISTS || this.errorIfNotFound && this.DOMRetrievalMethod === ScreenRetrievalMethod.GET_ELEMENTS_AMOUNT){
            throw new Error(`The setting to throw an error if element is not found (errorIfNotFound) cannot be ${this.errorIfNotFound} if the DOM retrieval method is set to ${this.DOMRetrievalMethod}`);
        }
    }

    private _isCurrentValueValid(): boolean {
        switch (this.DOMRetrievalMethod) {
            case ScreenRetrievalMethod.GET_TEXT_ELEMENT:
                return this.currentValue && typeof this.currentValue === 'string' ? true : false;
            case ScreenRetrievalMethod.GET_ELEMENT_EXISTS:
                return this.currentValue && typeof this.currentValue === 'boolean' ? true : false;
            case ScreenRetrievalMethod.GET_ELEMENTS_AMOUNT:
                return this.currentValue && typeof this.currentValue === 'number' ? true : false;
            default:
                throw new Error(`Unexpected ScreenRetrievalMethod which is not included in checking if the currentValue is valid.`);
        }
    }

    private getIfElementExists($element: JQuery<HTMLElement>, lastElementPath: string): boolean {
        if(lastElementPath.length === 0){
            return $element.length > 0 ? true : false;
        }
        return this._lastElementExists($element, lastElementPath);
    }

    private _isPreManipulateValueSet(): void {
        if(this.preManipulateValue && this.DOMRetrievalMethod !== ScreenRetrievalMethod.GET_TEXT_ELEMENT){
            throw new Error(`preManipulateValue is set on screenElement: ${this.name}, but DOMRetrievalMethod is not set to GET_TEXT_ELEMENT. Only the GET_TEXT_ELEMENT can have a preManipulateValue.`);
        }
    }

    private getTextFromElement($element: JQuery<HTMLElement>, lastElementPath: string): string {
        let resultText = '';
        if(lastElementPath.length === 0){
            resultText = $element.last().text();
            return resultText;
        }
        if (!this._lastElementExists($element, lastElementPath)) {
            ConsoleColorLog.singleLog(`Could not find element: ${lastElementPath}, tried to find it in DOMPath: ${this.DOMPath}`, false, LogColors.RED);
        }
        // resultText = $element.find(lastElementPath).last().text();
        const result = DOMHelper.getJqueryElementsByFindingInJqueryElement($element, lastElementPath);
        resultText = result && result.length > 0 ? result.last().text() : '';
        // debugger;

        if(this.preManipulateValue){
            resultText = this.preManipulateValue(resultText);
        }
        return resultText;
    }

    private getAmountOfElements($element: JQuery<HTMLElement>, lastElementPath: string): number {
        if(lastElementPath.length === 0){
            return $element.length;
        }
        if (!this._lastElementExists($element, lastElementPath)) {
            ConsoleColorLog.singleLog(`Could not find element: ${lastElementPath}, tried to find it in DOMPath: ${this.DOMPath}`, false, LogColors.RED);
        }
        // return $element.find(lastElementPath).length;
        const result = DOMHelper.getJqueryElementsByFindingInJqueryElement($element, lastElementPath);
        return result ? result.length : NaN;
    }

    private _lastElementExists($element: JQuery<HTMLElement>, lastElementPath: string): boolean {
        // const lastElement = $element.find(lastElementPath);
        const lastElement = DOMHelper.getJqueryElementsByFindingInJqueryElement($element, lastElementPath);
        if (!lastElement || lastElement.length === 0) {
            ConsoleColorLog.singleLog(`Could not find element: ${lastElementPath}, tried to find it in DOMPath: ${this.DOMPath}`, false, LogColors.RED);
            return false;
        }
        return true;
    }

    // data retrieval methods;
    // 1. get text from element (tip; can also search on [aria-label="???"]
    // name, age, distance
    // get text from element (from element by text start with..)
    // city (i.e. "Woont in ...")

    // 2. get if element exists (by text)
    // verified, op zoek naar 'iets serieus'/ 'iets casuals' / 'enkel avntuur' / 'etc.'
    // interesses (with use of sibling selector)

    // 3. get amount of elements
    // amount of pictures
    // tip: will need to reconfig DOMHelper.jquery get all results instead of first() method
}