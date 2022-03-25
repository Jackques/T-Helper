import { requiredProperty } from "src/content/interfaces/data/requiredProperty";
import { validEntry } from "src/content/interfaces/data/validEntry";
import { Check } from "../../util/check";
import { dataCheck } from "./dataCheck";

export class dataCheckDistances extends dataCheck implements validEntry {
    public requiredPropertiesList: requiredProperty[] = [
        {
            label: 'dateTime', 
            type: 'string'
        }, {
            label: 'distanceInKM', 
            type: 'number'
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
        const isValidDate = Check.isValidDate(listEntry[requiredPropertiesList[0].label] as string)
        const isPositiveNumber = Check.isPositiveNumberEntry(<number>listEntry[requiredPropertiesList[1].label]);

        return isValidDate && isPositiveNumber;
    }

}