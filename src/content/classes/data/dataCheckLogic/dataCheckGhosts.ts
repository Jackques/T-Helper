import { requiredProperty } from "src/content/interfaces/data/requiredProperty";
import { validEntry } from "src/content/interfaces/data/validEntry";
import { Check } from "../../util/check";
import { GhostStatus } from "../dataItems/dataItemGhost";
import { dataCheck } from "./dataCheck";

export class dataCheckGhosts extends dataCheck implements validEntry {

    public requiredPropertiesList:requiredProperty[] = [
        {
            label: 'number', 
            type: 'number'
        }, {
            label: 'timeSinceLastMessageMS', 
            type: 'number'
        }, {
            label: 'status', 
            type: 'string'
        }
    ];
    private _numberOfInstancesList:number[] = [];

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
        this.resetUniqueNumber();
        return isPropertiesAndArgumentsValid;

    }

    public argumentChecker(requiredPropertiesList: requiredProperty[], listEntry: Record<string, unknown>): boolean {
        const isNumberPositiveAndUnique = Check.isPositiveNumberEntry(<number>listEntry[requiredPropertiesList[0].label]) && this._isUniqueNumber(<number>listEntry[requiredPropertiesList[0].label]);
        const isTimeSinceLastMessageMSPositive = Check.isPositiveNumberEntry(<number>listEntry[requiredPropertiesList[1].label]);
        const isStatusValid = this._isValidStatus(<string>listEntry[requiredPropertiesList[2].label]);
        return isNumberPositiveAndUnique && isTimeSinceLastMessageMSPositive && isStatusValid;
    }

    private _isValidStatus(statusEntry: string):boolean {
        return statusEntry === GhostStatus.BLOCKED || statusEntry === GhostStatus.NOT_REPLIED || statusEntry === GhostStatus.REPLIED || statusEntry === GhostStatus.NOT_REPLIED_TO_REMINDER ? true : false;
    }

    private _isUniqueNumber(no:number):boolean {
        if(this._numberOfInstancesList.findIndex((numberedInstance:number) => numberedInstance === no) === -1){
            this._numberOfInstancesList.push(no);
            return true;
        }else{
            console.error(`Number already exists`);
            return false;
        }
    }

    public resetUniqueNumber():void{
        this._numberOfInstancesList = [];
    }

}