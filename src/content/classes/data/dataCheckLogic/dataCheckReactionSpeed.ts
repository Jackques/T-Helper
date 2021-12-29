import { validEntry } from "src/content/interfaces/data/validEntry";
import { dataCheck } from "./dataCheck";
import { Check } from "../../util/check";
import { requiredProperty } from "src/content/interfaces/data/requiredProperty";
import { DateHelper } from "../../util/dateHelper";

export class dataCheckReactionSpeed extends dataCheck implements validEntry {

    requiredPropertiesList:requiredProperty[] = [
        {label: 'datetimeMyLastMessage', type: 'string'}, 
        {label: 'datetimeTheirResponse', type: 'string'},
        {label: 'differenceInMS', type: 'number'}
    ];

    public isValidEntry(listEntry: Record<string, unknown>): boolean {
        const objList = this.getListEntryAsObjectList(listEntry);

        if(!objList){
            return false
        }
        if(objList.length === 0){
            return true;
        }
        return objList.every((obj:Record<string, unknown>) => {
            if(this.checkListEntryByPropertiesAndTypes(this.requiredPropertiesList, obj)){
                return this.argumentChecker(this.requiredPropertiesList, obj);
            }
            return false;
        });
    }

    public argumentChecker(requiredPropertiesList: requiredProperty[], listEntry: Record<string, unknown>): boolean {
        const hasRequiredArguments = requiredPropertiesList.every((requiredProperty:requiredProperty) => {
            if(requiredProperty.label === 'datetimeMyLastMessage' || requiredProperty.label === 'datetimeTheirResponse'){
                return DateHelper.isValidDate(listEntry[requiredProperty.label] as string)
            }else{
                return typeof listEntry[requiredProperty.label] === 'number';
            }
            
        });
        const differenceBetweenDates = DateHelper.getAmountMilisecondesBetweenDates(listEntry[requiredPropertiesList[0].label] as string, listEntry[requiredPropertiesList[1].label] as string);
        const isDifferenceDatesPositiveNumber = differenceBetweenDates !== undefined && differenceBetweenDates > 0 ? true : false;
        return hasRequiredArguments && isDifferenceDatesPositiveNumber;
    }

}