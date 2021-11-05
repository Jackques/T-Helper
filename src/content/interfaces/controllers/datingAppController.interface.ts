export interface datingAppController {
    listEndpoints: string[],
    getCredentials: () => boolean,
    getLiveData: () => void,
    getImportedData: () => void,
}