export class ScreenElement {
    private name = "";
    private DOMPath = "";
    private valueType = ""; //TODO TODO TODO: What to do with this? Should I check the value?
    private DOMRetrievalMethod = ""; //TODO TODO TODO: probably want this to be an enum in the future

    private currentValue;

    constructor(name: string, DOMPath: string, valueType: string, DOMRetrievalMethod: string){
        this.name = name;
        this.DOMPath = DOMPath;
        this.valueType = valueType;
        this.DOMRetrievalMethod = DOMRetrievalMethod;

        if(this._isDataValid()){

        }
    }

    private _isDataValid() {
        switch (true) {
            case !this.name || this.name.length === 0:
                throw new Error("Method not implemented.");
                break;
            case !this.DOMPath || this.DOMPath.length === 0:
                throw new Error("Method not implemented.");
                break;
            case this.valueType:
                    // idea 1; simply implement method for every data type; string, number, boolean, listentry (distance) etc. anmd call the appropiate method
                    // idea 2; 1 return method for returning the data, data is always a string but when specifically asking for i.e. for a number you can be sure the string can be converted to a number
                console.log('New');
                break;
        }
    }
}