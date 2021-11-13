class DataField {
    public title: string;
    public description: string;
    public multipleDataEntry: boolean;
    public mustBeUnique: boolean;
    public autoGather: boolean;
    public onlyGatherOnce: boolean;
    public dataEntries: any[] = [];

    constructor(title:string, description:string, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean){
        this.title = title;
        this.description = description;
        this.multipleDataEntry = multipleDataEntry;
        this.mustBeUnique = mustBeUnique;
        this.autoGather = autoGather;
        this.onlyGatherOnce = onlyGatherOnce;
    }

    public addDataEntry(dataEntry:any):void {
        // todo: Create dataEntry class & objects for here to add. Properties must be: date & time? the data itself (depends on each type of data), auto-checking correct type of data received, etc? 

        // here in this method i do: check if the added data..
        // 1. can be added due to multipleDataEntry setting?
        // 2. must be unique check? if checked, check if given data is unique
        // 3. autoGather.. so idk? call something which gathers the data for this classobject?
        // 4. if one entry already exists, prevent the addition of multiple entries (e.g. i can change my attractiveness rating of a girl afterwards thus allowing multiple, but if i got a match with her or not is really only added once, thus should be prevented from adding the same data again)
    }

    public getTypeOfRequiredData(){
        /* 
        This method will be FOR CHECKING THE DATA STRUCTURE IN !!POPUP!! when checking for headers & values in order to;
        1. check if headers equal the headers defined here
        2. check if the data structure (e.g. date format) equals the data structure used in the data when reading the data (and provide a clear error indicating line and data when not and what the data structure SHOULD be)
        */
    }

}