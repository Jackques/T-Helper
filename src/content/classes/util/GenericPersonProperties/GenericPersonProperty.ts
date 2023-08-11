export class GenericPersonProperty {
    private key: string | null = null;
    private value: unknown | null = null;
    private valueAsString = '';

    public addGenericPersonProperty(key: string, value: unknown, valueAsString: string): void {
        if (value === null && valueAsString !== 'null') {
            console.info(`Person property: ${key} has been added but value is: ${value}, whilst valueAsString is set as: ${valueAsString}`);
        }

        this.key = key;
        this.value = value;
        this.valueAsString = valueAsString;
    }

    public updateValue(value: unknown, valueAsString?: string): boolean {
        this.value = value;
        this.valueAsString = valueAsString ? valueAsString : '';

        return true;
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
