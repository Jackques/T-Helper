import { requiredProperty } from "src/content/interfaces/data/requiredProperty";
import { validEntry } from "src/content/interfaces/data/validEntry";
import { dataCheck } from "./dataCheck";

export class dataCheckMessage extends dataCheck implements validEntry {
    public requiredPropertiesList:requiredProperty[] = [
        {
            label: 'message', 
            type: 'string'
        }, {
            label: 'timestamp', 
            type: 'number'
        }, {
            label: 'author', 
            type: 'string'
        }
    ];

    public isValidEntry(listEntry: Record<string, unknown>): boolean {
        const objList = this.getListEntryAsObjectList(listEntry);
        let isPropertiesAndArgumentsValid = false;

        if(!objList){
            return false
        }
        if(objList.length === 0){
            return true;
        }
        isPropertiesAndArgumentsValid = objList.every((obj:Record<string, unknown>) => {
            if(this.checkListEntryByPropertiesAndTypes(this.requiredPropertiesList, obj)){
                return this.argumentChecker(this.requiredPropertiesList, obj);
            }
            return false;
        });
        return isPropertiesAndArgumentsValid;
    }

    public argumentChecker(requiredPropertiesList: requiredProperty[], listEntry: Record<string, unknown>): boolean {
        if(listEntry[requiredPropertiesList[0].label] === "" && listEntry[requiredPropertiesList[1].label] === "" && listEntry[requiredPropertiesList[2].label] === ""){
            // if all are undefined it means the message is empty/non-existant. No need to check this.
            return true;
        }
        const isMessage = typeof listEntry[requiredPropertiesList[0].label] === 'string' ? true : false;
        const hasTimestamp = typeof listEntry[requiredPropertiesList[1].label] === 'number' ? true : false;
        const hasAuthor = this._hasAuthor(<string>listEntry[requiredPropertiesList[2].label]);
        return isMessage && hasTimestamp && hasAuthor;
    }
    private _hasAuthor(value: unknown): boolean {
        if(value === ""){
            return true;
        }
        if(typeof value === 'string'){
            if(value === 'me' || value === 'match'){
                return true;
            }
            console.error('Author field cannot contain any other value than "me" or "match" indicating the author of this message');
            return false;
        }
        return false;
    }
}