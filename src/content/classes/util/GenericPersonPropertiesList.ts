export class GenericPersonPropertiesList {

    private personPropertiesList: GenericPersonProperty[] = [];

    public addPersonProperty(key: string, value: unknown, valueAsString: string): void {
        const genericPersonProperty = new GenericPersonProperty();
        genericPersonProperty.addGenericPersonProperty(key, value, valueAsString);

        this.personPropertiesList.push(genericPersonProperty);
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

class GenericPersonProperty {
    private key: string | null = null;
    private value: unknown | null = null;
    private valueAsString = '';
    
    public addGenericPersonProperty(key: string, value: unknown, valueAsString: string): void {
        if(value === null && valueAsString !== 'null'){
            console.info(`Person property: ${key} has been added but value is: ${value}, whilst valueAsString is set as: ${valueAsString}`);
        }
        if(!valueAsString || valueAsString.length === 0){
            console.error(`A person property value type cannot be of falsey value or empty string`);
        }

        this.key = key;
        this.value = value;
        this.valueAsString = valueAsString;
    }

    public getKey(): string {
        return this.key ? this.key : '';
    }

    public getValue(): unknown {
        return this.value;
    }

    public getValueAsString(): string {
        return this.valueAsString;
    }
}

