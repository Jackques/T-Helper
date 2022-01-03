import { resolve } from "path";
import { datingAppController } from "src/content/interfaces/controllers/datingAppController.interface";
import { ParsedResultMatch } from "src/content/interfaces/controllers/ParsedResultMatch.interface";
import { Message, ParsedResultMessages } from "src/content/interfaces/http-requests/MessagesListTinder.interface";
import { Badges, Match, MatchListTinderAPI } from "src/content/interfaces/http-requests/MatchesListTinder.interface";
import { RequestHandler } from "src/content/interfaces/http-requests/RequestHandler.interface";
import { Matches } from "src/content/interfaces/tinder_api/matches.interface";
import { RequestHandlerTinder } from "../http-requests/requestHandlerTinder";
import { Person } from "../tinder/Person";
import { UIController } from "../tinder/UIController";
import { matchMockTwo } from "../mocks/matchesMock";
import { dataTable } from '../data/dataTable';
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataRecord } from "../data/dataRecord";
import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";
import { DateHelper } from "../util/dateHelper";
import { GhostStatus } from "../data/dataItems/dataItemGhost";
import { ScreenNavStateCombo } from "../tinder/screenStateCombo.enum";


export class TinderController implements datingAppController {
    private nameController = 'Tinder';
    listEndpoints = ['a', 'b', 'c'];
    hasCredentials = false;
    private dataRetrievalMethod: 'api' | 'dom' | null = null;

    private xAuthToken = '';
    private requestHandler!: RequestHandlerTinder; // 'definite assignment assertion proerty (!) added here, is this a good practice?'
    private UIController!: UIController;
    public matches: Person[] = [];
    private dataTable: dataTable;

    private currentScreenTimeoutId:number | null = null;
    private currentScreen: ScreenNavStateCombo = this.getCurrentScreenByDOM();

    constructor(dataRetrievalMethod: 'api' | 'dom' | null, dataTable: dataTable) {

        this.dataRetrievalMethod = dataRetrievalMethod;
        this.dataTable = dataTable;

        if (this.dataRetrievalMethod === 'api' || this.dataRetrievalMethod === 'dom') {
            if (this.dataRetrievalMethod === 'api') {
                this.hasCredentials = this.getCredentials();
                if (this.hasCredentials) {

                    //todo: test to see if auth token works by using a simple request first?
                    this.requestHandler = new RequestHandlerTinder();

                    //TODO: For each match (with the corresponding datingapp property in systemId), I should first get THEIR MATCHDATA & MATCHMESSAGES! Loop over it& update the data!

                    // Gather data (by api's OR (less preferably) DOM)
                    this.getDataByAPI(this.requestHandler, true).then((matches: ParsedResultMatch[] | undefined)=>{
                        
                        if(matches === undefined){
                            console.error(`Could not retrieve matches`);
                        }

                        //Extract data & add it to dataRecords
                        matches?.forEach((match: ParsedResultMatch)=>{

                            // Since Tinder sends the messages in the order from last to first, we must first reverse the messages to first to last
                            // since the .reverse() is applied to the array 'in place' instead of 'on output' applying it once will produce the array in desired format anywhere
                            match.matchMessages.reverse();

                            // get record index by systemid for each match
                            //TODO: TEST: SHOULD RETURN RECORDINDEX FOR FOUND MATCH (MOCK THIS)
                            const matchRecordIndex: number = dataTable.getRecordIndexBySystemId(match.match.id, this.nameController);
                            
                            let tinderMatchDataRecordValues: DataRecordValues[];
                            let allowedFields: DataFieldTypes[];

                            // eslint-disable-next-line no-debugger
                            // debugger;

                            //todo: update to equal to or greater than
                            if(matchRecordIndex < 0){
                                //TODO: if match doesnt exist, create new data record, fill new record with all data needed
                                // console.log(`Going to CREATE new data record for: ${match.match.person.name}`);
                                allowedFields = new DataRecord().getDataFieldTypes();
                                tinderMatchDataRecordValues = this.parseMatchDataToDataRecordValues(match, allowedFields);
                                dataTable.addNewDataRecord(tinderMatchDataRecordValues);
                            }else{
                                // console.log(`Going to UPDATE data record for: ${match.match.person.name}`);
                                allowedFields = dataTable.getAllowedFieldsByRecordIndex(matchRecordIndex);
                                tinderMatchDataRecordValues = this.parseMatchDataToDataRecordValues(match, allowedFields);
                                dataTable.updateDataRecordByIndex(matchRecordIndex, tinderMatchDataRecordValues);

                                //TODO: do all of the below in the dataField class where it belongs? Maybe create 1 'getUpdatebleData method' to tell the datingappcontrller which data may be updated thus can be sent over
                                //TODO: (seperate method) if match does exist, add data to existing record by retrieved index
                                //TODO: get from record for each data field;
                                // if: multipleDataEntry (if yes, then i can add multiple values)
                                // if: autoGather (if yes, then new data should be added if data does not already exist)
                                // if: onlyGatherOnce (if yes, if no current data available,.. add data)
                                // if: mustBeUnique (keep track of all values entered for this field name and check if the same value is not added twice (e.g. id))
                            }

                        });
                        console.log(`And here is my data table:`);
                        console.dir(dataTable);

                        //TODO: 4 Inplement add tinder UI support overlay 
                        // (e.g. add icon/color to match who hasn't replied in a week)
                        // export retrieved data to csv/json?
                        
                        // Determine in chatmode or swipemode?
                        // Add UI helper?
                        const uiRequiredFieldsList:DataFieldTypes[] = new DataRecord().getDataFieldTypes();
                        this.setSwipeHelperOnScreen(uiRequiredFieldsList);
                    });

                    // HINT: In order to scroll to the very bottom of the messageList in tinder;
                    /*
                    Use 
                    $0.children[$0.children.length-1].scrollIntoView()
                    and a few ms after use;
                    $0.scrollIntoView()
                    .. and repeat again, again and again untill you have the full list
                    */
                    
                } else {
                    console.error(`Could not get credentials for tinder`);
                }
            }
            if (this.dataRetrievalMethod === 'dom') {
                console.error(`Data retrieveMethod DOM is not yet supported`);
            }
        }else{
            console.error(`Unknown data retrievelMethod for ${this.nameController}`);
        }

        this.UIController = new UIController();
        this.UIController.addUIControls(); // WORKS I can create my own UI using Jquery AND manipulate the DOM with Jquery (and possibly also the mutationObserver)

    }
    private parseMatchDataToDataRecordValues(match: ParsedResultMatch, allowedFields: DataFieldTypes[]): DataRecordValues[] {
        const dataRecordValuesList: DataRecordValues[] = [];

        allowedFields.forEach((allowedField)=>{
            switch (allowedField.label) {
                case 'System-no':
                    dataRecordValuesList.push({ 'label': 'System-no', 'value': { 
                        'appType': 'tinder', 
                        'id': match.match.id
                    }});
                    break;
                case 'No':
                    //todo: ensure providing null increments the number in dataTable instead of throwing error
                    dataRecordValuesList.push({ 'label': 'No', 'value': undefined});
                    break;
                case 'Date-liked':
                    // does not get logged by tinder, thus can only be logged by me, thus should be undefined
                    dataRecordValuesList.push({ 'label': 'Date-liked', 'value': undefined});
                    break;
                case 'Name':
                    dataRecordValuesList.push({ 'label': 'Name', 'value': match.match.person.name});
                    break;
                case 'Age':
                    dataRecordValuesList.push({ 'label': 'Age', 'value': DateHelper.getAgeFromBirthDate(match.match.person.birth_date)});
                    break;
                case 'Has-profiletext':
                    dataRecordValuesList.push({ 'label': 'Has-profiletext', 'value': match.match.person.bio && match.match.person.bio.length > 0 ? true : false});
                    break;
                case 'Has-usefull-profiletext':
                    dataRecordValuesList.push({ 'label': 'Has-usefull-profiletext', 'value': undefined});
                    break;
                case 'Is-verified':
                    dataRecordValuesList.push({ 'label': 'Is-verified', 'value': match.match.person.badges ? this._isVerifiedMatch(match.match.person.badges) : false});
                    break;
                case 'Attractiveness-score':
                    dataRecordValuesList.push({ 'label': 'Attractiveness-score', 'value': undefined});
                    break;
                case 'Did-i-like':
                    dataRecordValuesList.push({ 'label': 'Did-i-like', 'value': true});
                    break;
                case 'Is-match':
                    dataRecordValuesList.push({ 'label': 'Is-match', 'value': true});
                    break;
                case 'Date-match':
                    dataRecordValuesList.push({ 'label': 'Date-match', 'value': match.match.created_date});
                    break;
                case 'Match-sent-first-message':
                    //todo: will always be true/false now, but i really need it to be true (if match did send first message), false (if match didnt and convo ewxists) or undefined (if no convo exists)
                    dataRecordValuesList.push({ 'label': 'Match-sent-first-message', 'value': match.matchMessages.length > 0 ? this._hasMatchSentFirstMessage(match.matchMessages, match.match.person._id) : false});
                    break;
                case 'Match-responded':
                    //todo: again,.. needs an undefined option, because if i add a new match / potential match, this cannot be true or false
                    dataRecordValuesList.push({ 'label': 'Match-responded', 'value': match.matchMessages.length > 0 ? this._hasMatchGivenResponse(match.matchMessages, match.match.person._id) : false});
                    break;
                case 'Conversation-exists':
                    //todo: again,.. needs an undefined option, because if i add a new match / potential match, this cannot be true or false
                    dataRecordValuesList.push({ 'label': 'Conversation-exists', 'value': match.matchMessages.length > 0 ? this._hasConversation(match.matchMessages, match.match.person._id) : false});
                    break;
                case 'Vibe-conversation':
                    dataRecordValuesList.push({ 'label': 'Vibe-conversation', 'value': undefined});
                    break;
                case 'How-many-ghosts':
                    //todo: again,.. needs an undefined option, because if i add a new match / potential match, this cannot be true or false
                    dataRecordValuesList.push({ 
                        'label': 'How-many-ghosts', 
                        'value': match.matchMessages.length > 0 ? this._getNumberOfGhosting(match.matchMessages, match.match.person._id, match.match) : []
                    });
                    break;
                case 'Acquired-number':
                    dataRecordValuesList.push({ 'label': 'Acquired-number', 'value': undefined});
                    break
                case 'Response-speed':
                    //todo: again,.. needs an undefined option, because if i add a new match / potential match, this cannot be true or false
                    dataRecordValuesList.push(
                        { 
                            'label': 'Response-speed', 
                            'value': match.matchMessages.length > 0 ? this._getResponseSpeedMoments(match.matchMessages, match.match.person._id) : []
                        });
                    break;
                case 'Reminders-amount':
                    //todo: again,.. needs an undefined option, because if i add a new match / potential match, this cannot be true or false
                    dataRecordValuesList.push(
                        { 
                            'label': 'Reminders-amount', 
                            'value': match.matchMessages.length > 0 ? this._getReminderAmount(match.matchMessages, match.match.person._id) : []
                        });
                    break;
                case 'Blocked-or-no-contact':
                    //todo: for deleted convo's by matches; does is there a property in the api response?
                    dataRecordValuesList.push({ 'label': 'Blocked-or-no-contact', 'value': undefined});
                    break
                case 'Interested-in-sex':
                    dataRecordValuesList.push({ 'label': 'Interested-in-sex', 'value': undefined});
                    break
                case 'Potential-click':
                    dataRecordValuesList.push({ 'label': 'Potential-click', 'value': undefined});
                    break
                case 'Notes':
                    dataRecordValuesList.push({ 'label': 'Notes', 'value': undefined});
                    break
                default:
                    break;
            }
        });
        return dataRecordValuesList;
    }
    private _getReminderAmount(matchMessages: Message[], personId: string): any[] {
        const reminderAmountList:any = [];
        let reminderAmount = 0;

        matchMessages.reduce((messagePrevious, messageNext, currentIndex, messageList)=>{

            // 1. is there 2 days or more in between my last message and my other message? AND my match sent no message in between? = ghost moment
            if(messagePrevious.from !== personId && messageNext.from !== personId){
                if(DateHelper.isDateBetweenGreaterThanAmountOfDays(messagePrevious.sent_date, messageNext.sent_date, 2)){

                    reminderAmountList.push({
                        number: reminderAmount,
                        datetimeMyLastMessage: messagePrevious.sent_date,
                        datetimeReminderSent: messageNext.sent_date,
                        textContentReminder: messageNext.message,
                        hasGottenReply: messageList[(currentIndex + 1)]?.from === personId ? true : false
                    });
                    reminderAmount = reminderAmount + 1;
                }
            }
            return messageNext;
        });

        return reminderAmountList;
    }

    private _getResponseSpeedMoments(matchMessages: Message[], matchPersonId: string): any[] {
        const responseSpeedMoments:any = [];

        // if there are no messages from the other person at all, return 0
        if(!matchMessages.some(message => message.from === matchPersonId)){
            return responseSpeedMoments;
        }
        
        matchMessages.forEach((currentMessage:Message, index:number, messagesList:Message[])=>{
            const nextMessage: Message | undefined = (index + 1) < (messagesList.length - 1) ? messagesList[index + 1] : undefined;
            // if the first message is from me, and the second message is from the other person

            // total messagesList (existing items) is 89
            // if 88, index + 1 = 89, messageList (90)-1 = 89 = gets the 89th message
            // if 89 (last item) + 1 = 90, messageList is (90)-1 = 89, item is NOT less than messageList, thus undefined

            if(!nextMessage){
                return;
            }

            if(currentMessage.from !== matchPersonId && nextMessage.from === matchPersonId){
                // get the difference between these two moments in datetime
                
                // add this datetime to the list
                responseSpeedMoments.push({
                    datetimeMyLastMessage: currentMessage.sent_date,
                    datetimeTheirResponse: nextMessage.sent_date,
                    // get the difference in MS between the following received message received from my match and my previously sent message
                    // differenceInMS: moment.duration(moment(messageNext.sent_date).diff(messagePrevious.sent_date)).asMilliseconds(),
                    differenceInMS: DateHelper.getAmountMilisecondesBetweenDates(currentMessage.sent_date, nextMessage.sent_date)
                });

            }
        });

        return responseSpeedMoments;
    }
    private _getNumberOfGhosting(matchMessages: Message[], matchPersonId: string, match:Match): any[] {

        let amountOfGhosts = 0;
        const ghostsList:any[] = [];

        // if there are no messages from the other person at all, return 0
        if(!matchMessages.some(message => message.from === matchPersonId)){
            return ghostsList;
        }

        matchMessages.reduce((myMessage, matchMessageReply)=>{

            // 1. is there 2 days or more in between my last message and her reply message? = ghost moment
            // if(myMessage.from !== matchPersonId && matchMessageReply.from === matchPersonId){
                const isGhostMoment = DateHelper.isDateBetweenGreaterThanAmountOfDays(myMessage.sent_date, matchMessageReply.sent_date, 2);
                if(isGhostMoment){
                    ghostsList.push(
                        {
                            number: amountOfGhosts,
                            timeSinceLastMessageMS: DateHelper.getAmountDaysBetweenDates(myMessage.sent_date, matchMessageReply.sent_date),
                            status: matchMessageReply.from === matchPersonId ? GhostStatus.REPLIED : GhostStatus.NOT_REPLIED_TO_REMINDER
                        }
                    );
                    amountOfGhosts = amountOfGhosts+1;
                }
            // }
            return matchMessageReply;
        });

        // 2. is the last message sent from me AND is it older or equal than 2 days?  = ghost moment
        const lastMessage: Message = matchMessages[matchMessages.length-1];
        if(lastMessage.from !== matchPersonId && DateHelper.isDateBetweenGreaterThanAmountOfDays(lastMessage.sent_date, new Date().toISOString(), 2)){
            ghostsList.push(
                {
                    number: amountOfGhosts,
                    timeSinceLastMessageMS: DateHelper.getAmountMilisecondesBetweenDates(lastMessage.sent_date, new Date().toISOString()),
                    status: GhostStatus.NOT_REPLIED
                }
            );
            amountOfGhosts = amountOfGhosts+1;
        }

        //TODO: TEST THIS WITH BLOCKED MATCH! (TIP: J. is now a blocked match as of 3-1-2022?)
        // 1. DOES THE 'DEAD' PROPERTY IN THE API RESPONSE REPRESENT A BLOCKED/REMOVED MATCH & THUS MESSAGES?
        // 2. DOES THE 'LAST ACTIVITY DATE' REPRESENT WHEN THE MATCH BLOCKED/REMOVED THE CHAT?
        // 3. IF I HAVE GOTTEN HER NUMBER, THIS DOES NOT COUNT AS A GHOST
        if(match.dead){
            const lastGhostMoment = ghostsList.pop();
            lastGhostMoment.status = GhostStatus.BLOCKED;
            ghostsList.push(lastGhostMoment);
        }

        return ghostsList;
    }
    private _hasConversation(matchMessages: Message[], personId: string): boolean {
        // if i sent at least 3 messages
        // if person sent 3 messages in return
        // my messages must be somewhere in between the other person's messages

        /*
        if i have sent her a message, and another one..(2 me),
        10 messages in total..

        check if i sent her a message (or vice versa), ignore other messages afetrwards from the same sender (a.1)
        then check if she sent me a message (or vice versa), ignore other messages afterwards from the same sender (b.1),

        afterwards check if i replied to her message (or vice versa), ignore other messages afterwards from the same sender (a.2)
        then check if she sent me a message (or vice versa), ignore other messages aterwards from the same sender (b.2),

        do the same untill you reach (a.3) and (b.3).
        If result is a.3 && b.3 return true, otherwise return false
        */
       let amountMessagesSentByMe = 0;
       let amountMessagesSentByOther = 0;

       let lastRespondent:string;

       matchMessages.forEach((message, index)=>{
            // determine the sender of the first message
            if(index === 0){
                if(message.from === personId){
                    amountMessagesSentByOther = amountMessagesSentByOther + 1;
                }else{
                    amountMessagesSentByMe = amountMessagesSentByMe + 1;
                }
                lastRespondent = message.from;
            }

            // determine if the next message after the first is from different sender
            if(index !== 0 && message.from !== lastRespondent){
                if(message.from === personId){
                    amountMessagesSentByOther = amountMessagesSentByOther + 1;
                }else{
                    amountMessagesSentByMe = amountMessagesSentByMe + 1;
                }
                lastRespondent = message.from;
            }

        });
        if(amountMessagesSentByMe >= 3 && amountMessagesSentByOther >= 3){
            return true;
        }else{
            return false;
        }
    }

    private _hasMatchGivenResponse(matchMessages: Message[], matchId: string): boolean {
        return matchMessages.some((matchMessage)=>{
            return matchMessage.from === matchId;
        });
    }

    private _hasMatchSentFirstMessage(matchMessages: Message[], matchId: string): boolean {
        return matchMessages[0].from === matchId ? true : false;
    }

    private _isVerifiedMatch(badgesList: Badges[]):boolean{
        if(badgesList.length > 0){
            return badgesList.some((badge)=>{
                return badge.type === "selfie_verified";
            });
        }else{
            return false;
        }
    }

    public getCredentials(): boolean {
        const tinderXAuthToken: string | null = localStorage.getItem('TinderWeb/APIToken');
        if (tinderXAuthToken && tinderXAuthToken.length > 0) {
            this.xAuthToken = tinderXAuthToken;
            return true;
        }
        return false;
    }

    public setSwipeHelperOnScreen(UIRequiredFieldsList: DataFieldTypes[]): void {

        // V 1. set up mutation observer for swipe, chat etc. to execute methods if DOM changes (switch screen, receive message etc.)
        // V 2. recognize which screen we are on (swipe, chat or other?)
        // V 3. Listen for screen navigatie changes (can do this inside of the callback)
        // 4. IF swipe; show swipe helpers (fields which require UI derived from dataTable)
        // 4.b IF swipe; show like/reject/superlike buttons only if fields which require UI have been filled
        // 4.c IF swipe; update fields which have autoGather (&autoGatherOnce) set to true
        // 5. IF chat; show chat helpers (which require UI) with current value (get current record)
        // 5.b IF chat; update fields which have autogather set to true
        
        // main & aside container (with this class) is always present as far as i know, so should always work.
        const swipeOrChatContainerIdentifier = '.App__body > .desktop > main.BdStart';

        const $SOCcontainer = $('body').find(swipeOrChatContainerIdentifier).first()[0];
        // const currentScreen: ScreenNavStateCombo;

        if(!$SOCcontainer){
            console.error(`Element with identifier not found: ${swipeOrChatContainerIdentifier}. Please update identifiers.`);
            return;
        }

        const callback = (mutations: MutationRecord[]) =>{
            if(this.currentScreenTimeoutId){
                // if timeout below is already set once, prevent it from setting it again untill it finishes to save resources
                return;
            }
            if(this.currentScreen === this.getCurrentScreenByDOM()){
                // if current screen at this time is still the same, do not re-update the currentscreen
                return;
            }
            this.removeAllUIHelpers();
            this.currentScreenTimeoutId = setTimeout(()=>{
                //TODO: show loading overlay while setTimeout started & hide overlay when ended (currentScreen is updated)
                this.currentScreen = this.getCurrentScreenByDOM();
                console.log(this.currentScreen);
                this.currentScreenTimeoutId = null;

                this.addUIHelpers(this.currentScreen, UIRequiredFieldsList);
            },500);
        };

        // Only need to observe the swipe-or-chat container. The matches & messageList container are always present (though not visible) anyway!
        // Thus I can always apply DOM manipulations on them when needed!
        const observer = new MutationObserver(callback);
        observer.observe($SOCcontainer, {
            childList: true, // observe direct children
            subtree: true, // lower descendants too
            characterDataOldValue: true, // pass old data to callback
        });

        const html = `<form>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>`;
        $('.App__body').prepend('<button type="button" id="testingbutton" class="btn btn-success">Success</button>');
        $('.App__body').prepend(html);

        $(document).on("click", '.App__body #testingbutton', function (evt) {
            console.log('this works! 2');
            alert('this works! 2');
            console.dir($('#exampleInputEmail1').val())
        });
    }
    public addUIHelpers(currentScreen: ScreenNavStateCombo, UIRequiredFieldsList: DataFieldTypes[]): void {
        
        // UIRequiredFieldsList.forEach((uiRequiredField)=>{
        //     // uiRequiredField.label
        //     // TODO: CONTINUE HERE
        // });
        const uiRequiredDataFieldTypes:DataFieldTypes[] = new DataRecord().getDataFieldTypes(false, true);

        debugger;

        if(currentScreen === ScreenNavStateCombo.Swipe){
            $('.recsCardboard__cards.Expand').css('right', '325px'); //right: 325px;
            $('.recsPage.CenterAlign > div[role="region"]:first').prepend('<div id="uiHelperFieldsContainer" class="uiHelperFieldsContainer">test</div>');

            uiRequiredDataFieldTypes.forEach(()=>{
                // check if #uiHelperFieldsContainer exists?
                // if not exist, throw error. If exist continue.
                // get id of potential swipe, crate new datarecord & addtoTable (only if liked/disliked)

                //TODO: new idea; instead of getting the fields.. get the fields by dataRecord AND loop over each field,(update: NO!); checking the UISetting, emptyAllowed, multipleDataEntry etc.
                // or maybe like.. STILL get the record but use the title's as keys for getting the exact dataField and using that dataField reference to get properties like checking the UISetting, emptyAllowed, multipleDataEntry etc.

                // const test = new DataRecord().


                // get the type of field, show correct UI helper in #uiHelperFieldsContainer
                // add event listener to the UI component, listener updates new dataRecord

                //switch to other screen? remove data record
                //liked? ADD FIELD; LIKED/DISLIKED & keep data record
            })
        }

        //todo: create checker method which checks if above DOM element ref exists, otherwise throw error
        //todo: FUTURE; create checker method which checks if all required DOM elements used here still exist (auto loop through application?)
        //todo: add other state (if,.. or seperate method) for adding chat ui helper VS swipe ui helper. Currently working on swipe ui helper

        //todo: seperate out logic for everything UI related; create a seperate class which recognizes app state (which screen we are on), removes existing helprs when on switch etc.
    }
    public removeAllUIHelpers():void {
        //TODO
        // throw new Error("Method not implemented.");
        console.log(`removeAllUIHelpers method called, still needs to be inplemented`);
    }

    public getCurrentScreenByDOM(): ScreenNavStateCombo {
        const swipeIdentifier = '.recsToolbar'; 
        const chatIdentifier = '.chat';
        const chatProfileIdentifier = '.chatProfile';

        let currentPage: ScreenNavStateCombo;

        switch (true) {
                case $(swipeIdentifier).length > 0 ? true : false:
                  currentPage = ScreenNavStateCombo.Swipe;
                  break;
                case $(chatIdentifier).length > 0 && $(chatProfileIdentifier).length > 0 ? true : false:
                  currentPage = ScreenNavStateCombo.Chat;
                  break;
                default:
                    currentPage = ScreenNavStateCombo.UnknownScreen;
                    break;
        }

        return currentPage;
    }

    public getDataByAPI(requestHandler: RequestHandlerTinder, useMock: boolean):Promise<ParsedResultMatch[] | undefined> {
        //todo: make seperate out logic in different methods because whilst 'getData' may be generic, getting it will differ for each supported app.
        console.log(`Getting tinder data`);

        console.log(matchMockTwo);

        if(useMock){
            return new Promise<ParsedResultMatch[]>((resolve, reject)=>{
                const test: ParsedResultMatch[] = <ParsedResultMatch[]><unknown>matchMockTwo;
                resolve(test);
            });
        }

        if (requestHandler) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            const getMatches = (fn:Function) => {

                return new Promise<ParsedResultMatch[]>((resolve, reject) =>{
                    const results:ParsedResultMatch[] = [];

                    const attempt = (next_page_token?:string) => {
                        next_page_token = next_page_token ? next_page_token : '';

                            fn(this.xAuthToken, next_page_token)
                            .then((parsedResult: MatchListTinderAPI)=>{
                                if(parsedResult?.data?.matches){
                                    // results = [...results, ...parsedResult.data.matches];

                                    parsedResult?.data?.matches.forEach((match: Match)=>{
                                        results.push(
                                            {
                                            match: match,
                                            matchMessages: []
                                        }
                                        );
                                    });
                                }
                                
                                if(parsedResult.data.next_page_token){
                                    attempt(parsedResult.data.next_page_token);
                                }else{
                                    resolve(results);
                                }
                            })
                            .catch(function(e:Error){
                                    console.log(`Error retrieving matches:`);
                                    console.dir(e);
                                    const error = e;
                                    reject(error);
                                });
                        
                    };
                    attempt();
                })
            };
            return getMatches(requestHandler.getMatches).then((matchList:ParsedResultMatch[])=>{

                // eslint-disable-next-line @typescript-eslint/ban-types
                const getMatchesMessages = async (fn:Function, id:string) => {
                    console.log('START');
                    console.log(1);

                    return await new Promise<Message[]>((resolve, reject) =>{
                        console.log(2);
                        let resultsMessages:Message[] = [];
                        const attempt = async (next_page_token?:string) => {
                            next_page_token = next_page_token ? next_page_token : '';
                            
                            await fn(this.xAuthToken, id, next_page_token)
                            .then(async (messages: ParsedResultMessages)=>{
                                console.log(3);
                                console.log('END');
                                //todo: add messages to the matchMessages for this person
                                // return resolve('duck');

                                resultsMessages = [...resultsMessages, ...messages.data.messages]
                                if(messages.data.next_page_token){
                                    await attempt(messages.data.next_page_token);
                                }else{
                                    return resolve(resultsMessages);
                                }
                            })
                            .catch((e: Error)=>{
                                console.log(4);
                                console.log('END');
                                return resolve([]);
                                console.log(`Error retrieving match messages:`);
                                console.dir(e);
                                const error = e;
                                reject(error);
                            })
                        };
                        attempt();
                    });

                };
                async function getMessagesPerMatchesAsynchronously(){
                    
                    // used a standard for loop to ensure synchronous looping
                    for (let i = 0; i < matchList.length; i+1) {
                        matchList[i].matchMessages = await getMatchesMessages(requestHandler.getMessagesFromMatch, matchList[i].match.id)
                        
                        //NOTE: Set limit to get messages from the first 25 matches ONLY! This is done to reduce time to load
                        if(i > 25){
                            console.log('CONGRATZ you reached the end!');
                            // eslint-disable-next-line no-debugger
                            // debugger;

                            return matchList;
                        }
                    }
                }
                return getMessagesPerMatchesAsynchronously()
            });
            
            //note: track outgoing calls by this structure:
            // https://api.gotinder.com/{like|pass}/{_id}

            //note: track webRequests; (don't forget to enable this in permissions!)
            //https://developer.chrome.com/docs/extensions/reference/webRequest/

            //otherwise use this:
            // https://gist.github.com/benjamingr/0433b52559ad61f6746be786525e97e8

            // determine if the rerquest is sent by xmlhttp or ajax. if ajax, you can also use this;
            // https://www.npmjs.com/package/jquery-ajax-tracking?activeTab=readme

            // options;
            // https://stackoverflow.com/questions/43813770/how-to-intercept-all-http-requests-including-form-submits/43815800

            // mocht al het bovenstaande niet werken; 
            /*
            1. track current viewing person name, age evt. photo url
            2. get currentMatchesList
            3. track the button-click event waarbij de person wordt geliked
            4. on trigger; get matches, remove old currentMatches from new Matches list; only 1 match should remain, check if true otherwise throw big error & retry after 1 sec?
            5. check if match difference (which should be 1 match; our newest match); matches the name & age & evt. photo url
            6. get person info (tinder id etc.) on the match
            */

            // NOTE: Tinder workings;
            /* 
            There is a https://api.gotinder.com/v2/recs/core?locale=nl request which gives you 25 profile recommendations at a time, which contains for each user the user object which contains the id's, name, age, birthdate, picture etc.
            maybe this info would be handy to log/record as well?
            e.g.how many user recommendations i get which;
            1. have profile text
            2. are verified
            3. more???
            4. also contains pics,.. so in theory could build my own tinder app UI
            */

        }else{
            console.error(`The requestHandler was not set`);
            return;
        }
    }

}
