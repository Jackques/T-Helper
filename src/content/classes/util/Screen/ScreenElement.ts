import {DOMHelper} from "../DOMHelper";
import {ConsoleColorLog} from "../ConsoleColorLog/ConsoleColorLog";
import {LogColors} from "../ConsoleColorLog/LogColors";

export class ScreenElement {
    private name = "";
    private DOMPath = "";
    private errorIfNotFound = false;
    private DOMRetrievalMethod = ""; //TODO TODO TODO: probably want this to be an enum in the future

    private currentValue: string | undefined; //todo todo todo: is false allowed? i.e. when element could not be found (i.e. person not verified)

    constructor(name: string, DOMPath: string, errorIfNotFound: boolean, DOMRetrievalMethod: string){
        this.name = name;
        this.DOMPath = DOMPath;
        this.errorIfNotFound = errorIfNotFound;
        this.DOMRetrievalMethod = DOMRetrievalMethod;

        this._isDataValid();
        //todo todo todo: retrieval method for checking data which COULD not be there (get-element-exists) CANNOT have errorifNotFound? Oherwise throw error if user (me) attepts to set it so.
    }

    public collectData(): boolean {
        const element = DOMHelper.getFirstDOMNodeByJquerySelector(this.DOMPath);
        if(element !== null){

        }

        const errorMessage = `Could not find element by DOMPath: ${this.DOMPath}. Please check the DOMpath and retrieval method for screen element with name: ${this.name}`;

        if(this.errorIfNotFound){
            alert(errorMessage);
            throw new Error(errorMessage);
        }else{
            ConsoleColorLog.singleLog(errorMessage, false, LogColors.YELLOW);
        }
    }

    public getValueAsString(): string {
        if(!this._isCurrentValueSet()){
            throw Error(`Could not return currentValue as it is falsy: ${this.currentValue}`);
        }
        return this.currentValue as string;
    }

    public getValueAsNumber(): number {
        if(!this._isCurrentValueSet()){
            throw Error(`Could not return currentValue as it is falsy: ${this.currentValue}`);
        }

        const currentValueNumber = parseInt(this.currentValue as string);
        // todo todo todo: is NaN a falsy value? it is right?
        if(currentValueNumber){
            return currentValueNumber;
        }
        throw new Error(`Could not convert currentValue: ${this.currentValue} to number, attempted result is: ${currentValueNumber}`);
    }

    public getValueAsBoolean(): boolean {
        if(!this._isCurrentValueSet()){
            throw Error(`Could not return currentValue as it is falsy: ${this.currentValue}`);
        }

        return this.currentValue as unknown as boolean;
    }

    private _isDataValid(): void {
        switch (true) {
            case !this.name || this.name.length === 0:
                throw new Error(`Provided property name: ${this.name} is not valid`);
            case !this.DOMPath || this.DOMPath.length === 0:
                throw new Error(`Provided property name: ${this.DOMPath} is not valid`);
            case !this.DOMRetrievalMethod:
                // idea 1; simply implement method for every data type; string, number, boolean, listentry (distance) etc. anmd call the appropiate method
                // idea 2; 1 return method for returning the data, data is always a string but when specifically asking for i.e. for a number you can be sure the string can be converted to a number
                throw new Error(`Provided property name: ${this.DOMRetrievalMethod} is not valid`);
        }
    }
    private _isCurrentValueSet(): boolean {
        //todo todo todo: ensure that falsy value is allowed (but which one? null? undefined? or only false?) because boolean false is an allowed value
        return !!(this.currentValue && this.currentValue.length > 0);
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
}