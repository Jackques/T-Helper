export class uniqueEntryChecker {
    private _uniqueTrackingList: Record<string, unknown[]> = {};

    //check if this uniqueTrackingList has an list with said property
    public isUniqueEntry(identifier: string, dataEntry: unknown):boolean{

        const allowedDataEntry: string | number | null = this._getStringOrNumberValue(dataEntry);
        if(allowedDataEntry === null){
            console.error(`Only numbers or strings can be marked unique. This entry was: ${dataEntry} with identifier: ${identifier}`);
            return false;
        }

        if(Object.prototype.hasOwnProperty.call(this._uniqueTrackingList, identifier)){
            // has the list

            // does it have the entry?
            if(this._uniqueTrackingList[identifier].findIndex((listItem) => listItem === allowedDataEntry) !== -1){
                // if so, return false, let parent method throw an error
                return false
            }else{
                // if not, add
                this._uniqueTrackingList[identifier].push(allowedDataEntry);
                
                return true;
            }

        }else{
            // does not have the list

            // create the list & add the list and entry
            this._uniqueTrackingList[identifier] = [];
            this._uniqueTrackingList[identifier].push(allowedDataEntry);
            return true;
        }
    }

    private _getStringOrNumberValue(dataEntry:unknown):string | number | null {
        if(typeof dataEntry === 'string'){
            return <string>dataEntry
        }else if(typeof dataEntry === 'number'){
            return <number>dataEntry
        }
        return null;
    }
        
}