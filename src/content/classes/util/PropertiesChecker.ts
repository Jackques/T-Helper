export class PropertiesChecker {
    private _propertiesList: string[] = [];

    public setPropertiesList(list:string[]):boolean{
        if(this._propertiesList.length > 0){
            console.error('Properties list cannot be set untill current list is cleared');
            return false;
        }
        this._propertiesList = list;
        return true;
    }

    public clearPropertiesList():void {
        // this._propertiesList.length = 0;
        this._propertiesList = [];
    }

    public checkPropertyOnce(property: string):boolean{
        const indexPropertyInList: number = this._propertiesList.findIndex((propertyListItem) => propertyListItem === property);
        if(indexPropertyInList !== -1){
            //property exists in list, remove it, return true
            this._propertiesList.splice(indexPropertyInList, 1);
            return true;
        }else{
            //property does not exist in list, parent should throw error and return false
            return false;
        }

    }

    public getPropertiesList():string[]{
        return this._propertiesList;
    }
}