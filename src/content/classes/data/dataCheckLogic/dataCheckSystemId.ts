import { validEntrySimple } from "src/content/interfaces/data/validEntrySimple";

export class dataCheckSystemId implements validEntrySimple {
    allowedPropertiesList: string[] = ['tinder', 'happn'];

    public isValidEntry(value: unknown): boolean {
        let isAllowedObject = false;
        let hasAllowedSingleAppType = false;
        let isValueString = false;

        if(typeof value === 'object'){
            const allowedObject:Record<string, unknown> = <Record<string, unknown>>value;
            isAllowedObject = Object.entries(allowedObject).length === 2 ? true : false;

            if(Object.prototype.hasOwnProperty.call(value, 'appType') && Object.prototype.hasOwnProperty.call(value, 'id')){

                if(typeof allowedObject['appType'] === 'string'){
                    hasAllowedSingleAppType = this.allowedPropertiesList.some(allowedProperty => allowedProperty === allowedObject['appType']);
                }
                if(typeof allowedObject['id'] === 'string' && allowedObject['id'].length > 0){
                    isValueString = true;
                }
            }
            
        }
        return isAllowedObject && hasAllowedSingleAppType && isValueString ? true : false;
    }
}