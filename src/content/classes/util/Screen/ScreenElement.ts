import { DOMHelper } from "../DOMHelper";
import { ConsoleColorLog } from "../ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../ConsoleColorLog/LogColors";
import { ScreenRetrievalMethod } from "./ScreenRetrievalMethod.enum";

export class ScreenElement {
    private name = "";
    private DOMPath = "";
    private DOMPathLastElement = "";
    private errorIfNotFound = false;
    private DOMRetrievalMethod: ScreenRetrievalMethod;

    private currentValue: unknown;

    constructor(name: string, DOMPath: string, DOMPathLastElement: string, errorIfNotFound: boolean, DOMRetrievalMethod: ScreenRetrievalMethod) {
        this.name = name;
        this.DOMPath = DOMPath;
        this.DOMPathLastElement = DOMPathLastElement;
        this.errorIfNotFound = errorIfNotFound;
        this.DOMRetrievalMethod = DOMRetrievalMethod;

        this._isConfigDataValid();
        this._isErrorNotFoundIncorrect();
    }

    public collectData(): boolean {
        const elementPrePath = DOMHelper.getJqueryElementsByJquerySelector(this.DOMPath);
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

        const errorMessage = `Could not find element by DOMPath: ${this.DOMPath}. Please check the DOMpath.`;

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
            case !this.DOMPath || this.DOMPath.length === 0:
                throw new Error(`Provided property name: ${this.DOMPath} is not valid`);
            case !this.DOMPathLastElement || this.DOMPathLastElement.length === 0:
                throw new Error(`Provided property name: ${this.DOMPathLastElement} is not valid`);
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
        return this._lastElementExists($element, lastElementPath);
    }

    private getTextFromElement($element: JQuery<HTMLElement>, lastElementPath: string): string {
        if (!this._lastElementExists($element, lastElementPath)) {
            ConsoleColorLog.singleLog(`Could not find element: ${lastElementPath}, tried to find it in DOMPath: ${this.DOMPath}`, false, LogColors.RED);
        }
        const text = $element.find(lastElementPath).last().text();
        debugger;
        return text;
    }

    private getAmountOfElements($element: JQuery<HTMLElement>, lastElementPath: string): number {
        if (!this._lastElementExists($element, lastElementPath)) {
            ConsoleColorLog.singleLog(`Could not find element: ${lastElementPath}, tried to find it in DOMPath: ${this.DOMPath}`, false, LogColors.RED);
        }
        return $element.find(lastElementPath).length;
    }

    private _lastElementExists($element: JQuery<HTMLElement>, lastElementPath: string): boolean {
        const lastElement = $element.find(lastElementPath);
        if (lastElement.length === 0) {
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