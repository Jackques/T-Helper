import { UIRequiredType } from "src/content/classes/data/dataField";

export interface TemplateSetting {
    name: string,
    label: UIRequiredType,
    template: (id: string, label: string, dataType: string, defaultValue: string | number | boolean | null, values?: string[]) => string
    getValueMethod: (event: HTMLInputElement | HTMLSelectElement) => unknown
}