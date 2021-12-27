export interface DataFieldTypes {
    label: string,
    checkDataMethod: (dataEntry: unknown) => boolean
}