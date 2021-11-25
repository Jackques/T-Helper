import { DataField } from "./dataField";
import { dataDate } from "./dataCheckLogic/dataDate";
import { dataAttractiveness } from "./dataCheckLogic/dataAttractiveness";
import { dataConversationVibe } from "./dataCheckLogic/dataConversationVibe";
import { dataGhosted } from "./dataCheckLogic/dataGhosted";
import { dataReactionSpeed } from "./dataCheckLogic/dataReactionSpeed";
import { dataReminders } from "./dataCheckLogic/dataReminders";

class DataRecord {
        /*
        Output:

        No                          - int
        Datum-liket                 - string datetime
        Naam                        - string any
        Leeftijd                    - int
        Heeft-profieltekst          - boolean
        Heeft-zinnige-profieltekst  - boolean
        Geverifieerd                - boolean
        Aantrekkelijkheidsscore     - int
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

    
    public usedDataFields:DataField[] = [
        new DataField('No', 'The number of the person', true, false, false, true, true, true, {baseType: 'number', checkMethod: null}),
        new DataField('Datum-liket', 'The datetime when I gave the like/sent my first message', true, false, false, false, true, true, {baseType: 'string', checkMethod: dataDate.isDate}),
        new DataField('Naam', 'The name of the person', true, false, false, false, true, true, {baseType: 'string', checkMethod: null}),
        new DataField('Leeftijd', 'The age of the person', false, false, false, false, true, true, {baseType: 'number', checkMethod: null}), // preferably getting this by birthdate otherwise just the age number is fine too
        new DataField('Heeft-profieltekst', 'Wether or not this person has some text on the profile', true, false, false, false, true, true, {baseType: 'boolean', checkMethod: null}),
        new DataField('Heeft-zinnige-profieltekst', 'Wether or not this person has some text on the profile', true, true, false, false, false, false, {baseType: 'boolean', checkMethod: null}),
        new DataField('Geverifieerd', 'Wether or not this person has some text on the profile', true, false, false, false, true, true, {baseType: 'boolean', checkMethod: null}),
        new DataField('Aantrekkelijkheidsscore', '', true, true, true, false, false, false, {baseType: 'number', checkMethod: dataAttractiveness.isValidEntry}), // NOTE! attractiveness rating on photo's can be 1, 2, 3, 6.5, 6, 7,5, 8 etc. but also: NAN (no photo available when there is litterally no photo?)
        new DataField('Match', 'Wether we have a match/she responded or not', true, false, false, false, true, false, {baseType: 'boolean', checkMethod: null}),
        new DataField('Datum-match', 'The datetime when I and the person had a match', true, false, false, false, true, false, {baseType: 'string', checkMethod: dataDate.isDate}),
        new DataField('Ander-eerste-bericht', 'If this person sent me a first message', true, false, false, false, true, false, {baseType: 'boolean', checkMethod: null}), // not-yet (if she did not yet send me a message within a certain time-period), no (if she did not send me a first message within a certain timeperiod after being matched), yes (if she did send me a first message within a certain time-period)
        new DataField('Ander-gereageerd', 'If this person responded to my first message', true, false, false, false, true, false, {baseType: 'boolean', checkMethod: null}),
        new DataField('Gesprek-op-gang', 'If this person sent at least one message in between my first 3 messages', true, false, false, false, true, false, {baseType: 'boolean', checkMethod: null}),
        new DataField('Gevoel-van-gemak-gesprek', 'The feeling of how easy & fun it is to have a conversation with this person ranging from 1 (very responsive & fun) to 6 (hardly responsive & teeth pulling)', false, true, true, false, false, false, {baseType: 'number', checkMethod: dataConversationVibe.isValidEntry}),
        new DataField('Hoe-vaak-ghost', 'How many times this person did not respond in a certain timeframe', false, false, true, false, true, false, {baseType: 'list', checkMethod: dataGhosted.isValidEntry}),
        new DataField('Nummer-verkregen', 'Did I get further contact details (e.g. phone number) from this person?', false, true, false, false, false, false, {baseType: 'boolean', checkMethod: null}),
        new DataField('Reactie-snelheid', 'The moments of time between each response', false, false, true, false, true, false, {baseType: 'list', checkMethod: dataReactionSpeed.isValidEntry}), // de dagen & tijden tussen de eerste nieuwe berichten vanuit de ander
        new DataField('Hoeveel-reminders', 'The amount of reminders I sent and if they worked', false, true, true, false, true, false, {baseType: 'list', checkMethod: dataReminders.isValidEntry}),
        new DataField('Blocked-of-geen-contact', 'If this person blocked me/deleted our conversation or indicated they did not wish further contact', false, true, false, false, true, false, {baseType: 'boolean', checkMethod: null}), // needs a UI too!
        new DataField('Geinteresseerd-sex', 'Wether this person has indicated to be interested in a hookup or not', false, true, false, false, false, false, {baseType: 'boolean', checkMethod: null}),
        new DataField('Potentiele-klik', 'Wether the vibe of the conversation was good enough to say "we clicked"', false, true, false, false, false, false, {baseType: 'boolean', checkMethod: null}),
        new DataField('Notities', 'Any interesting notes on this person', false, true, false, false, false, false, {baseType: 'string', checkMethod: null}),
    ];

    /*  ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN!
    'IsFake', // because maybe I want to keep track of how many fake profiles I encounter on any given app

    'Woonplaats', // because maybe I want to keep track of the distance between me and my (potential) match so I can take that variabele into account if many matches ghost e.g. because they may be too far away (tinder/happn happens to show me the distance, if not availble I can get the city at least (or ask the person myself) thus use this to calculate the distance from me: https://www.distance24.org/api.xhtml)

    'gaf-mij-compliment', // because maybe I want to keep track of how many compliments (physical? or about the personality?) this profile gets..
    'vibe-tags', // because I want to keep track of the characteristics // vibe i get from this person; religious, professional, posh, trashy, into-sports, outdoorsy, nerdy, dominant, submissive, sexual, etc.
        ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN! */

    // public getUsedDataFieldByName(title: string){
    //     //todo: method which !!POPUP!! can use to get the correct DataField object from this internal list
    // }
}