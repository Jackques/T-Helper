import { logicContainer } from "src/content/interfaces/logicContainer.interface";

export class DataField {
    public title: string;
    public description: string;
    public requiredField: boolean;
    public requiresUI: boolean;
    public multipleDataEntry: boolean;
    public mustBeUnique: boolean;
    public autoGather: boolean;
    public onlyGatherOnce: boolean;

    private dataLogic: logicContainer;
    public dataEntries: any[] = [];

    constructor(title:string, description:string, requiredField:boolean, requiresUI:boolean, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        this.title = title;
        this.description = description;
        this.requiredField = requiredField;
        this.requiresUI = requiresUI; //determines if the fields is visible in UI
        this.multipleDataEntry = multipleDataEntry;
        this.mustBeUnique = mustBeUnique;
        this.autoGather = autoGather;
        this.onlyGatherOnce = onlyGatherOnce;

        this.dataLogic = dataLogic;

        //todo: e.g. autoGather; if true, then check in the provided dataSource if e.g. a numnber already exists. if not assign a new (increment from the former) number to this person
    }

    public addDataEntry(dataEntry:unknown):void {
        // todo: Create dataEntry class & objects for here to add. Properties must be: an incremented no, date & time? the data itself (depends on each type of data), auto-checking correct type of data received, etc? 

        // here in this method i do: check if the added data..
        // 1. can be added due to multipleDataEntry setting?
        // 2. must be unique check? if checked, check if given data is unique
        // 3. autoGather.. so idk? call something which gathers the data for this classobject?
        // 4. if one entry already exists, prevent the addition of multiple entries (e.g. i can change my attractiveness rating of a girl afterwards thus allowing multiple, but if i got a match with her or not is really only added once, thus should be prevented from adding the same data again)
        if(!this.isDataEntryValid(dataEntry)){
            console.error('The data is not valid');
        }
        //todo: actually enter the data
    }

    public getTypeOfRequiredData(){
        /* 
        This method will be FOR CHECKING THE DATA STRUCTURE IN !!POPUP!! when checking for headers & values in order to;
        1. check if headers equal the headers defined here
        2. check if the data structure (e.g. date format) equals the data structure used in the data when reading the data (and provide a clear error indicating line and data when not and what the data structure SHOULD be)
        */
    }
    public isDataEntryValid(dataEntry: unknown): boolean {
        if(this.dataLogic.baseType === 'string'){
            if(this.dataLogic.checkMethod !== null){
                if(this.dataLogic.checkMethod(dataEntry)){
                    return true;
                }
                return typeof dataEntry === 'string' || dataEntry instanceof String;
            }
        }

        if(this.dataLogic.baseType === 'boolean'){
            if(this.dataLogic.checkMethod !== null){
                if(this.dataLogic.checkMethod(dataEntry)){
                    return true;
                }
                return typeof dataEntry === 'boolean' || dataEntry instanceof Boolean;
            }
        }

        if(this.dataLogic.baseType === 'number'){
            if(this.dataLogic.checkMethod !== null){
                if(this.dataLogic.checkMethod(dataEntry)){
                    return true;
                }
                return typeof dataEntry === 'number' || dataEntry instanceof Number;
            }
        }
        
        if(this.dataLogic.baseType === 'list'){
            if(this.dataLogic.checkMethod === null){
                console.error(`${this.title} lacks a checkMethod whilst baseType is a list`);
                return false;
            }
            //todo: continue here!
            console.error('lists not yet defined');
        }
        return false;
    }

}