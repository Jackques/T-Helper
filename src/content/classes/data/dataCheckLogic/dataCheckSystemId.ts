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

            if(Object.prototype.hasOwnProperty.call(value, 'appType') && Object.prototype.hasOwnProperty.call(value, 'id') || Object.prototype.hasOwnProperty.call(value, 'tempId')){

                if(typeof allowedObject['appType'] === 'string'){
                    hasAllowedSingleAppType = this.allowedPropertiesList.some(allowedProperty => allowedProperty === allowedObject['appType']);
                }else{
                    console.error('Property appType is not set on dataField SystemId');
                }

                if(typeof allowedObject['id'] === 'string' && allowedObject['id'].length > 0 || typeof allowedObject['tempId'] === 'string' && allowedObject['tempId'].length > 0){
                    isValueString = true;
                }else{
                    console.error('Property id or tempId is not set on dataField SystemId');
                }
            }
            
        }else{
            console.error('Provided value is not an object for dataField SystemId');
        }
        return isAllowedObject && hasAllowedSingleAppType && isValueString ? true : false;
    }
}