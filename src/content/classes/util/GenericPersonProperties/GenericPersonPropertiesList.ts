import { GenericPersonProperty } from "./GenericPersonProperty";

export class GenericPersonPropertiesList {

    private personPropertiesList: GenericPersonProperty[] = [];

    public updatePersonProperty(key: string, value: unknown, valueAsString: string): void {
        const personPropertyIndex = this.personPropertiesList.findIndex((personProperty) => personProperty.getKey() === key);
        if(personPropertyIndex !== -1){
            this.personPropertiesList[personPropertyIndex].updateValue(value, valueAsString);
        } else {
            const genericPersonProperty = new GenericPersonProperty();
            genericPersonProperty.addGenericPersonProperty(key, value, valueAsString);
    
            this.personPropertiesList.push(genericPersonProperty);
        }
    }

    public getPersonGenericPropertyByPropName(propName: string): {key: string, value: unknown, valueAsString: string} | null {
        const indexPersonProperty = this.personPropertiesList.findIndex((personProperty)=>{
            return personProperty.getKey() === propName;
        });
        return indexPersonProperty !== -1 ? {
            key: this.personPropertiesList[indexPersonProperty].getKey(), 
            value: this.personPropertiesList[indexPersonProperty].getValue(), 
            valueAsString: this.personPropertiesList[indexPersonProperty].getValueAsString()
        } : null;
    }
}


