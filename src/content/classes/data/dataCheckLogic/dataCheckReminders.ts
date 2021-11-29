import { requiredProperty } from "src/content/interfaces/data/requiredProperty";
import { validEntry } from "src/content/interfaces/data/validEntry";
import { Check } from "../../util/check";
import { dataCheck } from "./dataCheck";

export class dataCheckReminders extends dataCheck implements validEntry  {

    requiredPropertiesList:requiredProperty[] = [{label: 'datetimeMyLastMessage', type: 'string'}, {label: 'datetimeReminderSent', type: 'string'}, {label: 'textContentReminder', type: 'string'}, {label: 'hasGottenReply', type: 'boolean'}];

    public isValidEntry(listEntry: unknown): boolean {

        //const newlistEntry = typeof listEntry === 'object' ?  <Record<string, unknown>>listEntry : {};
        const objList = this.getListEntryAsObjectList(listEntry);
        
        
        // TODO
        // for other files;
            // refactor all listEntry inputs type to Record<string, unknown> (like done here..)
        // ALSO; first check if listEntry is of type object (which may be part of a util type check method, which can also recognize object type a.k.a. record), if so.. continue

            // refactor requiredPropertiesList into objects; key = name of property, value = type of property (string, boolean etc.)
            // make a new method on dataCheck level (propertiestype checker)
            // have the method check if the arguments of the correct type
        
        // if above is true; return a new (casted or created) record of the listEntry.. NO! CREATE A SEPERATE METHOD FOR THIS. CREATE THE DATAITEM INSTANCE INSTEAD

        // which can be given to argument checker.. which in turns further checks the arguments for like; if the datestring is correct, number is in the correct range etc.
        // refactor the argument checker TO NOT CHECK types.. but only what is mentioned above

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
        let result = false;
        result = Check.isValidDate(listEntry[requiredPropertiesList[0].label] as string);
        result = Check.isValidDate(listEntry[requiredPropertiesList[1].label] as string);
        result = String(listEntry[requiredPropertiesList[2].label]).length > 0 ? true : false;
        return result;
    }

}
