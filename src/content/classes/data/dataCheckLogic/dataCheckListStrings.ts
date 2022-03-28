import { validEntry } from "src/content/interfaces/data/validEntry";
import { dataCheck } from "./dataCheck";

export class dataCheckListStrings extends dataCheck implements validEntry {

    public isValidEntry(listEntry: unknown[]): boolean {
        if(Array.isArray(listEntry)){
            const isEveryListItemEntryString = listEntry.every((listEntryItem)=>{
                return typeof listEntryItem === 'string';
            });
            if(isEveryListItemEntryString){
                return true;
            }
            console.error(`Every value received in ${listEntry} needs to be a string`);
            return false;
        }
        console.error(`Data received: ${listEntry} is not an array whilst an array was expected.`);
        return false;
    }

}