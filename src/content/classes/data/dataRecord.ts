import {
    DataField,
    DataFieldDistances,
    DataFieldGhostsList,
    DataFieldMessages,
    DataFieldReactionSpeedList,
    DataFieldReminderList,
    DataFieldSystemNo,
    UIRequired,
    UIRequiredType
} from "./dataField";
import {dataCheckDate} from "./dataCheckLogic/dataCheckDate";
import {dataAttractiveness} from "./dataCheckLogic/dataCheckAttractiveness";
import {dataConversationVibe} from "./dataCheckLogic/dataCheckConversationVibe";
import {dataCheckGhosts} from "./dataCheckLogic/dataCheckGhosts";
import {dataCheckReactionSpeed} from "./dataCheckLogic/dataCheckReactionSpeed";
import {dataCheckReminders} from "./dataCheckLogic/dataCheckReminders";
import {DataRecordValues} from "src/content/interfaces/data/dataRecordValues.interface";
import {dataCheckSystemId} from "./dataCheckLogic/dataCheckSystemId";
import {DataFieldTypes} from "src/content/interfaces/data/dataFieldTypes.interface";
import { ScreenNavStateCombo } from "../tinder/screenStateCombo.enum";
import { dataCheckMessage } from "./dataCheckLogic/dataCheckMessage";
import { Message } from "src/message.interface";
import { dataCheckDistances } from "./dataCheckLogic/dataCheckDistances";
import { dataCheckListStrings } from "./dataCheckLogic/dataCheckListStrings";

export class DataRecord {
        
    /*
        Output:

        System-no                   - {appType: 'xxxx', id: 'x6x'}
        No                          - int
        Datum-liket                 - string datetime
        Naam                        - string any
        Leeftijd                    - int
        Heeft-profieltekst          - boolean
        Heeft-zinnige-profieltekst  - boolean
        Geverifieerd                - boolean
        Aantrekkelijkheidsscore     - int
        Liked/disliked              - boolean
        Match                       - boolean
        Datum-match                 - string datetime 
        Ander-eerste-bericht        - boolean
        Ander-gereageerd            - boolean
        Gesprek-op-gang             - boolean
        Gevoel-van-gemak-gesprek    - int
        Hoe-vaak-ghost              - [ {'datetime after time expired', 'time passed since my last message'} ]
        Nummer-verkregen            - boolean
        Reactie-snelheid            - [ {'time passed between my message to person and their first response'} ]
        Blocked-of-geen-contact     - string 'blocked' |  'said-no-contact' | 'available'
        Geinteresseerd-sex          - boolean
        Potentiele-klik             - boolean
        Notities                    - string any
        */

    //todo: to ensure proper nesting without errors; ensure the datafield labels / headers ONLY contain alphanumeric characters AND dashes.. nothing else
    //todo: maybe needs a systemNo or something? Just like No but specifically for the system
    public usedDataFields:DataField[] = [
        //Mandatory data fields
        new DataFieldSystemNo('System-no', 'The number the system of the datingapp assigned this person to', false, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'specialList', customCheckClass: new dataCheckSystemId()}),
        new DataField('No', 'The number of the person for my app internaly', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, true, true, true, {baseType: 'number', customCheckClass: null}),
        new DataFieldMessages('Messages', 'The messages sent between me and my match', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'specialList', customCheckClass: new dataCheckMessage()}),
        new DataField('Last-updated', 'The datetime this record has been last updated (including messages)', false, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'string', customCheckClass: new dataCheckDate()}),
        

        // need to keep track of this myself, but since I'M swiping/liking this will not be a problem 
        new DataField('Date-liked-or-passed', 'The datetime when I gave the like/sent my first message/disliked/counsiously ignored this potential person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'string', customCheckClass: new dataCheckDate()}),
        new DataField('Name', 'The name of the person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'string', customCheckClass: null}),
        new DataField('Age', 'The age of the person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'number', customCheckClass: null}), // preferably getting this by birthdate otherwise just the age number is fine too
        new DataField('City', 'The city this person lives in claimed by themself or tinder', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.ALPHANUMERIC_INPUT }, false, false, true, false, {baseType: 'string', customCheckClass: null}),
        new DataField('Job', 'The claimed job title this person holds', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.ALPHANUMERIC_INPUT }, false, false, true, false, {baseType: 'string', customCheckClass: null}),
        new DataField('Has-profiletext', 'Wether or not this person has some text on the profile', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Has-usefull-profiletext', 'Wether or not this person has some usefull text on the profile', true, { UIrequired: UIRequired.SELECT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Seems-fake', 'If a profile just seems too good to be true or is a pornstar quality of sorts', false, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Seems-empty', 'If a profile appear to have no identifying info whatsoever, maybe even simply a blank picture', true, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Seems-obese', 'If a profile seems to be very overweight to obese to worse than obese', true, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Seems-toppick', 'If a profile seems to be very attractive a normal person would never match with (i.e. instagram model like)', true, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Is-uitblinker-for-Me', 'If a match is very physically attractive and/or has a great personality to a degree that I (the creator of this app) would normally never dream of matching with such a hot & cool person', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),

        new DataField('Liked-me-first-is-instant-match', 'If this person liked me first thus resulting in an instant match upon me liking this person. Must set this field manually, if the match is not instant then I liked the person first', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),

        new DataFieldDistances('Distance-in-km', 'The reported distance of this person relative to me on a given datetime', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, true, false, false, false, {baseType: 'specialList', customCheckClass: new dataCheckDistances()}),
        new DataField('School', 'The claimed school this person attends/attended', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'string', customCheckClass: null}),
        new DataField('Gender', 'The gender of this person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'string', customCheckClass: null}),
        new DataField('Interests', 'The interests of this person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, true, false, true, false, {baseType: 'specialList', customCheckClass: new dataCheckListStrings()}),
        new DataField('Type-of-match-or-like', 'The type of match or like me and my match might have exchanged', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, true, false, true, false, {baseType: 'specialList', customCheckClass: new dataCheckListStrings()}),
        new DataField('Is-verified', 'Wether or not this person is verified', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Amount-of-pictures', 'The amount of pictures this person uses on their profile at the time of matching', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'number', customCheckClass: null}),
        new DataField('Attractiveness-score', 'The attractiveness-level for this person', true, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.SLIDER }, false, false, false, false, {baseType: 'number', customCheckClass: new dataAttractiveness()}), // NOTE! attractiveness rating on photo's can be 1, 2, 3, 6.5, 6, 7,5, 8 etc. but also: NAN (no photo available when there is litterally no photo?)
        new DataField(
                'Details-tags', 
                'Details I assume or know about this person to be true', 
                true, 
                { 
                    UIrequired: UIRequired.ALL, 
                    UIrequiredType: UIRequiredType.MULTISELECT 
                }, 
                false, 
                false, 
                false, 
                false, 
                {
                    baseType: 'stringList', 
                    customCheckClass: new dataCheckListStrings()
                }, 
                [
                    'seems-mom', 
                    'is-mom',
                    'seems-prettier-in-real-life',
                    'is-prettier-in-real-life',
                    'has-big-*****-not-obese',
                    'unclear-or-no-fullbody',
                    'seems-chubby', 
                    'is-chubby',
                    'seems-has-humor', 
                    'has-humor',
                    'seems-has-MY-humor',
                    'has-MY-humor',
                    'is-tourist',
                    'is-immigrant-or-expat',
                    'non-caucasian-but-Dutch',
                    'interested-in-ons',
                    'interested-in-fwb',
                    'interested-in-relationship-only',
                    'interested-in-friends-only',
                ]
        ), 
        new DataField(
            'Vibe-tags', 
            'The vibe or feeling I get from this person judging from their pictures & chat', 
            true, 
            { 
                UIrequired: UIRequired.ALL, 
                UIrequiredType: UIRequiredType.MULTISELECT 
            }, 
            false, 
            false, 
            false, 
            false, 
            {
                baseType: 'stringList', 
                customCheckClass: new dataCheckListStrings()
            }, 
            [
                'seems-bitchy', 
                'is-bitchy', 
                'seems-awesome-personality',
                'has-awesome-personality',
                'seems-travelfreak',
                'is-travelfreak',
                'seems-boring',
                'is-boring',
                'seems-nerdy',
                'is-nerdy',
                'seems-sweet',
                'is-sweet',
                'seems-tokkie',
                'is-tokkie',
                'seems-airhead',
                'is-airhead',
                'seems-toughgirl',
                'is-toughgirl',
                'seems-interested-in-ons-fwb-etc'
            ]
        ),
        new DataField('Seems-to-be-active', 'Wether a match showed signs of being active/online (i.e. updating pictures, updating profileText, etc.) despite potentially not responding', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        //todo: track wether the like given (or received?) is a normal like, superlike etc. Since the same concept also applies to toher dating apps,.. find a universal format for this.
        new DataField('Did-i-like', 'Wether I liked/showed interest in this person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Is-match', 'Wether we have a match/can talk/person liked me back or not', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Date-match', 'The datetime when I and the person had a match/ability to talk', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'string', customCheckClass: new dataCheckDate()}),
        new DataField('Match-sent-first-message', 'If this person sent me a first message', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}), // not-yet (if she did not yet send me a message within a certain time-period), no (if she did not send me a first message within a certain timeperiod after being matched), yes (if she did send me a first message within a certain time-period)
        new DataField('Match-responded', 'If this person responded to my first message', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Conversation-exists', 'If this person responded to each of my first 3 messages to this person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Vibe-conversation', 'The feeling of how easy & fun it is to have a conversation with this person ranging from 1 (very responsive & fun) to 6 (hardly responsive & teeth pulling)', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SLIDER }, false, false, false, false, {baseType: 'number', customCheckClass: new dataConversationVibe()}),
        new DataFieldGhostsList('How-many-ghosts', 'How many times this person did respond in a certain timeframe', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'specialList', customCheckClass: new dataCheckGhosts()}),
        new DataField('Acquired-number', 'Did I get further contact details (e.g. phone number) from this person?', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Date-of-acquired-number', 'The datetime I received contact details from this person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, false, false, {baseType: 'string', customCheckClass: new dataCheckDate()}),
        new DataFieldReactionSpeedList('Response-speed', 'The moments of time between each response', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'specialList', customCheckClass: new dataCheckReactionSpeed()}), // de dagen & tijden tussen de eerste nieuwe berichten vanuit de ander
        new DataFieldReminderList('Reminders-amount', 'The amount of reminders I sent and if they worked', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'specialList', customCheckClass: new dataCheckReminders()}),
        new DataField('Match-wants-no-contact', 'If this person indicated they did not wish further contact', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Blocked-or-removed', 'If this person certainly blocked my profile/removed us as match', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Date-of-unmatch', 'The datetime the match was removed', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'string', customCheckClass: new dataCheckDate()}),
        new DataField('Seemingly-deleted-profile', 'If this person seemingly (i.e. request to match profile returns a 404) deleted their profile', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Interested-in-sex', 'Wether this person has indicated to be interested in a hookup or not', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Potential-click', 'Wether the vibe of the conversation was good enough to say "we clicked"', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField(
            'Why-i-removed', 
            'The reason why I removed or cancelled the (match) connection with this person', 
            true, 
            { 
                UIrequired: UIRequired.CHAT_ONLY, 
                UIrequiredType: UIRequiredType.MULTISELECT 
            }, 
            false, 
            false, 
            false, 
            false, 
            {
                baseType: 'stringList', 
                customCheckClass: new dataCheckListStrings()
            }, 
            [
                'got-number', 
                'match-never-responded', 
                'nasty-person',
                'recognized-or-dated-previously',
                'matched-previously-on-datingapp-same-number',
                'is-scammer',
                'is-catfish',
                'accidental-like',
                'not-attracted-anymore',
                'old-match-before-app-no-longer-attracted',
                'old-match-before-app-match-never-responded'
            ]
        ),
        new DataField('Did-i-unmatch', 'If i am going to/have unmatched an existing match', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Notes', 'Any interesting notes on this person', true, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.TEXTAREA }, false, false, false, false, {baseType: 'string', customCheckClass: null}),
    ];

    constructor(){
        const mandatoryFieldsTitleList: string[] = [
            'System-no', 
            'No', 
            'Messages', 
            'Last-updated'
        ];
        const isAllMandatoryFieldsPresent = mandatoryFieldsTitleList.every(mandatoryFieldTitle => this.getIndexOfDataFieldByTitle(mandatoryFieldTitle) !== -1);
        if(!isAllMandatoryFieldsPresent){
            console.error(`Some data fields are missing or their title do not match the mandatory data fields title list. Please check the mandatory data fields list & the data fields which are present in dataRecord class.`);
        }
    }

    // why do this instead of simply creating object instances?
    /* 
    1. I can check if all data is present simply by using a method before i even need to create a class (or it creates an empty data class because the params did not pass the check)
    2. This is very usefull for checking the fields before i parse the entire thing in popup! I do not need instances of everything right away! (only one instance needed from dataRecord)
    3. Much like the usedDataFields; I can have a list of those without being tightly coupled with their respective classes; otherwise this class would need to know 
    */

    public addDataToDataFields(dataRecordValues:DataRecordValues[]):boolean{
        // check if all values in array match dataField names
        if(this.isAllDataFieldsPresent(dataRecordValues)){
            //if so, add data by label, value pairs, value can be entered by using the add method on the corresponding dataField
            dataRecordValues.forEach((dataRecordValue)=>{
                this.usedDataFields[this.getIndexOfDataFieldByTitle(dataRecordValue.label)].addDataEntry(dataRecordValue.value);
            });
            return true;
        }else{
            console.error('Missing some required data fields. Cannot add dataRecord');
            return false;
        }
    }

    public getRecordPersonSystemId(appType: string, onlyTempId?: boolean): string {
        const labelPersonSystemid = 'System-no';
        const valueDataField:unknown | null = this.getValueOfDataFieldByTitle(labelPersonSystemid, {'appType': appType});
        if(valueDataField !== null && typeof valueDataField === 'object'){
            for(const [key, value] of Object.entries(valueDataField)){
                if(key === 'id' && value && !onlyTempId){
                    return value as string;
                }
                if(key === 'tempId' && value){
                    return value as string;
                }
            }
            return '';
        }
        return '';
    }

    public getNoDataRecord(): number | null {
        const currentRecordNumberValue: unknown = this.getValueOfDataFieldByTitle('No');
        if(typeof currentRecordNumberValue === 'number'){
            return currentRecordNumberValue as number;
        }else{
            return null;
        }
    }

    public setNoDataRecord(no: number): void {
        if(no && typeof no === 'number'){
            if(no <= 0){
                console.error(`Provided numbner cannot be 0 or less`);
                return;
            }

            this.usedDataFields[this.getIndexOfDataFieldByTitle('No')].addDataEntry(no)
            return;
        }else{
            console.error(`No (valid) number provided to set No for this data record: ${this}`);
            return;
        }
        
    }

    public getDataRecordDataFields(): DataField[] | null {
        return this.usedDataFields.length > 0 ? this.usedDataFields : null;
    }

    public setUpdateMessages(isToBeUpdated: boolean): void {
        const dataMessagesField = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')] as DataFieldMessages;
        dataMessagesField.setNeedsToBeUpdated(isToBeUpdated);
    }

    public isNeedFieldMessagesBeUpdated(): boolean {
        const dataMessagesField = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')] as DataFieldMessages;
        return dataMessagesField.isNeedsToBeUpdated();
    }

    public getLatestMessage(): Message | null {
        const dataFieldMessages = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')] as DataFieldMessages;
        const lastMessage = dataFieldMessages.getLastMessage();
        return lastMessage && lastMessage ? lastMessage : null;
    }
    
    public hasMessages(): boolean {
        const dataFieldMessages = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')] as DataFieldMessages;
        return dataFieldMessages.hasMessages();
    }

    /**
     * Checks wether all data record values array provided in the param exist in the data record
     * @param {DataRecordValues[]} dataRecordValueList
     * @returns {boolean}
     */
    private isAllDataFieldsPresent(dataRecordValueList: DataRecordValues[]):boolean{
        return dataRecordValueList.every((dataRecordValue:DataRecordValues)=>{
            const indexDataFieldTitleInDataRecord = this.usedDataFields.findIndex((usedDataField:DataField)=>{
                return usedDataField.title === dataRecordValue.label;
            });
            if(indexDataFieldTitleInDataRecord !== -1){
                return true;
            }else{
                console.error(`Cannot find data record value: ${dataRecordValue.label}. Please ensure the app is up to date and all fields from imported profile exist in dataRecord usedDataFields list`);
                return false;
            }
        })
    }

    public getIndexOfDataFieldByTitle(title: string):number{
        return this.usedDataFields.findIndex((usedDataField)=>{
            return usedDataField.title === title;
        });
    }

    private getValueOfDataFieldByTitle(title: string, optionalArgumentsObject?: Record<string, unknown>):unknown | null {
        // check if 'system-no' exists
        const indexDataField:number = this.getIndexOfDataFieldByTitle(title);

        if(indexDataField >= 0){
            return this.usedDataFields[indexDataField].getValue(optionalArgumentsObject);
        }else{
            console.error(`Data field with title: "${title}" not found`);
        }
    }

    public getRecordValueObject(): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        this.usedDataFields.forEach((usedDataField)=>{

            if(usedDataField instanceof DataFieldSystemNo){
                result[usedDataField.title] = usedDataField.getValue({appType: 'tinder'});
            }else{
                // since JSON.stringify() removes any object key-value which contains undefined, it's better to set these values as null
                result[usedDataField.title] = usedDataField.getValue() === undefined ? null : usedDataField.getValue();
            }
            
        });
        return result;
    }

    public getValueLastUpdated(): string {
        const indexLastUpdatedDataField = this.getIndexOfDataFieldByTitle('Last-updated');
        if(indexLastUpdatedDataField !== -1){
            return this.usedDataFields[indexLastUpdatedDataField].getValue() as string
        }else{
            console.error(`Last updated field does not exist.`);
            return '';
        }
    }

    /*  ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN!

    'show-average-number-matches-to-go' // maybe handy tool, not for logging data, but for comparing how many potential matches i can get with 1 profile (as done by my own research) and thus how many 'to-go' for my region etc. This 'visual indicator' might just help me get more of a grasp on how large/small my 'potential datingpool' really is.. which is exactly what i need (cause; abundance mindset)

    'how-many-times-i-ghosted' // because i get slacky and dont redspond?
    'gaf-mij-compliment', // because maybe I want to keep track of how many compliments (physical? or about the personality?) this profile gets..
    'vibe-tags', // because I want to keep track of the characteristics // vibe i get from this person; religious, professional, posh, trashy, into-sports, outdoorsy, nerdy, dominant, submissive, sexual, etc.
        ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN! */


        //todo: maybe it would be better to put all the check logic inside the DataField classes and subclasses anyway?
    public getDataFields(allowedFieldsOnly?: boolean, requiredUIFieldsOnly?: boolean, requiredUiScreen?: UIRequired): DataField[] {
        return this.usedDataFields.filter((dataField: DataField) => {
            if(allowedFieldsOnly){
                if(dataField.updateValueAllowed()){
                    return true;
                }
                return false;
            }

            //todo: logic below is a huge mess, fix!
            if(requiredUIFieldsOnly){
                if(dataField.UISetting.UIrequired !== UIRequired.NONE){
                    if(dataField.UISetting.UIrequired === UIRequired.ALL){
                        return true;
                    }
                    if(requiredUiScreen !== undefined){
                        return dataField.UISetting.UIrequired === requiredUiScreen ? true : false;
                    }
                    return true;
                }
                return false;
            }
            // default returns all data fields
            return true;
        })
    }

}

