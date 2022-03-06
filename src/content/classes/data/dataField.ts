import { Message } from "src/message.interface";
import { baseTypes, logicContainer } from "src/content/interfaces/logicContainer.interface";
import { uniqueEntryChecker } from "../util/uniqueEntryChecker";
import { GhostStatus } from "./dataItems/dataItemGhost";

export enum UIRequired { SELECT_ONLY = 'select_only', CHAT_ONLY = 'chat_only', ALL = 'all', NONE = 'none' }
export enum UIRequiredType { TEXTAREA = 'textarea', ALPHANUMERIC_INPUT = 'alphanumeric-input', SLIDER = 'slider', SWITCH = 'switch' }

export interface UISetting {
    UIrequired: UIRequired,
    UIrequiredType: UIRequiredType | null,
}

export class DataField {
    public title: string;
    public description: string;
    public emptyFieldAllowed: boolean;
    public UISetting: UISetting;
    public multipleDataEntry: boolean;
    public mustBeUnique: boolean;
    public autoGather: boolean;
    public onlyGatherOnce: boolean;

    public dataLogic: logicContainer;
    protected dataEntry: unknown;
    protected dataEntryList: Record<string, unknown>[] = [];

    private _uniqueIdentifier:uniqueEntryChecker = new uniqueEntryChecker();

    constructor(title:string, description:string, emptyFieldAllowed:boolean, UISetting:UISetting, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        this.title = title;
        this.description = description;
        this.emptyFieldAllowed = emptyFieldAllowed;// why did i need this again? What the difference between this setting and the UISetting setting? Don;t i only need the UISetting setting? Idea; refactor this to a specific string keyword mentioning the required ui element needed e.g. 'radio'
        this.UISetting = UISetting; //determines if the fields is visible in UI
        this.multipleDataEntry = multipleDataEntry;
        this.mustBeUnique = mustBeUnique;
        this.autoGather = autoGather; //if true, then check in the provided dataSource if e.g. a numnber already exists. if not assign a new (increment from the former) number to this person
        this.onlyGatherOnce = onlyGatherOnce;

        this.dataLogic = dataLogic;

        if(!this._isDataFieldValid()){
            console.error(`Data field ${this.title} is not valid. Check the logs and update.`);
        }
    }

    public getValue(optionalArgumentsObject?: Record<string, unknown>): string | number | boolean | null {
        // console.log('uses getBaseValue from datafield');

        if(!this.hasValue()){
            return null;
        }

        if(this.dataEntryList.length > 0){
            console.error(`getValue method called on ${this.title} has not yet been inplemented. Please inplement this logic first`);
            return null;
        }else{
            switch (this.dataLogic.baseType) {
                case 'string': 
                    return this.dataEntry as string;
             
                case 'number': 
                    return this.dataEntry as number;

                case 'boolean': 
                    return this.dataEntry as boolean;

                default:
                    return null;
             }
        }
    }

    public hasValue(): boolean {
        if(this.dataEntryList.length > 0){
            return true;
        }
        if(this.dataEntry !== null || this.dataEntry !== undefined){
            return true;
        }
        return false;
    }
    public updateValueAllowed(): boolean {
        // if has value AND is multipleDataEntry -> can be updated, if has no value -> can be updated.. otherwise NO?
        // if has value AND is onlyGatherOnce = false -> can be updated, if has no value -> can be updated.. otherwise NO
        if(!this.hasValue()){
            return true;
        }

        if(this.dataEntryList.length > 0 && this.multipleDataEntry){
            return true;
        }

        if(this.dataEntry !== undefined && this.onlyGatherOnce){
            return true;
        }

        return false;
    }

    public addDataEntry(dataEntry:unknown):void {
        if(!this.isDataEntryValid(dataEntry)){
            //todo: create a notification system whereby me (the user) is notified through UI instead of console
            console.error('Incompatible dataEntry type with provided dataEntry type');
            return;
        }

        if(this.dataLogic.baseType === 'list'){
            const isArrayDataEntryList:Record<string, unknown>[] | null = this._getArrayDataEntryList(dataEntry)

            if(isArrayDataEntryList){
                if(this.multipleDataEntry){
                    if(isArrayDataEntryList !== null){
                        this.dataEntryList = [...this.dataEntryList, ...isArrayDataEntryList];
                    }
                }else{
                    this.dataEntryList = isArrayDataEntryList;
                }
            }
            
            
        }else{
            this.dataEntry = dataEntry;
        }
        
        // here in this method i do: check if the added data..
        // 1. can be added due to multipleDataEntry setting?
            // -> yep, must also be checked for this
        // 2. must be unique check? if checked, check if given data is unique
            // -> is that the responsibility of the field? or maybe the dataValue object?.. well only the field can control how many entries there already are AND if they're unique!?
        // 3. autoGather.. so idk? call something which gathers the data for this classobject?
            // -> not here, but must be done in tindercontroller
        // 4. if one entry already exists, prevent the addition of multiple entries (e.g. i can change my attractiveness rating of a girl afterwards thus allowing multiple, but if i got a match with her or not is really only added once, thus should be prevented from adding the same data again)
            // -> yup, must also be checked for this
    }

    public isDataEntryValid = (dataEntry: unknown): boolean => {

        if(!this._isBaseTypeSet(this.dataLogic.baseType)){
            return false;
        }

        // if the data entry is allowed to be empty, and IS empty
        if(this.emptyFieldAllowed && this._isDataEntryEmpty(dataEntry)){
            // return true because undefined/null/empty string is an acceptable value if empty field allowed is true
            return true;
        }

        //if the data entry is allowed to be empty, but data entry is not empty
        // continue with the check

        // if the data entry IS NOT allowed to be empty, but data entry IS empty AND the current entry is not null (empty)
        if(!this.emptyFieldAllowed && this._isDataEntryEmpty(dataEntry) && this.dataEntry !== null){
            console.error(`The data entry for  ${this.title} cannot be empty or of a falsy value. Value: (${dataEntry}).`);
            return false;
        }

        // if the data entry IS NOT allowed to be empty, but the data entry is not empty
        // continue with the check

        if(this.mustBeUnique && !this._isDataEntryUnique('noDataEntry', dataEntry) && dataEntry !== this.dataEntry){
            console.error(`dataEntry: ${dataEntry} for property: ${this.title} does not have a unique number.`)
        }

        const typeDataEntry:"string" | "number" | "boolean" | "object" | null = this._getTypeOfValue(dataEntry);

        if(this.dataLogic.customCheckClass !== null){
            if(this.dataLogic.customCheckClass.isValidEntry(dataEntry)){
                return true;
            }
            console.error(`The converted data entry (${dataEntry}) does not satisfy the check method set for ${this.title}`);
            return false;
        }

        switch (this.dataLogic.baseType) {
            case 'string': 
                if(typeDataEntry === 'string'){
                    return true;
                }
                console.error(`The data entry (${dataEntry}) provided for ${this.title} should be of type ${this.dataLogic.baseType} but was found to be of type ${this._getTypeOfValue(dataEntry)}`);
                return false;
            case 'boolean': 
                if(typeDataEntry === 'boolean'){
                   return true; 
                }
                console.error(`The data entry (${dataEntry}) provided for ${this.title} should be of type ${this.dataLogic.baseType} but was found to be of type ${this._getTypeOfValue(dataEntry)}`);
                return false;
            case 'number': 
                if(typeDataEntry === 'number'){
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

    private _isDataEntryEmpty(dataEntry: unknown){
        //todo: should refactor this to 1. convert unknown to a known type and 2. use a enum instead of true/false cause this aint working..

        if(this.dataLogic.baseType === 'list' && dataEntry instanceof Array){
            return dataEntry.every((dataEntryItem)=>{
                if(typeof dataEntryItem === 'object'){
                    return this._isObjectEntryEmpty(dataEntryItem as Record<string, unknown>);
                }else{
                    return this._isEntryEmpty(dataEntry);
                }
            });
        }
        
        if(typeof dataEntry === 'object' && dataEntry !== null){
            return this._isObjectEntryEmpty(dataEntry as Record<string, unknown>);
        }
        
        return this._isEntryEmpty(dataEntry);
    }

    private _isEntryEmpty(dataEntry: unknown){
        if(dataEntry === undefined || dataEntry === null || dataEntry === ""){
            return true;
        }
        return false;
    }

    private _isObjectEntryEmpty(dataEntry: Record<string, unknown>){
        const objectValues: unknown[] = Object.values(<Record<string, unknown>>dataEntry);
        if(objectValues.every(objectValue => objectValue === undefined || objectValue === null || objectValue === "")){
            return true;
        }
        return false;
    }

    private _isDataEntryUnique(identifier: string, dataEntry: unknown):boolean {
        return this._uniqueIdentifier.isUniqueEntry(identifier, dataEntry);
    }

    private _getArrayDataEntryList(dataEntry: unknown): Record<string, unknown>[] | null {
        if(Array.isArray(dataEntry)){
            return dataEntry;
        }
        return null;
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

    private _isDataFieldValid(): boolean {
        const isBaseTypeSet = this._isBaseTypeSet(this.dataLogic.baseType);
        const isUISettingValid = this._isUISettingValid(this.UISetting);
        return isBaseTypeSet && isUISettingValid ? true : false;
    }

    private _isUISettingValid(UISetting: UISetting): boolean {

        // if UIrequired is none, only 'none' may be given for field type
        if(UISetting.UIrequired === UIRequired.NONE && UISetting.UIrequiredType !== null){
            console.error(`UIRequired is set to ${UIRequired.NONE} thus the required type can only be of value ${null}`);
            return false;
        }

        // if UIrequired may only be one of certain types defined in UIrequired enum
        if(!Object.values(UIRequired).includes(UISetting.UIrequired)){
            console.error(`UIRequired may only be one of the following types: ${Object.values(UIRequired).toString()}`);
            return false;
        }
        // if UIrequiredType may only be one of certain types defined in UIrequiredType enum
        if(UISetting.UIrequiredType !== null && !Object.values(UIRequiredType).includes(UISetting.UIrequiredType)){
            console.error(`UIrequiredType may only be one of the following types: ${Object.values(UIRequiredType).toString()} or null if UIRequired is set to NONE`);
            return false;
        }

        return true;
    }
}

export class DataFieldSystemNo extends DataField {

    constructor(title:string, description:string, requiredField:boolean, UISetting:UISetting, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }

    public getValue(optionalArgumentsObject?: Record<string, unknown>): string | null {
        const appType: string | null = optionalArgumentsObject?.hasOwnProperty('appType') ? optionalArgumentsObject.appType as string : null;
        const valueObject: Record<string, string> = this.dataEntry as Record<string, string>;

        if(Object.prototype.hasOwnProperty.call(valueObject, 'appType') && valueObject['appType'] === appType){
            return this.dataEntry as string;
        }else{
            return null;
        }
    }

    public addDataEntry(dataEntry:unknown):void {
        if(!this.isDataEntryValid(dataEntry)){
            //todo: create a notification system whereby me (the user) is notified through UI instead of console
            console.error('Incompatible dataEntry type with provided dataEntry type');
            return;
        }
        
        this.dataEntry = dataEntry;
    }

}

export class DataFieldMessages extends DataField {
    private needsToBeUpdated = false;
    
    constructor(title:string, description:string, requiredField:boolean, UISetting:UISetting, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }

    public getValue(optionalArgumentsObject?: Record<string, unknown>): string | number | boolean | null {
        console.error(`getValue method called on DataFieldMessages has not yet been inplemented. Please inplement this logic first`);
        return null;
    }

    public getLastMessage(): Message | null {
        const messagesListLength: number = this.dataEntryList.length;
        //todo: figure out how to do this nicely; inheriting property from base class with a different type
        return messagesListLength > 0 ? this.dataEntryList[messagesListLength - 1] as unknown as Message : null;
    }

    public hasMessages(): boolean {
        return this.dataEntryList.length > 0 ? true : false;
    }

    public isNeedsToBeUpdated(): boolean {
        return this.needsToBeUpdated;
    }

    public setNeedsToBeUpdated(needsToBeUpdated: boolean): void {
        this.needsToBeUpdated = needsToBeUpdated;
    }

    public updateMessagesList(updatedMessagesList: Message[]): void {
        if(updatedMessagesList.length > 0){

            if(this.dataEntryList.length < updatedMessagesList.length){
                this.addDataEntry(updatedMessagesList);
                console.log(`WEW, LOOKS LIKE WE GOT A RECORD WHICH CONTAINS FEWER MESSAGES THAN WE GET FROM THE NEW MESSAGES LIST. Should be pretty much everyone INITIALLY?`);
            }else{

                const isAllNewMessagesPresent = updatedMessagesList.every((newMessage:Message)=>{
                    const indexNewMessage = this.dataEntryList.findIndex((dataEntry)=>{
                        return dataEntry as unknown as Message === newMessage;
                    })
                    return indexNewMessage !== -1 ? true : false;
                });
                if(!isAllNewMessagesPresent){
                    console.log(`OH BOY! LOOKS LIKE WE GOT A RECORD WHICH DOES NOT CONTAIN THE LATEST MESSAGES. WE NEED A TEST SCENARIO FOR THIS`);
                    this.setNeedsToBeUpdated(true);
                }

            }
        }
    }

    public getAllMessages(): Message[]{
        return this.dataEntryList as unknown as Message[];
    }
}

export class DataFieldReactionSpeedList extends DataField {

    constructor(title:string, description:string, requiredField:boolean, UISetting:UISetting, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }

    public getValue(optionalArgumentsObject?: Record<string, unknown>): string | number | boolean | null {
        console.error(`getValue method called on DataFieldReminderList has not yet been inplemented. Please inplement this logic first`);
        return null;
    }
}

export class DataFieldReminderList extends DataField {
    
    constructor(title:string, description:string, requiredField:boolean, UISetting:UISetting, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }

    public getValue(optionalArgumentsObject?: Record<string, unknown>): string | number | boolean | null {
        console.error(`getValue method called on DataFieldReminderList has not yet been inplemented. Please inplement this logic first`);
        return null;
    }
}

export class DataFieldGhostsList extends DataField {
    
    constructor(title:string, description:string, requiredField:boolean, UISetting:UISetting, multipleDataEntry:boolean, mustBeUnique:boolean, autoGather:boolean, onlyGatherOnce:boolean, dataLogic: logicContainer){
        super(title, description, requiredField, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    }

    public getValue(optionalArgumentsObject?: Record<string, unknown>): string | number | boolean | null {
        //todo: Inplement getValue for complex data objects (e.g. DataFieldGhosts, DataFieldReminder etc.) when needed. For now returning null suffices since these fields do not need to return their respective values.
        console.error(`getValue method called on DataFieldGhostsList has not yet been inplemented. Please inplement this logic first`);
        return null;
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
