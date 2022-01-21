import { UIRequiredType } from "src/content/classes/data/dataField";

export interface DataFieldTypes {
    label: string,
    dataType: string,
    requiredFieldType: UIRequiredType | null,
    checkDataMethod: (dataEntry: unknown) => boolean
}