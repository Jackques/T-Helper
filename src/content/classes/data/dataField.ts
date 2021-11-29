import { baseTypes, logicContainer } from "src/content/interfaces/logicContainer.interface";
import { uniqueEntryChecker } from "../util/uniqueEntryChecker";
import { GhostStatus } from "./dataItems/dataItemGhost";

export class DataField {
    public title: string;
    public description: string;
    public requiredField: boolean;
    public requiresUI: boolean;
    public multipleDataEntry: boolean;
    public mustBeUnique: boolean;
    public autoGather: boolean;
    public onlyGatherOnce: boolean;

    public dataLogic: logicContainer;
    public dataEntries: any[] = [];

    private _uniqueIdentifier:uniqueEntryChecker = new uniqueEntryChecker();

    constructor(title:string, description:string, requiredField:boolean, requiresUI:boolean, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        this.title = title;
        this.description = description;
        this.requiredField = requiredField;
        this.requiresUI = requiresUI; //determines if the fields is visible in UI
        this.multipleDataEntry = multipleDataEntry;
        this.mustBeUnique = mustBeUnique;
        this.autoGather = autoGather; //if true, then check in the provided dataSource if e.g. a numnber already exists. if not assign a new (increment from the former) number to this person
        this.onlyGatherOnce = onlyGatherOnce;

        this.dataLogic = dataLogic;
    }

    public addDataEntry(dataEntry:unknown):void {
        if(!this.isDataEntryValid(dataEntry)){
            //todo: create a notification system whereby me (the user) is notified through UI instead of console
            console.error('Incompatible dataEntry type with ptovided dataEntry type');
            return;

        }
        // todo: Create dataEntry class & objects for here to add. Properties must be: an incremented no, date & time? the data itself (depends on each type of data), auto-checking correct type of data received, etc? 

        // here in this method i do: check if the added data..
        // 1. can be added due to multipleDataEntry setting?
        // 2. must be unique check? if checked, check if given data is unique
        // 3. autoGather.. so idk? call something which gathers the data for this classobject?
        // 4. if one entry already exists, prevent the addition of multiple entries (e.g. i can change my attractiveness rating of a girl afterwards thus allowing multiple, but if i got a match with her or not is really only added once, thus should be prevented from adding the same data again)
        //todo: actually enter the data
    }

    // public isDataEntryValid(dataEntry: unknown): boolean { //because apparantly it cannot find this otherwise
    public isDataEntryValid = (dataEntry: unknown): boolean => {

        if(!this._isBaseTypeSet(this.dataLogic.baseType) || !this._isDataEntryNotEmpty(dataEntry)){
            return false;
        }

        if(this.mustBeUnique && !this._isDataEntryUnique('noDataEntry', dataEntry)){
            console.error(`dataEntry: ${dataEntry} for title: ${this.title} does not have a unique numebr.`)
        }

        const typeDataEntry:"string" | "number" | "boolean" | "object" | null = this._getTypeOfValue(dataEntry);
        console.log(`dataEntry: ${dataEntry}, type of dataEntry: ${typeDataEntry} and the field is: ${this.title} with required baseType: ${this.dataLogic.baseType}`);

        if(this.dataLogic.customCheckClass !== null){
            if(this.dataLogic.customCheckClass.isValidEntry(dataEntry)){
                console.log('INPUT ACCEPTED!');
                return true;
            }
            console.error(`The converted data entry (${dataEntry}) does not satisfy the check method set for ${this.title}`);
            return false;
        }

        switch (this.dataLogic.baseType) {
            case 'string': 
                if(typeDataEntry === 'string'){
                    console.log('INPUT ACCEPTED!');
                    return true;
                }
                console.error(`The data entry (${dataEntry}) provided for ${this.title} should be of type ${this.dataLogic.baseType} but was found to be of type ${this._getTypeOfValue(dataEntry)}`);
                return false;
            case 'boolean': 
                if(typeDataEntry === 'boolean'){
                    console.log('INPUT ACCEPTED!');
                   return true; 
                }
                console.error(`The data entry (${dataEntry}) provided for ${this.title} should be of type ${this.dataLogic.baseType} but was found to be of type ${this._getTypeOfValue(dataEntry)}`);
                return false;
            case 'number': 
                if(typeDataEntry === 'number'){
                    console.log('INPUT ACCEPTED!');
                    return true;
                }
                console.error(`The data entry (${dataEntry}) provided for ${this.title} should be of type ${this.dataLogic.baseType} but was found to be of type ${this._getTypeOfValue(dataEntry)}`);
                return false;
            case 'list': 
                console.error(`${this.title} lacks a checkMethod whilst baseType is a list. List datatype always requires a checkmethod.`);
                return false;
            default: 
                console.error(`The basetype provided for ${this.title} has an unknown type`);
                return false;
         }
    }

    private _isBaseTypeSet(baseType: baseTypes){
        if(!baseType){
            console.error(`No basetype and/or datalogic checkmethod was set for: ${this.title}`);
            return false;
        }
        return true;
    }

    private _isDataEntryNotEmpty(dataEntry: unknown){
        if(dataEntry === undefined || dataEntry === null || dataEntry === ""){
            console.error(`The data entry for  ${this.title} cannot be empty or of a falsy value. Value: (${dataEntry}).`);
            return false;
        }
        return true;
    }

    private _isDataEntryUnique(identifier: string, dataEntry: unknown):boolean {
        return this._uniqueIdentifier.isUniqueEntry(identifier, dataEntry);
    }
    
    

    //todo: create conversion methods; if i ever decide to;
    // add new data fields
    // change labels, type of data or data content.. to what was the data previously.. 
    // give me a prompt in which i can auto update my content to the newly desired contrent
    // this is for V2!!!

    private _getTypeOfValue(value: unknown):'string' | 'number' | 'boolean' | 'object' | null {
        switch (typeof(value)){
            case 'string':
                return 'string';
            case 'number':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'object':
                return 'object';
            default:
                return null;
        }
    }

}

export class DataFieldReactionSpeedList extends DataField {

    constructor(title:string, description:string, requiredField:boolean, requiresUI:boolean, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, requiresUI, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }
}

export class DataFieldReminderList extends DataField {
    
    constructor(title:string, description:string, requiredField:boolean, requiresUI:boolean, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, requiresUI, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }
}

export class DataFieldGhostsList extends DataField {
    
    constructor(title:string, description:string, requiredField:boolean, requiresUI:boolean, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, requiresUI, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }

    public updateMoment(updatedTime: string, updatedStatus: GhostStatus):void {
        if(this.dataLogic.customCheckClass === null){
            console.error('Could not update moment; no custom check class was set to check input.');
            return;
        }
        // if(this.dataLogic.customCheckClass.isValidEntry(updatedTime)){

        // }
        // if(dataGhosted._isValidTimeEntry(updatedTime) && dataGhosted._isValidStatus(updatedStatus)){
        //     this._timeSinceLastMessage = updatedTime;
        //     this._status = updatedStatus;
        // }else{
        //     console.error('Could not update moment. Updated time or updated status invalid');
        // }
    }
}