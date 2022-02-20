import { requiredProperty } from "src/content/interfaces/data/requiredProperty";
import { validEntry } from "src/content/interfaces/data/validEntry";

export abstract class dataCheck implements validEntry {
    requiredPropertiesList: requiredProperty[] = [];

    public isValidEntry(listEntry: unknown): boolean {
        console.warn(`No validations set for ???.`);
        //todo: provide title from dataField?
        return true;
    }

    public propertyChecker(requiredPropertiesList:requiredProperty[], listEntry: Record<string, unknown>):boolean{
        return requiredPropertiesList.every((property: requiredProperty)=> {
            if(!Object.prototype.hasOwnProperty.call(listEntry, property.label)){
                console.error(`Property ${property.label} is missing from provided value ${listEntry} for ???.`);
                return false;
            }
            return true;
        });
    }

    public argumentTypeChecker(requiredPropertiesList:requiredProperty[], listEntry: Record<string, unknown>):boolean {
        return requiredPropertiesList.every((property: requiredProperty)=> {
            if(!listEntry[property.label]){
                return true;
            }
            if(typeof listEntry[property.label] === property.type){
                return true;
            }
            console.error(`Property ${property.label} value is not of the required type (${property.type}) but is of type ${typeof listEntry[property.label]}. Value given: ${listEntry[property.label]}`);
            return false;
        });
    }

    public argumentChecker(requiredPropertiesList:requiredProperty[], listEntry: Record<string, unknown>): boolean {
        console.warn(`No validations set for values of properties from ???`);
        return true;
    }

    public checkListEntryByPropertiesAndTypes(requiredPropertiesList:requiredProperty[], listEntry: Record<string, unknown>){
        let result = false;
        result = this.propertyChecker(requiredPropertiesList, listEntry);
        result = result ? this.argumentTypeChecker(this.requiredPropertiesList, listEntry) : false;
        return result;
    }

    public getListEntryAsObjectList(listEntry: unknown): Array<Record<string, unknown>> | null {
        if(!Array.isArray(listEntry)){
            console.error(`The provided value for ??? is not a list`);
            return null;
        }
        return listEntry as Array<Record<string, unknown>>;
    }
    
}