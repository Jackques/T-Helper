import {
    DataField,
    DataFieldGhostsList,
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
    private usedDataFields:DataField[] = [
        new DataFieldSystemNo('System-no', 'The number the system of the datingapp assigned this person to', false, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'string', customCheckClass: new dataCheckSystemId()}),
        new DataField('No', 'The number of the person for my app internaly', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, true, true, true, {baseType: 'number', customCheckClass: null}),
        
        // need to keep track of this myself, but since I'M swiping/liking this will not be a problem 
        new DataField('Date-liked-or-passed', 'The datetime when I gave the like/sent my first message/disliked/counsiously ignored this potential person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'string', customCheckClass: new dataCheckDate()}),
        new DataField('Name', 'The name of the person', false, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'string', customCheckClass: null}),
        new DataField('Age', 'The age of the person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'number', customCheckClass: null}), // preferably getting this by birthdate otherwise just the age number is fine too
        // in match.bio
        new DataField('Has-profiletext', 'Wether or not this person has some text on the profile', false, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Has-usefull-profiletext', 'Wether or not this person has some usefull text on the profile', true, { UIrequired: UIRequired.SELECT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Is-verified', 'Wether or not this person is verified', false, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, true, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Attractiveness-score', 'The attractiveness-level for this person', true, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.SLIDER }, true, false, false, false, {baseType: 'number', customCheckClass: new dataAttractiveness()}), // NOTE! attractiveness rating on photo's can be 1, 2, 3, 6.5, 6, 7,5, 8 etc. but also: NAN (no photo available when there is litterally no photo?)
        //todo: track wether the like given (or received?) is a normal like, superlike etc. Since the same concept also applies to toher dating apps,.. find a universal format for this.
        new DataField('Did-i-like', 'Wether I liked/showed interest in this person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        // simply compare the past/current matches list in records against the values received by getMatches()
        new DataField('Is-match', 'Wether we have a match/can talk/person liked me back or not', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        // in match.created_date = date match    
        new DataField('Date-match', 'The datetime when I and the person had a match/ability to talk', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'string', customCheckClass: new dataCheckDate()}),
        new DataField('Match-sent-first-message', 'If this person sent me a first message', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}), // not-yet (if she did not yet send me a message within a certain time-period), no (if she did not send me a first message within a certain timeperiod after being matched), yes (if she did send me a first message within a certain time-period)
        new DataField('Match-responded', 'If this person responded to my first message', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Conversation-exists', 'If this person responded to each of my first 3 messages to this person', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Vibe-conversation', 'The feeling of how easy & fun it is to have a conversation with this person ranging from 1 (very responsive & fun) to 6 (hardly responsive & teeth pulling)', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SLIDER }, true, false, false, false, {baseType: 'number', customCheckClass: new dataConversationVibe()}),
        new DataFieldGhostsList('How-many-ghosts', 'How many times this person did respond in a certain timeframe', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, true, false, true, false, {baseType: 'list', customCheckClass: new dataCheckGhosts()}),
        new DataField('Acquired-number', 'Did I get further contact details (e.g. phone number) from this person?', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataFieldReactionSpeedList('Response-speed', 'The moments of time between each response', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, true, false, true, false, {baseType: 'list', customCheckClass: new dataCheckReactionSpeed()}), // de dagen & tijden tussen de eerste nieuwe berichten vanuit de ander
        new DataFieldReminderList('Reminders-amount', 'The amount of reminders I sent and if they worked', true, { UIrequired: UIRequired.NONE, UIrequiredType: null }, true, false, true, false, {baseType: 'list', customCheckClass: new dataCheckReminders()}),
        new DataField('Blocked-or-no-contact', 'If this person blocked me/deleted our conversation or indicated they did not wish further contact', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, true, false, {baseType: 'boolean', customCheckClass: null}), // needs a UI too!
        new DataField('Interested-in-sex', 'Wether this person has indicated to be interested in a hookup or not', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Potential-click', 'Wether the vibe of the conversation was good enough to say "we clicked"', true, { UIrequired: UIRequired.CHAT_ONLY, UIrequiredType: UIRequiredType.SWITCH }, false, false, false, false, {baseType: 'boolean', customCheckClass: null}),
        new DataField('Notes', 'Any interesting notes on this person', true, { UIrequired: UIRequired.ALL, UIrequiredType: UIRequiredType.TEXTAREA }, false, false, false, false, {baseType: 'string', customCheckClass: null}),
    ];

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

    public getRecordPersonSystemId(appType: string): string {
        const labelPersonSystemid = 'System-no';
        const valueDataField:unknown | null = this.getValueOfDataFieldByTitle(labelPersonSystemid, {'appType': appType});
        if(valueDataField !== null && typeof valueDataField === 'object'){
            for(const [key, value] of Object.entries(valueDataField)){
                if(key === 'id'){
                    return value as string;
                }
            }
            return '';
        }
        return '';
    }

    public getNoDataRecord(): number | undefined {
        const currentRecordNumberValue: unknown = this.getValueOfDataFieldByTitle('No');
        if(typeof currentRecordNumberValue === 'number'){
            return currentRecordNumberValue as number;
        }else{
            return undefined;
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

    /**
     * Checks wether all data record values array provided in the param exist in the data record
     * @param {DataRecordValues[]} dataRecordValueList
     * @returns {boolean}
     */
    private isAllDataFieldsPresent(dataRecordValueList: DataRecordValues[]):boolean{
        return dataRecordValueList.every((dataRecordValue:DataRecordValues)=>{
            return this.usedDataFields.findIndex((usedDataField:DataField)=>{
                return usedDataField.title === dataRecordValue.label;
            }) !== -1 ? true : false
        })
    }

    private getIndexOfDataFieldByTitle(title: string):number{
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

    /*  ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN!
    'IsFake', // e.g. obvious catfishes, because maybe I want to keep track of how many (OBVIOUSLY) fake profiles I encounter on any given app
    'seemsFake', // e.g. IG-modellike profiles with whom no man ever matches? Or do (some) men match with them?
    'emptyProfiles', // e.g. how many empty profiles i encounter?

    'conversation', // HIGHLY recommended to simply save the entire conversation history. Why not? I can ALWAYS preform any kindoff logic on it to extract data from it.
    'Woonplaats', // because maybe I want to keep track of the distance between me and my (potential) match so I can take that variabele into account if many matches ghost e.g. because they may be too far away (tinder/happn happens to show me the distance, if not availble I can get the city at least (or ask the person myself) thus use this to calculate the distance from me: https://www.distance24.org/api.xhtml)

    //todo: TEST: the 'likes you' count (in the matches panel, which takes you to 'see who likes you'); does the api response (found in; https://api.gotinder.com/v2/fast-match/teaser?locale=nl&type=recently-active) tell you an exact number past what is shown (if you have more than 100 likes, 100+ is shown)? or does it stop at 100 despite you have more like than 100 (100+)? IF an exact number is gtiven past 100 if you have more than 100 likes.. then this info could be pretty valueble to log as well.. especially with a log list e.g; [{date, likescount}, {date, likescount}, {date, likescount} etc.]

    'type-of-match' //OPTIONAL tag; tells me the type of match e.g.; boost, super-like, normal etc.
    'show-average-number-matches-to-go' // maybe handy tool, not for logging data, but for comparing how many potential matches i can get with 1 profile (as done by my own research) and thus how many 'to-go' for my region etc. This 'visual indicator' might just help me get more of a grasp on how large/small my 'potential datingpool' really is.. which is exactly what i need (cause; abundance mindset)
    'how-many-times-i-ghosted' // because i get slacky and dont redspond?
    'gaf-mij-compliment', // because maybe I want to keep track of how many compliments (physical? or about the personality?) this profile gets..
    'vibe-tags', // because I want to keep track of the characteristics // vibe i get from this person; religious, professional, posh, trashy, into-sports, outdoorsy, nerdy, dominant, submissive, sexual, etc.
        ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN! */




//todo: why not simply return the list above as is? instead of only trying to return the checkDataMethod. 
//todo: maybe it would be better to put all the check logic inside the DataField classes and subclasses anyway?
    
    public getDataFieldTypes(allowedFieldsOnly?: boolean, requiredUIFieldsOnly?: boolean, requiredUiScreen?: UIRequired): DataFieldTypes[] {
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
        }).map((dataField: DataField) => {
            return { 'label': dataField.title, 'dataType': dataField.dataLogic.baseType, 'requiredFieldType': dataField.UISetting.UIrequiredType,'checkDataMethod': dataField.isDataEntryValid };
        });
    }

}

