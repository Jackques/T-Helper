import { datingAppController } from "src/content/interfaces/controllers/datingAppController.interface";
import { ParsedResultMatch } from "src/content/interfaces/controllers/ParsedResultMatch.interface";
import { TinderMessage, ParsedResultMessages } from "src/content/interfaces/http-requests/MessagesListTinder.interface";
import { Badges, Match, MatchApi, MatchListTinderAPI } from "src/content/interfaces/http-requests/MatchesListTinder.interface";
import { matchMockTwo } from "../mocks/matchesMock";
import { DataTable } from '../data/dataTable';
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataRecord } from "../data/dataRecord";
import { SubmitType } from "../../../SubmitType.enum";
import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";
import { DateHelper, DateHelperTimeStamp } from "../util/dateHelper";
import { GhostStatus } from "../data/dataItems/dataItemGhost";
import { ScreenNavStateComboTinder } from "../util/Screen/screenStateComboTinder.enum";
import { UIFieldsRenderer } from "./UIFieldsRenderer";
import { RequestHandlerTinder } from "../http-requests/requestHandlerTinder";
import { Person } from "../tinder/Person";
import { DataStorage } from '../data/dataStorage';
import { DataField, DataFieldDistances, DataFieldMessages, UIRequired } from "../data/dataField";
import { PersonAction } from "../../../personAction.enum"; // todo: had to move this to top level AND make a relative path.. but since ALL components (content, background, popup) share the same interfaces/enums etc. why not move everything to top lvl for importing? ALSO; why did an error occur when i tried to relative import this?
import { SubmitAction } from "src/SubmitAction.interface";
import { DOMHelper } from "../util/DOMHelper";
import { Message, MessageAuthorEnum } from "./../../../message.interface";
import { MatchDetailsAPI } from "src/content/interfaces/http-requests/MatchDetailsAPI.interface";
import { ghostMoment } from "src/content/interfaces/data/ghostMoment.interface";
import { reminderAmountItem } from "src/content/interfaces/data/reminderAmountItem.interface";
import { Reminder } from "../util/NeedsReminder";
import { ReminderHttp } from "../data/ReminderHttp";
import { Overlay } from "../serrvices/Overlay";
import { ScreenController } from "../util/Screen/ScreenList";
import { ScreenElement } from "../util/Screen/ScreenElement";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../util/ConsoleColorLog/LogColors";
import { Screen } from "../util/Screen/Screen";
import { screensTinder } from "../tinder/config/Screens";
import { PortMessage } from "src/content/interfaces/portMessage.interface";
import { PortAction } from "src/PortAction.enum";

export class TinderController implements datingAppController {
    private nameController = 'tinder';
    private hasCredentials = false;
    private dataRetrievalMethod: 'api' | 'dom' | null = null;

    private screenList: ScreenController = new ScreenController(screensTinder);
    private uiRenderer: UIFieldsRenderer = new UIFieldsRenderer(this.screenList);

    private xAuthToken = '';
    private requestHandler!: RequestHandlerTinder; // 'definite assignment assertion proerty (!) added here, is this a good practice?'
    public matches: Person[] = [];
    private dataTable: DataTable;
    private dataStorage: DataStorage;
    private dataPort: chrome.runtime.Port | null;

    private currentScreenTimeoutId: number | null = null;
    private currentMatchIdByUrlChat: string | null = null;

    private amountOfUnmessagedMatches = 0;
    private matchesListTimeoutId: number | null = null;

    private dataTableNeedsToBeUpdated = false;

    private watchersUIList: MutationObserver[] = [];
    private currentExploreCategory: string | null = null;

    private currentDataRecordSwipe: DataRecord = new DataRecord();

    constructor(dataRetrievalMethod: 'api' | 'dom' | null, dataTable: DataTable, dataStorage: DataStorage, dataPort: chrome.runtime.Port | null) {

        this.dataRetrievalMethod = dataRetrievalMethod;
        this.dataTable = dataTable;
        this.dataStorage = dataStorage;
        this.dataPort = dataPort;

        if (this.dataRetrievalMethod === 'api' || this.dataRetrievalMethod === 'dom') {
            if (this.dataRetrievalMethod === 'api') {
                //todo: update this to actually get the getCredentials, put in a constant, and check if the constant is filled with a correct string value
                this.hasCredentials = this.setCredentials();
                if (this.hasCredentials) {

                    //todo: test to see if auth token works by using a simple request first?
                    this.requestHandler = new RequestHandlerTinder(this.xAuthToken);

                    Overlay.setLoadingOverlay('initApp', true);
                    this.refreshDataTableMatchesAndMatchMessages(this.requestHandler).then(() => {
                        //todo: 4 Inplement add tinder UI support overlay (e.g. add icon/color to match who hasn't replied in a week)
                        this.setSwipeHelperOnScreen();

                        // HINT: In order to scroll to the very bottom of the messageList in tinder;
                        /*
                        Use 
                        $0.children[$0.children.length-1].scrollIntoView()
                        and a few ms after use;
                        $0.scrollIntoView()
                        .. and repeat again, again and again untill you have the full list
                        */
                    }).catch((error) => {
                        console.dir(error);
                        console.error(`Something went wrong`);
                    }).finally(() => {
                        Overlay.setLoadingOverlay('initApp', false);
                        this.setScreenWatcher();
                        this.setMessageListWatcherOnScreen();
                        this.setMatchesListWatcher();
                    });

                } else {
                    console.error(`Could not get credentials for tinder`);
                }
            }
            if (this.dataRetrievalMethod === 'dom') {
                console.error(`Data retrieveMethod DOM is not yet supported`);
            }
        } else {
            console.error(`Unknown data retrievelMethod for ${this.nameController}`);
        }
    }

    private refreshDataTableMatchesAndMatchMessages(requestHandler: RequestHandlerTinder): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Gather data (by api's OR (less preferably) DOM)
            this.getMatches()?.then((matches: ParsedResultMatch[] | null) => {

                console.log(`Matches & match messages:`);
                console.dir(matches);

                // eslint-disable-next-line no-debugger
                // debugger;

                if (matches === null) {
                    console.error(`Could not retrieve matches`);
                    return reject();
                }

                this.updateDataTable(matches);

                this.setUnupdatedMatchesToBlocked(matches, this.dataTable).finally(() => {
                    const dataRecordsWhereMessagesNeedToBeUpdated = this.dataTable.getAllDataRecordsWhereMessageNeedTobeUpdated();
                    if (dataRecordsWhereMessagesNeedToBeUpdated.length === 0) {
                        return resolve();
                    }

                    this.updateMessagesDataRecords(requestHandler, dataRecordsWhereMessagesNeedToBeUpdated, matches).then((hasMessagesBeenRetrieved) => {

                        if (!hasMessagesBeenRetrieved) {
                            console.error(`Something went wrong with getting messages! Check the network logs.`);
                            return reject();
                        }

                        // eslint-disable-next-line no-debugger
                        // debugger;

                        const dataRecords: DataRecord[] = this.dataTable.getAllDataRecords();
                        dataRecords.forEach((dataRecord) => {
                            const dataFields: DataField[] = dataRecord.getDataFields();

                            const systemId: string | null = dataRecord.getRecordPersonSystemId(this.nameController)
                            if (!systemId) {
                                console.warn(`Could not update messages because systemid for this record was: ${systemId}`);
                            } else {
                                const matchRecordIndex: number = this.dataTable.getRecordIndexBySystemId(systemId, this.nameController);
                                const tinderMatchDataRecordValues: DataRecordValues[] = this.parseMatchDataToDataRecordValues(dataFields, undefined, systemId);
                                this.dataTable.updateDataRecordByIndex(matchRecordIndex, tinderMatchDataRecordValues);
                            }

                        });

                        // eslint-disable-next-line no-debugger
                        // debugger;

                        return resolve();

                    }).catch((error) => {
                        console.dir(error);
                        console.error(`Error occured getting matchMessages`);
                    }).finally(() => {
                        console.log(`And here is my data table:`);
                        console.dir(this.dataTable);
                    });
                });

                // debugger;

            }).catch((error) => {
                console.dir(error);
                console.error(`An error occured getting matches`);
            });
        });
    }

    private setScreenWatcher() {

        // main & aside container (with this class) is always present as far as i know, so should always work.
        const swipeOrChatContainerIdentifier = '.App__body > .desktop > main.BdStart';

        const $SOCcontainer = $('body').find(swipeOrChatContainerIdentifier).first()[0];

        if (!$SOCcontainer) {
            console.error(`Element with identifier not found: ${swipeOrChatContainerIdentifier}. Please update identifiers.`);
            return;
        }

        // Only need to observe the swipe-or-chat container. The matches & messageList container are always present (though not visible) anyway!
        // Thus I can always apply DOM manipulations on them when needed!
        const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {
            // ConsoleColorLog.singleLog(`Screen: `, this.getCurrentScreenByUrlAndDOM(), LogColors.BLUE);

            if (this.currentScreenTimeoutId !== null) {
                // if timeout below is already set once, prevent it from setting it again untill it finishes to save resources
                return;
            }

            if (this.screenList.getCurrentScreen().getScreenIsChatScreen()) {
                const newMatchIdFromUrl = this.getMatchIdFromMessageHrefSDtring(window.location.href);
                if (this.currentMatchIdByUrlChat === null || this.currentMatchIdByUrlChat !== newMatchIdFromUrl) {
                    console.log(`%c Switched CHAT from match with id ${this.currentMatchIdByUrlChat} to match with id: ${newMatchIdFromUrl}`, "color: green");
                    this.currentMatchIdByUrlChat = newMatchIdFromUrl;
                } else {
                    return;
                }
            // } else if (this.screenList.getCurrentScreen().getScreenName() === ScreenNavStateComboTinder.SwipeExplore) {
            } else if (this.getCurrentScreenByUrlAndDOM() === ScreenNavStateComboTinder.SwipeExplore) {
                const urlPartsList = window.location.href.split('/');
                const newExploreCategory = urlPartsList[urlPartsList.length - 1] === 'explore' ? null : urlPartsList[urlPartsList.length - 1];

                // todo: REFACTOR LOGIC TO GETSCREENBYURL&DOM BECAUSE THIS IS GETTING RIDICULOUS;
                // THAT METHOD GETS & SETS chat url extension AND category extension for screen in a different "special set properties to check" and MAYBE a different method on screenList like screenList.screenisDifferentBecauseWeOnDifferentcategoryOrChatSoNeedsUpdate()
                // if we are on swipeexplore, 
                    // was the app on swipeexploredetail? 
                        // if yes, refresh because we need to recognize the correct screen we are on for the collect data button
                        // is no (so the app was on swipeexplore) continue.. 
                    // are we on swipeexplore same category? 
                        // if so do nothing to prevent thousands of overlays
                        // if not, we want a refresh
                if (this.screenList.getCurrentScreen().getScreenName() === ScreenNavStateComboTinder.SwipeExplore && this.currentExploreCategory === newExploreCategory) {

                    return;
                }
                console.log(`Switched from SWIPEEXPLORE page: ${this.currentExploreCategory} to page: ${newExploreCategory}`);
                this.currentExploreCategory = newExploreCategory;
            } else if (this.screenList.getCurrentScreen().getScreenName() === this.getCurrentScreenByUrlAndDOM()) {
                return;
            }

            Overlay.setLoadingOverlay('switchScreen', true);

            this.uiRenderer.removeAllUIHelpers();

            this.currentScreenTimeoutId = setTimeout(() => {
                this.screenList.updateCurrentScreen(this.getCurrentScreenByUrlAndDOM());
                console.log(`Current screen: ${this.screenList.getCurrentScreen()}`);

                this.currentScreenTimeoutId = null;

                console.log(`execute add UI helpers for screen: ${this.screenList.getCurrentScreen()}`);

                this.currentDataRecordSwipe = this._getCorrectNewDataRecord();

                if (this.dataTableNeedsToBeUpdated) {
                    this.refreshDataTableMatchesAndMatchMessages(this.requestHandler).then(() => {
                        this.setRefreshDataTable(false);
                        this.screenList.updateCurrentScreen(this.getCurrentScreenByUrlAndDOM());
                        this.addUIHelpers(this.screenList, this.currentDataRecordSwipe);
                    }).finally(() => {
                        Overlay.setLoadingOverlay('switchScreen', false);
                    });
                } else {
                    this.addUIHelpers(this.screenList, this.currentDataRecordSwipe);
                    Overlay.setLoadingOverlay('switchScreen', false);
                }

            }, 500);
        });
        mutationObv.observe($SOCcontainer, {
            childList: true, // observe direct children
            subtree: true, // lower descendants too
            characterDataOldValue: true, // pass old data to callback
        });

        this.watchersUIList.push(mutationObv);
    }

    private _getCorrectNewDataRecord(): DataRecord {
        // if previous screen is swipe & current screen is swipe detail, keep the same dataRecord AND if is vice-versa
        // if previous screen is swipeexplore & current screen is swipeexploredetail, keep the same dataRecord AND if is vice-versa
        if(this.currentDataRecordSwipe === null){
            this.currentDataRecordSwipe = new DataRecord();
        }
        
        switch (true) {
            case this.screenList.getPreviousScreen().getScreenName() === ScreenNavStateComboTinder.Swipe && this.screenList.getCurrentScreen().getScreenName() === ScreenNavStateComboTinder.SwipeDetail:
            case this.screenList.getPreviousScreen().getScreenName() === ScreenNavStateComboTinder.SwipeDetail && this.screenList.getCurrentScreen().getScreenName() === ScreenNavStateComboTinder.Swipe:
            case this.screenList.getPreviousScreen().getScreenName() === ScreenNavStateComboTinder.SwipeExplore && this.screenList.getCurrentScreen().getScreenName() === ScreenNavStateComboTinder.SwipeExploreDetail:
            case this.screenList.getPreviousScreen().getScreenName() === ScreenNavStateComboTinder.SwipeExploreDetail && this.screenList.getCurrentScreen().getScreenName() === ScreenNavStateComboTinder.SwipeExplore:
                return this.currentDataRecordSwipe;
            default: 
                return new DataRecord();
            }
    }

    private setMessageListWatcherOnScreen() {

        const messageListIdentifier = '.messageList';
        const $MessageListContainer = $('body').find(messageListIdentifier).first()[0];

        if (!$MessageListContainer) {
            console.error(`Element with identifier not found: ${messageListIdentifier}. Please update identifiers.`);
            return;
        }

        const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {

            // ensures that only descandt nodes of the (div) node with class 'messageList' will be passed
            const mutationsOnMessageItem = mutations.filter((mutation) => {
                const mutatedElement = mutation.target as HTMLElement;
                if (mutatedElement.nodeName === "DIV") {
                    if (!mutatedElement.classList.contains('messageList')) {
                        return mutatedElement;
                    }
                } else {
                    return mutatedElement;
                }
            });
            if (mutationsOnMessageItem.length === 0) {
                return;
            }

            // check if mutation are from receiving a new message, if so update the dataRecord to set 'needsTobeUpdated' to true
            const matchId: string | null = this.getMatchIdFromMutations(mutationsOnMessageItem);

            //Known flase positives (but does not matter, since all it does will be refetching the messages anyway);
            // 'bug 1'; profile Aniek last message was a ANIMATED GIF sent to her.. this shows up as a hyperlink in the messages.. thus the last message ('You sent a GIF..') does INDEED NOT EQUAL the last message known by the dataRecord (the hyperlink to the gif)
            if (matchId !== null) {
                const dataRecord = this.dataTable.getRecordByRecordIndex(this.dataTable.getRecordIndexBySystemId(matchId, 'tinder'));

                if (dataRecord === null) {
                    console.error(`Observed last message from unknown match. Please check match in mutations: ${mutationsOnMessageItem} and check the datatable manually`);
                    return;
                }

                if (this.hasReceivedNewMessagesFromMatch(mutationsOnMessageItem, dataRecord)) {
                    // eslint-disable-next-line no-debugger
                    // debugger;
                    dataRecord.setUpdateMessages(true);
                    this.setRefreshDataTable(true);
                    console.log(`%c ${console.count()} (2)I just set profile: ${dataRecord.usedDataFields[5].getValue()} with id: ${matchId} with recordIndex: ${this.dataTable.getRecordIndexBySystemId(matchId, 'tinder')} to true.. for this person sent me a new message thus my messages list for her should be reviewed`, "color: orange");
                    return;
                }
            }
            // if not, then mutations are from switching match conversation
        });

        mutationObv.observe($MessageListContainer, {
            childList: true, // observe direct children
            subtree: true, // lower descendants too
            characterDataOldValue: false, // pass old data to callback
        });

        this.watchersUIList.push(mutationObv);
    }

    private setMatchesListWatcher(): void {
        const matchesListIdentifier = 'a.matchListItem';
        const matchesListElement: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector(matchesListIdentifier);
        let matchesListContainer: null | HTMLElement = null;

        if (matchesListElement !== null) {
            matchesListContainer = $(matchesListElement).parents('[role="tabpanel"]').first()[0] ? $(matchesListElement).parents('[role="tabpanel"]').first()[0] : null;
            if (matchesListContainer !== null) {
                this.amountOfUnmessagedMatches = this.getUnmessagedMatchesAmount(matchesListContainer);

                const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {
                    if (matchesListContainer !== null) {
                        const currentUnmessagedMatchesAmount: number = this.getUnmessagedMatchesAmount(matchesListContainer);
                        console.log(`Did the UI get updated so I can NOW get the number of unmessaged matches after one or more has been added/deleted?`);
                        console.log(`Old number: ${this.amountOfUnmessagedMatches}, current/new number: ${currentUnmessagedMatchesAmount}`);

                        if (this.amountOfUnmessagedMatches !== currentUnmessagedMatchesAmount) {
                            this.amountOfUnmessagedMatches = currentUnmessagedMatchesAmount;

                            this.setRefreshDataTable(true);
                        }
                    } else {
                        console.error(`Could not find matchesListContainer. Please update the identifier.`);
                        return;
                    }

                });

                mutationObv.observe(matchesListContainer, {
                    childList: true, // observe direct children
                    subtree: true, // lower descendants too
                    characterDataOldValue: false, // pass old data to callback
                });

                this.watchersUIList.push(mutationObv);

            } else {
                console.error(`Could not find matchesListContainer. Please update the identifier.`);
                return;
            }
        } else {
            console.error(`Could not find matchesListElement. Please update the identifier.`);
            return;
        }
    }

    private setRefreshDataTable(shouldDataTableBeRefreshed: boolean) {
        this.dataTableNeedsToBeUpdated = shouldDataTableBeRefreshed;
    }

    private getUnmessagedMatchesAmount(matchesListContainerElement: HTMLElement): number {
        const matchListItemsAmount = $(matchesListContainerElement).find('a.matchListItem').length;

        // I assume the 'likes you' and 'sent-likes' will always be present, thus accounting for at least 2 elements with class matchListItem
        if (matchListItemsAmount >= 1) {
            return matchListItemsAmount;
        } else {
            console.error(`Unable to find matchListItems. Please update selectors.`);
            return 0;
        }
    }

    private getLatestMessageFromMutations(mutations: MutationRecord[]): string | null {
        let latestMessageFromUI: string | null = null;

        mutations.forEach((mutation) => {
            if (mutation.target) {
                const element$: JQuery<Node> = $(mutation.target).hasClass('messageListItem') ? $(mutation.target).first() : $(mutation.target).parents('.messageListItem').first();
                if (element$.length > 0) {
                    latestMessageFromUI = element$.find('.messageListItem__message').text();
                } else {
                    console.error(`Jquery node not found with class "messageListItem__message"`);
                    return null;
                }
            }
        });
        return latestMessageFromUI;
    }

    private getMatchIdFromMutations(mutations: MutationRecord[]): string | null {
        let matchId: string | null = null;

        mutations.forEach((mutation) => {
            if ($(mutation.target).hasClass('messageList')) {
                return;
            }

            const element$: JQuery<Node> = $(mutation.target).hasClass('messageListItem') ? $(mutation.target).first() : $(mutation.target).parents('.messageListItem').first();

            if (element$.length > 0) {
                matchId = this.getMatchIdFromMessageListItem(element$[0] as HTMLElement);
            } else {
                console.error(`Jquery node not found with class "messageListItem__message"`);
                return null;
            }

        });

        return matchId;
    }

    private hasReceivedNewMessagesFromMatch(mutations: MutationRecord[], dataRecord: DataRecord): boolean {
        const latestMessageFromUI: string | null = this.getLatestMessageFromMutations(mutations);
        let latestMessageFromMatchInDataTable: string | null | undefined;
        if (dataRecord.hasMessages()) {
            latestMessageFromMatchInDataTable = dataRecord.getLatestMessage() ? dataRecord.getLatestMessage()?.message : null;
        } else {
            latestMessageFromMatchInDataTable = "";
        }

        if (!latestMessageFromUI) {
            console.error(`Unable to get new message from match. The value for from the UI is: "${latestMessageFromUI}". Please update the selectors.`);
            return false;
        }

        if (latestMessageFromUI !== latestMessageFromMatchInDataTable) {
            return true;
        } else {
            return false;
        }

    }

    private getMatchIdFromMessageListItem(latestMessageElement: HTMLElement): string | null {

        if (!$(latestMessageElement).hasClass('messageListItem')) {
            console.error(`latestMessageElement received is  not a messageListItem element. Please update the selectors.`);
            return null;
        }

        const matchIdHref: string | undefined = $(latestMessageElement).attr('href');
        let matchId: string;

        if (matchIdHref && matchIdHref.length > 0) {
            matchId = matchIdHref.substring(matchIdHref.lastIndexOf('/') + 1);
            if (matchId && matchId.length > 0) {
                return matchId;
            }
        }
        console.error(`Unable to get match id from message list item. Please update the DOM selectors.`);
        return null;
    }

    private parseMatchDataToDataRecordValues(dataFields: DataField[] | DataFieldMessages[], match?: ParsedResultMatch, systemId?: string): DataRecordValues[] {
        //todo: refactor code to use dataFields directly (similair to dataFieldMessages) instead of creating & adding fields to the seperate list below
        const dataRecordValuesList: DataRecordValues[] = [];
        const messagesDataField = dataFields[2] as DataFieldMessages;

        // todo: refactor this to nicely get dataRecord, and from dataRecord (write a method to?) retrieve messages DataField
        if (match && match.match.messages.length > 0 || match && match.matchMessages.length > 0) {
            const retrievedMessagesFromMatch = match.matchMessages.length > 0 ? match.matchMessages : match.match.messages as unknown as TinderMessage[];
            messagesDataField.updateMessagesList(this._convertTinderMessagesForDataRecord(retrievedMessagesFromMatch, match.match.person._id))
        }

        const dateAcquiredNumber: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-acquired-number')?.getValue() as string | null;
        const dateBlockedOrRemoved: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-unmatch')?.getValue() as string | null;

        const reminder: Reminder = new Reminder(messagesDataField.getAllMessages(), dateAcquiredNumber, dateBlockedOrRemoved, new Date().getTime());

        dataFields.forEach((dataField, index, dataFields) => {
            switch (dataField.title) {
                case 'System-no': {
                    if (!match) {
                        break;
                    }
                    dataRecordValuesList.push({
                        'label': 'System-no', 'value': {
                            'appType': this.nameController,
                            'id': match && match.match && match.match.id ? match.match.id : systemId,
                            'tempId': match?.match?.person?._id ? match.match.person._id : ''
                        }
                    });
                    break;
                }
                case 'No':
                    //todo: ensure providing null increments the number in dataTable instead of throwing error
                    dataRecordValuesList.push({
                        'label': 'No',
                        'value': dataField.getValue() ? dataField.getValue() : undefined
                    });
                    break;
                case 'Last-updated':
                    dataRecordValuesList.push({ 'label': 'Last-updated', 'value': new Date().toISOString() });
                    break
                case 'Date-liked-or-passed':
                    // does not get logged by tinder, thus can only be logged by me, thus should be undefined
                    dataRecordValuesList.push({ 'label': 'Date-liked-or-passed', 'value': dataField.getValue() ? dataField.getValue() : null });
                    break;
                case 'Name':
                    dataRecordValuesList.push({
                        'label': 'Name',
                        'value': match ? match.match.person.name : dataField.getValue()
                    });
                    break;
                case 'Age':
                    dataRecordValuesList.push({
                        'label': 'Age',
                        'value': match ? DateHelper.getAgeFromBirthDate(match.match.person.birth_date) : dataField.getValue()
                    });
                    break;
                case 'City':
                    dataRecordValuesList.push({
                        'label': 'City',
                        'value': dataField.getValue() ? dataField.getValue() : null
                    });
                    break;
                case 'Job':
                    dataRecordValuesList.push({
                        'label': 'Job',
                        'value': dataField.getValue() ? dataField.getValue() : null
                    });
                    break;

                case 'Seems-fake':
                    dataRecordValuesList.push({
                        'label': 'Seems-fake',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;
                case 'Seems-empty':
                    dataRecordValuesList.push({
                        'label': 'Seems-empty',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;

                case 'Has-profiletext': {
                    dataRecordValuesList.push({
                        'label': 'Has-profiletext',
                        'value': match ? (match.match.person.bio && match.match.person.bio.length > 0 ? true : false) : dataField.getValue()
                    });
                    break;
                }
                case 'Has-usefull-profiletext':
                    dataRecordValuesList.push({ 'label': 'Has-usefull-profiletext', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break;
                case 'Gender':
                    dataRecordValuesList.push({ 'label': 'Gender', 'value': match?.match.person.gender ? this._getGender(match?.match.person.gender) : dataField.getValue() });
                    break;
                case 'Is-verified': {
                    // ensure that if Is-verified has been set once, it will not be overwritten again. 
                    // todo: Maybe make a field setting for this?
                    dataRecordValuesList.push({
                        'label': 'Is-verified',
                        'value': match ? (match.match.person.badges ? this._isVerifiedMatch(match.match.person.badges) : false) : dataField.getValue()
                    });
                    break;
                }
                case 'Type-of-match-or-like': {
                    dataRecordValuesList.push({
                        'label': 'Type-of-match-or-like',
                        'value': match?.match ? this._getTypeOfMatchAndLike(match.match) : dataField.getValue()
                    });
                    break;
                }
                case 'Liked-me-first-is-instant-match': {
                    dataRecordValuesList.push({
                        'label': 'Liked-me-first-is-instant-match',
                        'value': dataField.getValue() || dataField.getValue() === null ? dataField.getValue() : false
                    });
                    break;
                }
                case 'Is-gold-match': {
                    dataRecordValuesList.push({
                        'label': 'Is-gold-match',
                        'value': dataField.getValue() || dataField.getValue() === null ? dataField.getValue() : false
                    });
                    break;
                }
                case 'Needs-profile-update': {
                    dataRecordValuesList.push({
                        'label': 'Needs-profile-update',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;
                }
                case 'Needs-messages-update': {
                    dataRecordValuesList.push({
                        'label': 'Needs-messages-update',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;
                }
                case 'Needs-reminder': {
                    dataRecordValuesList.push({
                        'label': 'Needs-reminder',
                        'value': messagesDataField.hasMessages() ? reminder.getNeedsReminder(messagesDataField.getAllMessages()) : false
                    });
                    break;
                }
                case 'Amount-of-pictures':
                    dataRecordValuesList.push({ 'label': 'Amount-of-pictures', 'value': dataField.getValue() === null && match?.match.person !== undefined ? this.getAmountOfPictures(match?.match.person) : null });
                    break;
                case 'Attractiveness-score':
                    dataRecordValuesList.push({ 'label': 'Attractiveness-score', 'value': dataField.getValue() || dataField.getValue() === 0 ? dataField.getValue() : null });
                    break;
                case 'Details-tags': {
                    const currentValue = dataField.getValue() as Array<unknown>;
                    dataRecordValuesList.push({ 'label': 'Details-tags', 'value': currentValue && currentValue.length > 0 ? dataField.getValue() : [] });
                    break;
                }
                case 'Vibe-tags': {
                    const currentValue = dataField.getValue() as Array<unknown>;
                    dataRecordValuesList.push({ 'label': 'Vibe-tags', 'value': currentValue && currentValue.length > 0 ? dataField.getValue() : [] });
                    break;
                }
                case 'Seems-to-be-active': {
                    const hasMatchGivenResponse = this._hasMatchGivenResponse(messagesDataField.getAllMessages());
                    dataRecordValuesList.push({ 'label': 'Seems-to-be-active', 'value': dataField.getValue() || hasMatchGivenResponse ? true : false });
                    break;
                }
                case 'Did-i-like':
                    dataRecordValuesList.push({ 'label': 'Did-i-like', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break;
                case 'Is-match':
                    // if match.match.person is valid, then it is obviously a match, if not it's probably false thus use the value this field already has.
                    dataRecordValuesList.push({ 'label': 'Is-match', 'value': match?.match?.person ? true : dataField.getValue() });
                    break;
                case 'Date-match':
                    dataRecordValuesList.push({
                        'label': 'Date-match',
                        'value': match ? match.match.created_date : dataField.getValue()
                    });
                    break;
                case 'Match-sent-first-message': {
                    dataRecordValuesList.push({
                        'label': 'Match-sent-first-message',
                        'value': messagesDataField.hasMessages() ? this._hasMatchSentFirstMessage(messagesDataField.getAllMessages()) : null
                    });
                    break;
                }
                case 'Match-responded':
                    dataRecordValuesList.push({ 'label': 'Match-responded', 'value': messagesDataField.hasMessages() ? this._hasMatchGivenResponse(messagesDataField.getAllMessages()) : null });
                    break;
                case 'Conversation-exists':
                    dataRecordValuesList.push({
                        'label': 'Conversation-exists',
                        'value': messagesDataField.hasMessages() ? this._hasConversation(messagesDataField.getAllMessages()) : null
                    });
                    break;
                case 'Vibe-conversation':
                    dataRecordValuesList.push({ 'label': 'Vibe-conversation', 'value': dataField.getValue() || dataField.getValue() === 0 ? dataField.getValue() : null });
                    break;
                case 'How-many-ghosts': {

                    // const dateAcquiredNumber: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-acquired-number')?.getValue() as string | null;
                    // const dateBlockedOrRemoved: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-unmatch')?.getValue() as string | null;

                    dataRecordValuesList.push({
                        'label': 'How-many-ghosts',
                        'value': messagesDataField.hasMessages() ? this._getNumberOfGhosting(messagesDataField.getAllMessages(), match && match.match ? match.match : undefined, dateAcquiredNumber, dateBlockedOrRemoved) : []
                    });
                    break;
                }
                case 'Acquired-number':
                    dataRecordValuesList.push({ 'label': 'Acquired-number', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Response-speed':
                    dataRecordValuesList.push(
                        {
                            'label': 'Response-speed',
                            'value': messagesDataField.hasMessages() ? this._getResponseSpeedMoments(messagesDataField.getAllMessages()) : []
                        });
                    break;
                case 'Reminders-amount': {

                    // const dateAcquiredNumber: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-acquired-number')?.getValue() as string | null;
                    // const dateBlockedOrRemoved: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-unmatch')?.getValue() as string | null;

                    dataRecordValuesList.push(
                        {
                            'label': 'Reminders-amount',
                            // 'value': messagesDataField.hasMessages() ? this._getReminderAmount(messagesDataField.getAllMessages(), dateAcquiredNumber, dateBlockedOrRemoved) : []
                            'value': messagesDataField.hasMessages() ? reminder.getReminderAmountItems() : []
                        });
                }
                    break;
                case 'Match-wants-no-contact':
                    dataRecordValuesList.push({ 'label': 'Match-wants-no-contact', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Interested-in-sex':
                    dataRecordValuesList.push({ 'label': 'Interested-in-sex', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Potential-click':
                    dataRecordValuesList.push({ 'label': 'Potential-click', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Why-i-removed': {
                    const currentValue = dataField.getValue() as Array<unknown>;
                    dataRecordValuesList.push({ 'label': 'Why-i-removed', 'value': currentValue && currentValue.length > 0 ? dataField.getValue() : [] });
                    break;
                }
                case 'Did-i-unmatch':
                    dataRecordValuesList.push({
                        'label': 'Did-i-unmatch',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;
                case 'Notes':
                    dataRecordValuesList.push({ 'label': 'Notes', 'value': dataField.getValue() ? dataField.getValue() : '' });
                    break
                default:
                    if (!dataField.emptyFieldAllowed) {
                        console.warn(`DataField: ${dataField.title} does not have an inplementation in TinderController thus could not be resolved`);
                    }
                    break;
            }
        });
        return dataRecordValuesList;
    }
    private _convertTinderMessagesForDataRecord(matchMessages: TinderMessage[], matchPersonId: string): Message[] {
        //todo: why can't i set the interface to {message: string, timestamp: number, author: 'me' | 'match'}[] ?
        const messagesForDataRecord: Message[] = [];
        matchMessages.forEach((matchMessage) => {

            const datetime = (matchMessage: TinderMessage) => {
                if (DateHelper.isValidDate(matchMessage.sent_date)) {
                    return matchMessage.sent_date;
                }
                if (DateHelper.isValidDate(matchMessage.created_date)) {
                    return matchMessage.created_date;
                }
                if (DateHelper.isValidDate(new Date(matchMessage.timestamp).toISOString())) {
                    return new Date(matchMessage.timestamp).toISOString();
                }
                console.error(`Failed to get proper datetime for message`);
                return '';
            };

            messagesForDataRecord.push(
                {
                    message: matchMessage.message,
                    datetime: datetime(matchMessage),
                    author: matchMessage.from === matchPersonId ? MessageAuthorEnum.Match : MessageAuthorEnum.Me
                }
            );
        });
        return messagesForDataRecord;
    }

    private _getResponseSpeedMoments(matchMessages: Message[]): any[] {
        const responseSpeedMoments: any = [];

        // if there are no messages from the other person at all, return 0
        if (!matchMessages.some(message => message.author === MessageAuthorEnum.Match)) {
            return responseSpeedMoments;
        }

        matchMessages.forEach((currentMessage: Message, index: number, messagesList: Message[]) => {
            const nextMessage: Message | undefined = (index + 1) < (messagesList.length - 1) ? messagesList[index + 1] : undefined;
            // if the first message is from me, and the second message is from the other person

            // total messagesList (existing items) is 89
            // if 88, index + 1 = 89, messageList (90)-1 = 89 = gets the 89th message
            // if 89 (last item) + 1 = 90, messageList is (90)-1 = 89, item is NOT less than messageList, thus undefined

            if (!nextMessage) {
                return;
            }

            if (currentMessage.author !== MessageAuthorEnum.Match && nextMessage.author === MessageAuthorEnum.Match) {
                // get the difference between these two moments in datetime

                // add this datetime to the list
                responseSpeedMoments.push({
                    datetimeMyLastMessage: currentMessage.datetime,
                    datetimeTheirResponse: nextMessage.datetime,
                    // get the difference in MS between the following received message received from my match and my previously sent message
                    differenceInMS: new Date(nextMessage.datetime).getTime() - new Date(currentMessage.datetime).getTime()
                });

            }
        });

        return responseSpeedMoments;
    }
    private _getNumberOfGhosting(matchMessages: Message[], match?: Match, dateAcquiredNumber?: string | null, dateBlockedOrRemoved?: string | null): ghostMoment[] {

        let amountOfGhosts = 0;
        const ghostsList: ghostMoment[] = [];

        // if there are no messages from the other person at all, return 0
        if (!matchMessages.some(message => message.author === MessageAuthorEnum.Match)) {
            return ghostsList;
        }

        matchMessages.reduce((formerMessage, laterMessage) => {

            // 1. is there 2 days or more in between my last message and her reply message? = ghost moment
            // if(myMessage.from !== matchPersonId && matchMessageReply.from === matchPersonId){

            const isMatchMessageLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(formerMessage.datetime, dateAcquiredNumber) : false;
            const isMyMessageLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(laterMessage.datetime, dateAcquiredNumber) : false;
            if (isMatchMessageLaterThanAcquiredNumberDate || isMyMessageLaterThanAcquiredNumberDate) {
                // date is later thasn acquired number date, thus should no longer add ghostMoments.
                return laterMessage;
            }

            const isMatchMessageLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(formerMessage.datetime, dateBlockedOrRemoved) : false;
            const isMyMessageLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(laterMessage.datetime, dateBlockedOrRemoved) : false;
            if (isMatchMessageLaterThanBlockedDate || isMyMessageLaterThanBlockedDate) {
                // date is later than blocked or removed date, thus should no longer add ghostMoments.
                return laterMessage;
            }

            const matchMessageReplyTimeStamp = new Date(laterMessage.datetime).getTime();
            const myMessageTimeStamp = new Date(formerMessage.datetime).getTime();

            const isGhostMoment = DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(myMessageTimeStamp, matchMessageReplyTimeStamp, 2);
            //todo: What if I ghost her!? she sends me message after message.. will get registered as a ghost moment..
            if (isGhostMoment) {
                ghostsList.push(
                    {
                        number: amountOfGhosts,
                        timeSinceLastMessageMS: matchMessageReplyTimeStamp - myMessageTimeStamp,
                        status: laterMessage.author === MessageAuthorEnum.Match ? GhostStatus.REPLIED : GhostStatus.NOT_REPLIED_TO_REMINDER
                    }
                );
                amountOfGhosts = amountOfGhosts + 1;
            }

            return laterMessage;
        });

        // 2. is the last message sent from me AND is it older or equal than 2 days?  = ghost moment
        const lastMessage: Message = matchMessages[matchMessages.length - 1];
        const lastMessageTimeStamp = new Date(lastMessage.datetime).getTime();

        const isLastMessageLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(lastMessage.datetime, dateAcquiredNumber) : false;
        const isLastMessageLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(lastMessage.datetime, dateBlockedOrRemoved) : false;

        if (dateBlockedOrRemoved && dateBlockedOrRemoved.length > 0) {
            const lastGhostMoment = ghostsList.pop();
            if (lastGhostMoment && lastGhostMoment.status === GhostStatus.NOT_REPLIED_TO_REMINDER) {
                lastGhostMoment.status = GhostStatus.BLOCKED;
                ghostsList.push(lastGhostMoment);
            }
        }

        if (isLastMessageLaterThanAcquiredNumberDate || isLastMessageLaterThanBlockedDate) {
            // lastMessage date is later than blocked or removed date, thus should no longer add ghostMoments.
            return ghostsList;
        }

        if (lastMessage.author !== MessageAuthorEnum.Match && DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(lastMessageTimeStamp, new Date().getTime(), 2)) {
            ghostsList.push(
                {
                    number: amountOfGhosts,
                    timeSinceLastMessageMS: new Date().getTime() - lastMessageTimeStamp,
                    status: GhostStatus.NOT_REPLIED
                }
            );
            amountOfGhosts = amountOfGhosts + 1;
        }

        return ghostsList;
    }

    private _hasConversation(matchMessages: Message[]): boolean {
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

        let lastRespondent: MessageAuthorEnum;

        matchMessages.forEach((message, index) => {
            // determine the sender of the first message
            if (index === 0) {
                if (message.author === MessageAuthorEnum.Match) {
                    amountMessagesSentByOther = amountMessagesSentByOther + 1;
                } else {
                    amountMessagesSentByMe = amountMessagesSentByMe + 1;
                }
                lastRespondent = message.author;
            }

            // determine if the next message after the first is from different sender
            if (index !== 0 && message.author !== lastRespondent) {
                if (message.author === MessageAuthorEnum.Match) {
                    amountMessagesSentByOther = amountMessagesSentByOther + 1;
                } else {
                    amountMessagesSentByMe = amountMessagesSentByMe + 1;
                }
                lastRespondent = message.author;
            }

        });
        if (amountMessagesSentByMe >= 3 && amountMessagesSentByOther >= 3) {
            return true;
        } else {
            return false;
        }
    }

    private _hasMatchGivenResponse(matchMessages: Message[]): boolean {
        return matchMessages.some((matchMessage) => {
            return matchMessage.author === MessageAuthorEnum.Match;
        });
    }

    private _hasMatchSentFirstMessage(matchMessages: Message[]): boolean {
        return matchMessages[0].author === MessageAuthorEnum.Match ? true : false;
    }

    private _isVerifiedMatch(badgesList: Badges[]): boolean {
        if (badgesList.length > 0) {
            return badgesList.some((badge) => {
                return badge.type === "selfie_verified";
            });
        } else {
            return false;
        }
    }

    public setCredentials(): boolean {
        const tinderXAuthToken: string | null = localStorage.getItem('TinderWeb/APIToken');
        if (tinderXAuthToken && tinderXAuthToken.length > 0) {
            this.xAuthToken = tinderXAuthToken;
            return true;
        }
        return false;
    }

    public setSwipeHelperOnScreen(): void {
        this.screenList.updateCurrentScreen(this.getCurrentScreenByUrlAndDOM());
        this.addUIHelpers(this.screenList, this.currentDataRecordSwipe);
    }

    public addUIHelpers(screenController: ScreenController, dataRecordToBeUsedForSwipe: DataRecord, forceRefresh?: boolean): void {
        if (screenController.getCurrentScreen().getScreenIsChatScreen()) {

            if (forceRefresh) {
                this.uiRenderer.removeAllUIHelpers();
            }

            // 1. get current messageListItemPerson
            const currentMatchid: string = this.getCurrentMatchIdFromChatScreen();
            let dataRecord: DataRecord | null = null;
            let dataFields: DataField[] | undefined | null = undefined;

            // 2. get record in table for this person
            if (currentMatchid.length > 0) {
                const recordIndexId = this.dataTable.getRecordIndexBySystemId(currentMatchid, 'tinder');
                if (recordIndexId !== -1) {
                    // todo: so i need to get the data first BEFORE i update the record? or just change this entirely?
                    // todo: why do i need to include undefined here while at no point in the assignment of this variabele does it ever get undefined assigned to it?
                    dataRecord = this.dataTable.getRecordByRecordIndex(recordIndexId);
                    if (dataRecord !== null) {
                        dataFields = dataRecord.getDataRecordDataFields();

                        // 3. show helpers for chat (all?), make space above messagebox, put helper container there?
                        this.uiRenderer.renderFieldsContainerForScreen(screenController, () => {
                            // $('div[id*="SC.chat"]').first().css('width', '730px');

                            // since the uiHelpers are now being put on the body, the code below is no longer necessary
                            // const chatContainerDOM: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector('div[id*="SC.chat"]');
                            // if (chatContainerDOM !== null) {
                            //     $(chatContainerDOM).css('padding-right', '315px');
                            // } else {
                            //     console.error(`Cannot find chat container DOM element. Please update the selectors.`);
                            //     return;
                            // }

                        });
                        let uiRequiredDataFields: DataField[] = [];

                        if (dataFields && dataFields.length > 0) {
                            uiRequiredDataFields = dataRecord.getDataFields(false, true, UIRequired.CHAT_ONLY);

                            // 4. on send/receive message.. add message to/update dataRecord? (check; messageListObserver)
                            // 5. on switch person in messagelist; switch settings of the above? (check screenWatcher (Observer))
                            this.uiRenderer.renderFieldsFromDataFields(uiRequiredDataFields,
                                (value: DataRecordValues) => {
                                    console.log(`Updated value to existing data record; label: ${value.label}, value: ${value.value}`);
                                    const updatedValuesForDataFields: DataRecordValues[] = [value];

                                    if (value.label === "Acquired-number" && value.value) {
                                        updatedValuesForDataFields.push({
                                            label: 'Date-of-acquired-number',
                                            value: new Date().toISOString()
                                        });
                                    } else if (value.label === "Acquired-number" && !value.value) {
                                        updatedValuesForDataFields.push({
                                            label: 'Date-of-acquired-number',
                                            value: null
                                        });
                                    }

                                    dataRecord?.addDataToDataFields(updatedValuesForDataFields);
                                    console.log(`Updated dataRecord: `);
                                    console.dir(dataRecord);
                                }, (submitType: SubmitType) => {
                                    console.log("pre-submit, not relevant for chat page");
                                }, (submitType: SubmitType) => {
                                    dataRecord?.setUpdateMessages(true);
                                });
                        }

                        const indexDataFieldDistance = dataRecord.getIndexOfDataFieldByTitle('Distance-in-km');
                        if (indexDataFieldDistance !== -1) {

                            const distanceDataField = dataRecord.usedDataFields[indexDataFieldDistance] as DataFieldDistances;
                            const hasRecentDistanceEntry = distanceDataField.containsRecordWithinHours(12);
                            const personId: string | null = dataRecord.getRecordPersonSystemId(this.nameController, true);

                            if (hasRecentDistanceEntry === false && personId && personId.length > 0) {
                                this.requestHandler.getProfileDetailsStart(personId).then((matchDetails: MatchDetailsAPI) => {

                                    const dataForDataFields: DataRecordValues[] = [
                                        {
                                            label: 'Name',
                                            // value: matchDetails?.results?.name ? matchDetails.results.name : 'Unknown name'
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Name')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Name')].getValue() : (matchDetails?.results?.name ? matchDetails.results.name : 'Unknown name')
                                        },
                                        {
                                            label: 'Age',
                                            // value: matchDetails?.results?.birth_date ? DateHelper.getAgeFromBirthDate(matchDetails.results.birth_date) : NaN
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Age')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Age')].getValue() : (matchDetails?.results?.birth_date ? DateHelper.getAgeFromBirthDate(matchDetails.results.birth_date) : NaN)
                                        },
                                        {
                                            label: 'City',
                                            // value: matchDetails?.results?.city?.name.length > 0 ? matchDetails.results.city.name : ''
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('City')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('City')].getValue() : (matchDetails?.results?.city?.name.length > 0 ? matchDetails.results.city.name : '')
                                        },
                                        {
                                            label: 'Job',
                                            // value: matchDetails?.results?.jobs?.at(0)?.title?.name ? matchDetails?.results.jobs.at(0)?.title.name : ''
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Job')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Job')].getValue() : (matchDetails?.results?.jobs?.at(0)?.title?.name ? matchDetails?.results.jobs.at(0)?.title?.name : '')

                                        },
                                        {
                                            label: 'School',
                                            // value: matchDetails?.results?.schools?.at(0)?.name ? matchDetails?.results.schools.at(0)?.name : ''
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('School')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('School')].getValue() : (matchDetails?.results?.schools?.at(0)?.name ? matchDetails?.results.schools.at(0)?.name : '')
                                        },
                                        {
                                            label: 'Gender',
                                            // value: matchDetails?.results?.gender ? this._getGender(matchDetails?.results?.gender) : ''
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Gender')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Gender')].getValue() : (matchDetails?.results?.gender ? this._getGender(matchDetails?.results?.gender) : '')

                                        },
                                        {
                                            label: 'Interests',
                                            // value: matchDetails?.results?.user_interests?.selected_interests?.length > 0 ? this._getInterests(matchDetails?.results?.user_interests?.selected_interests) : []
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Interests')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Interests')].getValue() : (matchDetails?.results?.user_interests?.selected_interests?.length > 0 ? this._getInterests(matchDetails?.results?.user_interests?.selected_interests) : [])
                                        },
                                        {
                                            label: 'Has-profiletext',
                                            // value: matchDetails?.results?.bio.length > 0 ? true : false
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Has-profiletext')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Has-profiletext')].getValue() : (matchDetails?.results?.bio.length > 0 ? true : false)
                                        },
                                        {
                                            label: 'Is-verified',
                                            // value: matchDetails?.results?.badges.length > 0 ? this._isVerifiedMatch(matchDetails?.results?.badges) : false
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Is-verified')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Is-verified')].getValue() : (matchDetails?.results?.badges.length > 0 ? this._isVerifiedMatch(matchDetails?.results?.badges) : false)

                                        },
                                        {
                                            label: 'Distance-in-km',
                                            value: [{
                                                dateTime: new Date().toISOString(),
                                                distanceInKM: this._convertDistanceMilesToKM(matchDetails?.results?.distance_mi)
                                            }]
                                        },
                                        {
                                            label: 'Amount-of-pictures',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Amount-of-pictures')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Amount-of-pictures')].getValue() : this.getAmountOfPictures(matchDetails.results)
                                        },
                                    ];

                                    dataRecord?.addDataToDataFields(dataForDataFields);

                                });
                            }
                        }
                    }
                } else {
                    //todo: needs inplementation on what to do if recordid is not found? This should not happen tho.. wait.. yes it should! What if i get a new match after i imported everything and started chatting with match!?
                    console.error('Current match id not found');
                    // 2.a if chat new person (recognize chat new person or not) (and record does not exist yet); add new record?
                    //todo: nice-to-have; prompt user to add this unknown person or not?
                    // dataRecord = new DataRecord();
                    // dataRecord.addDataToDataFields([{ label: "System-no", value: currentMatchid}]);

                    //todo: gather person data by ui (but this time; via chat interface!) OR; get data by api?
                }

            } else {
                console.error('Invalid matchId.');
            }


        }

        if (screenController.isSwipeScreen()) {

            if (forceRefresh) {
                this.uiRenderer.removeAllUIHelpers();
            }

            const newDataRecord: DataRecord = dataRecordToBeUsedForSwipe;

            this.uiRenderer.renderFieldsContainerForScreen(screenController, () => {

                if (this.screenList.isCurrentScreenNeedsUIAdjustments()) {
                    const swipeContainerDOM: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector('.recsCardboard__cards');
                    const swipeContainerDOMProfile: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector('.profileCard__card');
                    if (swipeContainerDOM !== null) {
                        $(swipeContainerDOM).css('position', 'absolute');
                        $(swipeContainerDOM).css('left', '-200px');
                    } else if(swipeContainerDOMProfile !== null){
                        // nothing to adjust here
                    }else {
                        console.error(`Cannot find swipe container DOM element. Please update the selectors.`);
                        return;
                    }
                }
            },
                () => {
                    const dataRecordValuesFromCollectedData: DataRecordValues[] = [];
                    this.screenList.getCurrentScreen().getScreenElements().forEach((screenElement: ScreenElement) => {
                        const hasCollectedData = screenElement.collectData();

                            switch (screenElement.getName()) {
                                case "Name": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: screenElement.getValueAsString()
                                        });
                                    break;
                                }
                                case "Age": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: screenElement.getValueAsNumber()
                                        });
                                    break;
                                }
                                case "Job": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: hasCollectedData ? screenElement.getValueAsString() : "" 
                                        });
                                    break;
                                }
                                case "School": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: hasCollectedData ? screenElement.getValueAsString() : ""
                                        });
                                    break;
                                }
                                case "City": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: hasCollectedData ? screenElement.getValueAsString() : ""
                                        });
                                    break;
                                }
                                case "Has-profiletext": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: hasCollectedData ? screenElement.getValueAsString() : false
                                        });
                                    break;
                                }
                                case "Is-verified": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: hasCollectedData ? screenElement.getValueAsBoolean() : false
                                        });
                                    break;
                                }
                                case "Amount-of-pictures": {
                                    dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: hasCollectedData ? screenElement.getValueAsString() : null
                                        });
                                    break;
                                }
                                case "Distance-in-km": {
                                    hasCollectedData ? dataRecordValuesFromCollectedData.push(
                                        {
                                            label: screenElement.getName(),
                                            value: [{
                                                dateTime: new Date().toISOString(),
                                                distanceInKM: screenElement.getValueAsNumber()
                                            }]
                                        }) : null;
                                    break;
                                }
                                default:
                                    ConsoleColorLog.singleLog(`Screen element with name: ${screenElement.getName()} is not collected for adding to the dataRecord. Please check if this is correct.`, screenElement.getValueAsString(), LogColors.YELLOW);
                            }
                    });
                    this.screenList.getCurrentScreen().clearValuesScreenElements();

                    ConsoleColorLog.multiLog(`Here is the collected data from DOM: `, dataRecordValuesFromCollectedData, LogColors.GREEN, true);

                    newDataRecord.addDataToDataFields(dataRecordValuesFromCollectedData);
                    this.uiRenderer.updateDataFieldValues();

                    // TODO TODO TODO: first get if user is on swipe or swipe profile screen? both delivers different DOM,.. but wait! i removed swipe-profile screen..
                    // todo: nice what i thought about making each dataField autogather or not, but this was not needed.. so maybe remove the autoGather & autoGatherOnce all together to reduce unnecessary complexity?
                });

            const uiRequiredDataFields: DataField[] = newDataRecord.getDataFields(false, true, UIRequired.SELECT_ONLY);

            newDataRecord.addDataToDataFields([
                // set initial value to later be adjusted by ui control
                {
                    label: 'Has-usefull-profiletext',
                    value: false
                },
                {
                    label: 'Attractiveness-score',
                    value: 6
                },
                {
                    label: 'Seems-fake',
                    value: false
                },
                {
                    label: 'Seems-empty',
                    value: false
                },
                {
                    label: 'Seems-obese',
                    value: false
                },
                {
                    label: 'Seems-toppick',
                    value: false
                },
                {
                    label: 'Last-updated',
                    value: new Date().toISOString()
                },
                {
                    label: 'Is-match',
                    value: false
                },
                {
                    label: 'Date-liked-or-passed',
                    value: new Date().toISOString()
                },
            ]);

            // todo: WHY NOT DIRECTLY GET/USE DATA FIELDS? WHY GET DATAFIELDTYPES AT ALL? cuz i might also need required property in the future, i need a default value (which i'm going to set on data field), i DO need a already set property for use when chatting etc..
            let timeoutSubmit: number | null = null;
            this.uiRenderer.renderFieldsFromDataFields(uiRequiredDataFields, (value: DataRecordValues) => {
                console.log(`Added value to new data record; label: ${value.label}, value: ${value.value}`);
                newDataRecord.addDataToDataFields([value]);
                console.log(`Updated dataRecord: `);
                console.dir(newDataRecord);

            }, (submitType: SubmitType) => {
                console.log('Callback received a (pre-)submit type! But it will only be used if no response from background can be retrieved');
                this._postMessageBackgroundScript(PortAction.SWIPED_PERSON_ACTION_START);

            }, (submitType: SubmitType) => {
                console.log('Callback received a submit type! But it will only be used if no response from background can be retrieved');
                Overlay.setLoadingOverlay('loadingSwipeAction', true);
                console.log(submitType);

                this._postMessageBackgroundScript(PortAction.SWIPED_PERSON_ACTION_PROCESS);

                console.log(this.dataStorage);
                console.assert(this.dataStorage.popLastActionFromDataStore() === undefined);

                //todo: refactor all code below to use a promise, in which a set interval checks every 100ms orso if a dataStorage item is available then executes code as normal to a max of 60 sec
                // OR even better; once submittype has been pressed, do nothing here, copy the code below to the backgroundscriptlistener? (let THAT code check if we are on swiping page, what is filled into the datafields etc.)
                // OR EVEN BETTER YET; this code (except for when the timeout begins should always run first, sooner than my backgroundscript can receive a response..), so; create a new promise, add it to the dataStore, let the eventlistener from backgroundscript trigger the resolve, if no response comes make my script below (with timeout) trigger the reject after 1 min orso

                // get (request) personid from backgroundscript (get response), after 1 sec
                const ms = 2000;

                if (timeoutSubmit !== null) {
                    return;
                }

                timeoutSubmit = setTimeout(() => {
                    console.log('this is what is found in dataStore after 2 sec: ');
                    console.log(this.dataStorage);
                    const submitAction: SubmitAction | undefined = this.dataStorage.popLastActionFromDataStore();
                    console.log(submitAction);

                    let typeOfLikeOrPass = '';
                    if (submitAction !== undefined) {
                        let personActionStatus: boolean | undefined = undefined;
                        if (submitAction.submitType === PersonAction.LIKED_PERSON) {
                            personActionStatus = true;
                            typeOfLikeOrPass = 'like';
                        }
                        if (submitAction.submitType === PersonAction.SUPER_LIKED_PERSON) {
                            personActionStatus = true;
                            typeOfLikeOrPass = 'superlike';
                        }
                        if (submitAction.submitType === PersonAction.PASSED_PERSON) {
                            personActionStatus = false;
                            typeOfLikeOrPass = 'pass';
                        }

                        if (personActionStatus === undefined) {
                            return;
                        }

                        const dataForDataFields: DataRecordValues[] = [
                            {
                                label: 'System-no',
                                value: {
                                    appType: 'tinder',
                                    tempId: submitAction.personId
                                }
                            },
                            {
                                label: 'Did-i-like',
                                value: personActionStatus
                            },
                            {
                                label: 'Type-of-match-or-like',
                                value: [typeOfLikeOrPass]
                            },
                        ];
                        newDataRecord.addDataToDataFields(dataForDataFields);

                        this.requestHandler.getProfileDetailsStart(submitAction.personId).then((matchDetails: MatchDetailsAPI) => {
                            //todo: Build in; valid from guard. I must check a box in order to proceed to 'like' or 'pass' a person to prevent accidental skipping a field

                            const dataForDataFields: DataRecordValues[] = [
                                {
                                    label: 'Name',
                                    value: matchDetails?.results?.name ? matchDetails.results.name : 'Unknown name'
                                },
                                {
                                    label: 'Age',
                                    value: matchDetails?.results?.birth_date ? DateHelper.getAgeFromBirthDate(matchDetails.results.birth_date) : NaN
                                },
                                {
                                    label: 'City',
                                    value: matchDetails?.results?.city?.name.length > 0 ? matchDetails.results.city.name : ''
                                },
                                {
                                    label: 'Job',
                                    value: matchDetails?.results?.jobs?.at(0)?.title?.name ? matchDetails?.results.jobs.at(0)?.title.name : ''
                                },
                                {
                                    label: 'School',
                                    value: matchDetails?.results?.schools?.at(0)?.name ? matchDetails?.results.schools.at(0)?.name : ''
                                },
                                {
                                    label: 'Gender',
                                    value: matchDetails?.results?.gender ? this._getGender(matchDetails?.results?.gender) : ''
                                },
                                {
                                    label: 'Interests',
                                    value: matchDetails?.results?.user_interests?.selected_interests?.length > 0 ? this._getInterests(matchDetails?.results?.user_interests?.selected_interests) : []
                                },
                                {
                                    label: 'Has-profiletext',
                                    value: matchDetails?.results?.bio.length > 0 ? true : false
                                },
                                {
                                    label: 'Is-verified',
                                    value: matchDetails?.results?.badges.length > 0 ? this._isVerifiedMatch(matchDetails?.results?.badges) : false
                                }
                            ];

                            if (matchDetails?.results?.distance_mi) {
                                dataForDataFields.push({
                                    label: 'Distance-in-km',
                                    value: [{
                                        dateTime: new Date().toISOString(),
                                        distanceInKM: this._convertDistanceMilesToKM(matchDetails?.results?.distance_mi)
                                    }]
                                });
                            }

                            newDataRecord.addDataToDataFields(dataForDataFields);

                        }).catch(() => {
                            console.error(`Swiped person received tempId, but could not get details of swiped person! Saving inserted info of record regardless`);
                        }).finally(() => {
                            this.dataTable.addNewDataRecord(newDataRecord, this.nameController);

                            if (this.screenList.isCurrentScreenMultiSwipe()) {
                                console.log(`CURRENT SCREEN IS SWIPE OR SWIPEEXPLORE, thus re-adding UI HELPERS NOW`);
                                this.currentDataRecordSwipe = new DataRecord();
                                this.addUIHelpers(this.screenList, this.currentDataRecordSwipe, true);
                            } else {
                                console.log(`CURRENT SCREEN IS ${this.screenList.getCurrentScreen()}, THUS REMOVING ALL UI HELPERS NOW`);
                                this.uiRenderer.removeAllUIHelpers();
                            }

                            this._logLatestDataRecord(newDataRecord);

                            Overlay.setLoadingOverlay('loadingSwipeAction', false);
                        });
                    } else {
                        newDataRecord.addDataToDataFields([
                            // set initial value to later be adjusted by ui control
                            {
                                label: 'System-no',
                                value: {
                                    appType: 'tinder',
                                    tempId: `idNotRetrievedPleaseCheckBackgroundRequestsBackupsInLocalStorage-${new Date().toISOString()}`
                                }
                            },
                            {
                                label: 'Did-i-like',
                                value: submitType === 'liked' ? true : false
                            },
                            {
                                label: 'Type-of-match-or-like',
                                value: [submitType]
                            },
                        ]);
                        this.dataTable.addNewDataRecord(newDataRecord, this.nameController);

                        if (this.screenList.isCurrentScreenMultiSwipe()) {
                            console.log(`CURRENT SCREEN IS SWIPE OR SWIPEEXPLORE, thus re-adding UI HELPERS NOW`);
                            this.currentDataRecordSwipe = new DataRecord();
                            this.addUIHelpers(this.screenList, this.currentDataRecordSwipe, true);
                        } else {
                            console.log(`CURRENT SCREEN IS ${this.screenList.getCurrentScreen()}, THUS REMOVING ALL UI HELPERS NOW`);
                            this.uiRenderer.removeAllUIHelpers();
                        }

                        this._logLatestDataRecord(newDataRecord);

                        Overlay.setLoadingOverlay('loadingSwipeAction', false);

                        // eslint-disable-next-line no-debugger
                        debugger;
                        console.error(`Swiped person received no tempId! Saving inserted info of record regardless.. Don't forget to check background local storage requests backup to get the corresponding personid and to overwrite the tempId later!`);
                        alert(`Swiped person received no tempId! Saving inserted info of record regardless.. Don't forget to check background local storage requests backup to get the corresponding personid and to overwrite the tempId later!`);
                        //todo: Should REALLY throw a important alert to notify myself what I need to pay extra attention!
                    }
                    this._postMessageBackgroundScript(PortAction.SWIPED_PERSON_ACTION_END);
                    timeoutSubmit = null;
                }, ms);
            });
        }

        //todo: create view to show gathered info for all dataFields (thus also showing current value of; name, age, hasProfiletext etc.)
        //todo: create 're-try retrieve' button; for when the tinder UI finishes loading too late and my app already attempted to gather data
        //todo: figure out a solution to auto get 'hasProfileText' for when a profile DOES HAVE profileText but isnt show in the initial view because there is too much other info (location, age, distance, job etc.).. maybe do inplement a previous screen?

        //todo: create ability to while swipe/chat see all the values being stored for this record/person

        //todo: create checker method which checks if above DOM element ref exists, otherwise throw error
        //todo: FUTURE; create checker method which checks if all required DOM elements used here still exist (auto loop through application?)
        //todo: add other state (if,.. or seperate method) for adding chat ui helper VS swipe ui helper. Currently working on swipe ui helper

        //todo: seperate out logic for everything UI related; create a seperate class which recognizes app state (which screen we are on), removes existing helprs when on switch etc.
    }
    private _logLatestDataRecord(newDataRecord: DataRecord) {
        const name = newDataRecord.getDataFields().find((dataField) => dataField.title === "Name")?.getValue();
        const notes = newDataRecord.getDataFields().find((dataField) => dataField.title === "Notes")?.getValue();

        console.log(`%c I just added the new dataRecord to dataTable: ${newDataRecord}`, "color: DarkOliveGreen");
        console.log(`%c New dataRecord name: ${name}, && Notes: ${notes}`, "color: DarkOliveGreen");
    }

    private _getTypeOfMatchAndLike(matchDetailsResults: Match): string[] {
        const matchOrLikeStringsList: string[] = [];

        if (matchDetailsResults.is_boost_match) {
            matchOrLikeStringsList.push('boost_match');
        }
        if (matchDetailsResults.is_experiences_match) {
            matchOrLikeStringsList.push('experiences_match');
        }
        if (matchDetailsResults.is_fast_match) {
            matchOrLikeStringsList.push('fast_match');
        }
        if (matchDetailsResults.is_super_boost_match) {
            matchOrLikeStringsList.push('super_boost_match');
        }
        if (matchDetailsResults.is_super_like) {
            matchOrLikeStringsList.push('super_like_match');
        }
        if (matchDetailsResults.super_liker && typeof matchDetailsResults.super_liker === 'string') {
            if (matchDetailsResults.super_liker === matchDetailsResults.person._id) {
                matchOrLikeStringsList.push('match_sent_me_superlike');
            } else {
                matchOrLikeStringsList.push('i_sent_match_superlike');
            }
        }

        return matchOrLikeStringsList;
    }

    private _getInterests(selectedInterests: Record<string, string>[]): string[] {
        const hasRecognizedStructure = selectedInterests.every((selectedInterest) => Object.prototype.hasOwnProperty.call(selectedInterest, "name") && selectedInterest['name'].length > 0 ? true : false);
        if (hasRecognizedStructure) {
            return selectedInterests.map((selectedinterest) => {
                return selectedinterest['name'] as string;
            });
        }
        console.warn(`Could not get interests as the received interests array does not match the recognized structure required. Check the interests received.`);
        return [];
    }

    private _getGender(genderCode: number): string {
        switch (genderCode) {
            // update: despite this was shown in the unofficial online documentation (https://gist.github.com/rtt/10403467); 0 = male, 1 = female
            // it does turn out when i get match details at least that -1 = female, 1 is male?
            // it also turns out when i retrieve results from getMatches that 1 = female!? so.. -1 is male? or is both -1 and 1 female and 0 is male????
            // todo: double check this for both gender, for every api where i get person object. 
            case 1:
                return 'Female';
            case -1:
                return 'Female';
            case 0:
                console.warn(`This profile will be assigned gender = 0, is male right?`);
                return 'Male';
            default:
                console.warn(`Tried to get gender by genderCode but genderCode was not recognized: ${genderCode}. Thus "Other" was inserted. Checking & updating genderCodes may be advised.`);
                return 'Other';
        }
    }

    private _convertDistanceMilesToKM(distance_mi: number): number {
        return (distance_mi * 1.6);
    }

    public getCurrentMatchIdFromChatScreen(): string {
        const matchIdFromUrl: string | null = this.getCurrentMatchIdFromUrl();
        if (matchIdFromUrl) {
            return matchIdFromUrl;
        } else {
            console.error(`Message List Item DOM Element not found. Please check & update the selector.`);
        }
        return '';
    }

    private getCurrentMatchIdFromUrl(): string | null {
        const indexLastSlash: number = window.location.href.lastIndexOf('/');
        if (indexLastSlash >= 0) {
            return window.location.href.substring(indexLastSlash + 1);
        } else {
            console.error(`Url does not seem to contain a slash?`);
            return null;
        }
    }

    private getMatchIdFromMessageHrefSDtring(href: string): string {
        return href.substring(href.lastIndexOf('/') + 1);
    }

    public getCurrentScreenByUrlAndDOM(): ScreenNavStateComboTinder {
        const swipeIdentifier = '.recsToolbar';
        const chatIdentifier = '.chat';

        const detailIdentifier = '.profileCard__card';

        let currentPage: ScreenNavStateComboTinder;

        switch (true) {
            case $(swipeIdentifier).length > 0 && window.location.href.includes("/app/explore/") && $(detailIdentifier).length === 0:
                currentPage = ScreenNavStateComboTinder.SwipeExplore;
                break;
            case $(swipeIdentifier).length > 0 && window.location.href.includes("/app/explore/") && $(detailIdentifier).length > 0:
                currentPage = ScreenNavStateComboTinder.SwipeExploreDetail;
                break;
            case $(swipeIdentifier).length > 0 && window.location.href.endsWith("app/likes-you"):
                currentPage = ScreenNavStateComboTinder.SwipeGold;
                break;
            case $(swipeIdentifier).length > 0 && window.location.href.includes("recs") && $(detailIdentifier).length === 0:
                currentPage = ScreenNavStateComboTinder.Swipe;
                break;
            case $(swipeIdentifier).length > 0 && window.location.href.includes("recs")  && $(detailIdentifier).length > 0:
                currentPage = ScreenNavStateComboTinder.SwipeDetail;
                break;
            case $(chatIdentifier).length > 0 && window.location.href.includes('messages'):
                currentPage = ScreenNavStateComboTinder.Chat;
                break;
            default:
                currentPage = ScreenNavStateComboTinder.UnknownScreen;
                break;
        }
        console.log(`You are on page: ${currentPage}`);
        return currentPage;
    }

    public getMatchesAndMatchMessagesByAPI(requestHandler: RequestHandlerTinder, useMock: boolean): Promise<ParsedResultMatch[] | null> {
        //todo: make seperate out logic in different methods because whilst 'getData' may be generic, getting it will differ for each supported app.

        return new Promise<ParsedResultMatch[]>((resolve, reject) => {

            if (useMock) {

                console.error(`Mock unavailable, please set a (new) mock first`);

                resolve([]);

                // const test: ParsedResultMatch[] = <ParsedResultMatch[]><unknown>matchMockTwo;
                // console.log(`Mock data (matches & messages):`);
                // console.log(matchMockTwo);
                // resolve(test);
            }

            if (requestHandler) {
                this.getMatches().then((matchList: ParsedResultMatch[] | null) => {
                    async function getMessagesPerMatchesAsynchronously(matchesWithoutMessagesList: ParsedResultMatch[]): Promise<ParsedResultMatch[]> {
                        // used a standard for loop to ensure synchronous looping
                        for (let i = 0; i < matchesWithoutMessagesList.length; i = i + 1) {
                            console.log(`GETTING MESSAGES now for: ${i} - ${matchesWithoutMessagesList[i].match.id}`);
                            matchesWithoutMessagesList[i].matchMessages = await requestHandler.getMatchesMessagesStart(matchesWithoutMessagesList[i].match.id);
                            return matchesWithoutMessagesList;
                        }
                        return matchesWithoutMessagesList;
                    }

                    if (matchList === null) {
                        reject(null);
                    } else {
                        resolve(getMessagesPerMatchesAsynchronously(matchList));
                    }

                });

            } else {
                console.error(`The requestHandler was not set`);
                return null;
            }
        });
    }

    public getMatches(): Promise<ParsedResultMatch[] | null> {
        return new Promise<ParsedResultMatch[] | null>((resolve, reject) => {
            if (!this.requestHandler) {
                reject(null);
            }
            this.requestHandler.getMatchesStart().then((matches: ParsedResultMatch[] | null) => {
                console.log(`Matches:`);
                console.dir(matches);

                if (matches && matches.length > 0) {
                    resolve(matches);
                } else {
                    reject(null);
                }
            });
        });
    }

    public updateMessagesDataRecords(requestHandler: RequestHandlerTinder, dataRecords: DataRecord[], matches: ParsedResultMatch[]): Promise<boolean> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve, reject) => {
            if (dataRecords.length === 0) {
                console.error(`Data records amount cannot be 0`);
                return reject(false);
            }

            for (let i = 0; i <= (dataRecords.length - 1); i = i + 1) {
                console.log(`GETTING MESSAGES now for: ${i} - ${dataRecords[i].usedDataFields[5].getValue()}`);
                const systemIdMatch = dataRecords[i].getRecordPersonSystemId('tinder');

                if (!systemIdMatch) {
                    console.warn(`Could not get messages because systemidMatch was: ${systemIdMatch}`);
                } else {
                    const personId = this.getPersonIdFromMatch(systemIdMatch, matches);
                    const messages = await requestHandler.getMatchesMessagesStart(systemIdMatch);

                    if (personId) {
                        const messagesDataField = dataRecords[i].usedDataFields[2] as DataFieldMessages;
                        messagesDataField.updateMessagesList(this._convertTinderMessagesForDataRecord(messages.reverse(), personId), true)
                    } else {
                        console.warn(`Messages could not be added to dataRecord because personId was not found in matches array. Please check the values provided.`);
                    }
                }

                if (i === (dataRecords.length - 1)) {
                    return resolve(true);
                }
            }
        });

    }
    public getPersonIdFromMatch(systemIdMatch: string, matches: ParsedResultMatch[]): string | null {
        if (!systemIdMatch || !matches || matches.length === 0) {
            console.error(`Insufficient systemIdMatch or match array was provided. Please check the provided values.`);
            return null;
        }
        const match = matches.find((match) => {
            return match.match._id === systemIdMatch || match.match.person._id === systemIdMatch;
        });
        if (match) {
            return match.match.person._id;
        } else {
            console.error(`No match found in match array with systemIdMatch: ${systemIdMatch}`);
            return null;
        }
    }

    public updateDataTable(matches: ParsedResultMatch[]): void {

        matches?.forEach((match: ParsedResultMatch) => {

            // Since Tinder sends the messages in the order from last to first, we must first reverse the messages to first to last
            // since the .reverse() is applied to the array 'in place' instead of 'on output' applying it once will produce the array in desired format anywhere
            match.matchMessages.reverse();

            const matchRecordIndex: number = this.getMatchRecordIndexBySystemIdOrPersonId(match.match, this.nameController);

            let tinderMatchDataRecordValues: DataRecordValues[];
            let dataFields: DataField[];

            if (matchRecordIndex === -1) {
                // if match doesnt exist, create new data record, fill new record with all data needed
                console.log(`Going to CREATE new data record for: ${match.match.person.name}`);
                const newDataRecord = new DataRecord();
                dataFields = newDataRecord.getDataFields();

                tinderMatchDataRecordValues = this.parseMatchDataToDataRecordValues(dataFields, match, match.match.id);

                const dataAddedSuccessfully: boolean = newDataRecord.addDataToDataFields(tinderMatchDataRecordValues);
                if (dataAddedSuccessfully) {
                    this.dataTable.addNewDataRecord(newDataRecord, this.nameController);
                } else {
                    console.error(`Error adding data from retrieved match. Please check match retrieved and error log.`);
                }

            } else {
                console.log(`Going to UPDATE data record for: ${match.match.person.name}`);

                dataFields = this.dataTable.getDataFieldsByRecordIndex(matchRecordIndex);
                tinderMatchDataRecordValues = this.parseMatchDataToDataRecordValues(dataFields, match, match.match.id);
                this.dataTable.updateDataRecordByIndex(matchRecordIndex, tinderMatchDataRecordValues);
            }

        });

    }

    private getMatchRecordIndexBySystemIdOrPersonId(match: Match, nameController: string): number {
        const recordIndex = this.dataTable.getRecordIndexBySystemId(match.id, nameController);
        if (recordIndex === -1) {
            return this.dataTable.getRecordIndexBySystemId(match.person._id, nameController);
        }
        return recordIndex;
    }

    private setUnupdatedMatchesToBlocked(matches: ParsedResultMatch[], dataTable: DataTable): Promise<void> {
        return new Promise<void>((resolve) => {
            const unupdatedMatchesList: DataRecord[] = dataTable.getAllDataRecords().filter((dataRecord) => {
                const doesDataRecordNotHaveMatchListed = matches.findIndex((match) => {
                    return match.match.id === dataRecord.getRecordPersonSystemId('tinder') || match.match.person._id === dataRecord.getRecordPersonSystemId('tinder');
                });

                return doesDataRecordNotHaveMatchListed === -1 ? true : false;
            });

            for (let i = 0; i <= (unupdatedMatchesList.length - 1); i = i + 1) {
                const unupdatedMatch = unupdatedMatchesList[i];
                let presumedRequestsFired = 0;
                let actualRequestsFired = 0;

                // do not update if dataField 'Blocked' is already set to true
                const indexDataFieldBlocked: number = unupdatedMatch.getIndexOfDataFieldByTitle('Blocked-or-removed');
                let isDataFieldBlocked = false;
                if (unupdatedMatch.usedDataFields[indexDataFieldBlocked].getValue()) {
                    isDataFieldBlocked = true
                }

                // do not update if dataField 'isMatch' is still false, since this person can still become a match in the future
                const indexDataFieldIsMatch: number = unupdatedMatch.getIndexOfDataFieldByTitle('Is-match');
                let isDataFieldIsMatch = true;
                if (!unupdatedMatch.usedDataFields[indexDataFieldIsMatch].getValue()) {
                    isDataFieldIsMatch = false;
                }

                const indexDataFieldSeeminglyDeletedProfile: number = unupdatedMatch.getIndexOfDataFieldByTitle('Seemingly-deleted-profile');
                let hasDataFieldSeeminglyDeletedProfile = true;
                if (!unupdatedMatch.usedDataFields[indexDataFieldSeeminglyDeletedProfile].getValue()) {
                    hasDataFieldSeeminglyDeletedProfile = false;
                }

                if (isDataFieldBlocked || hasDataFieldSeeminglyDeletedProfile || !isDataFieldIsMatch) {
                    if (i === (unupdatedMatchesList.length - 1)) {
                        resolve();
                    }
                    continue;
                }

                presumedRequestsFired = presumedRequestsFired + 1;
                const matchId = unupdatedMatch.getRecordPersonSystemId('tinder');
                const matchName = unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Name')].getValue();

                if (!matchId) {
                    console.warn(`Could not get matchId from DataRecord, matcId result: ${matchId}, dataRecord: ${unupdatedMatch}`);
                    continue;
                }

                this.requestHandler.getMatchDetailsStart(matchId).then((matchDetails: Match | 404 | 500) => {
                    if (matchDetails === 404) {
                        console.warn(`Matchdetails: ${matchName} with id: ${matchId} gave a 404. Probably deleted profile?`);
                        console.dir(unupdatedMatchesList[i]);

                        unupdatedMatch.addDataToDataFields([
                            {
                                label: 'Blocked-or-removed',
                                value: false
                            },
                            {
                                label: 'Date-of-unmatch',
                                value: new Date().toISOString()
                            },
                            {
                                label: 'Seemingly-deleted-profile',
                                value: true
                            }
                        ]);

                        unupdatedMatch.setUpdateMessages(false);
                    }

                    if (matchDetails === 500) {
                        console.error(`Matchdetails: ${matchName} with id: ${matchId} request returned a 500. Probably only removed me as match?`);
                    }

                    if (typeof matchDetails !== 'number' && matchDetails?.closed) {
                        const indexUnmatchDatafield = unupdatedMatch.getIndexOfDataFieldByTitle('Did-i-unmatch');
                        if (unupdatedMatch.usedDataFields[indexUnmatchDatafield].getValue()) {
                            console.warn(`Matchdetails: ${matchName} with id: ${matchId} request returned a 200 while our match is gone. I (ME) deleted our match!`);
                            console.warn(unupdatedMatchesList[i]);
                        } else {
                            console.warn(`Matchdetails: ${matchName} with id: ${matchId} request returned a 200 while our match is gone. Match deleted our match!`);
                            console.warn(unupdatedMatchesList[i]);
                        }

                        unupdatedMatch.addDataToDataFields([
                            {
                                label: 'Blocked-or-removed',
                                value: true
                            },
                            {
                                label: 'Date-of-unmatch',
                                value: unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Date-of-unmatch')].getValue() ? unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Date-of-unmatch')].getValue() : (matchDetails.last_activity_date ? matchDetails.last_activity_date : new Date().toISOString())
                            },
                            {
                                label: 'Seemingly-deleted-profile',
                                value: false
                            }
                        ]);

                        unupdatedMatch.setUpdateMessages(false);
                    }

                    actualRequestsFired = actualRequestsFired + 1;
                    if (presumedRequestsFired === actualRequestsFired) {
                        resolve();
                    }
                }).catch(() => {
                    const indexDataFieldName: number = unupdatedMatch.getIndexOfDataFieldByTitle('Name');
                    console.log(`Failed to get matchDetails for profile with name: ${unupdatedMatch.usedDataFields[indexDataFieldName].getValue()}. Please check if request adress is still correct.`);
                });

            }
        });
    }

    private getAmountOfPictures(personDetails: Match["person"] | MatchDetailsAPI["results"]): number | null {
        let amountOfPictures: null | number = null;

        try {
            amountOfPictures = personDetails.photos.length;
        } catch (err) {
            console.log(`Attempted to get amount of pictures for profile: ${personDetails.name} with id: ${personDetails._id} but failed due to error: ${err}`);
        }
        return amountOfPictures;
    }

    public disconnectAllUIWatchers(): boolean {
        this.uiRenderer.removeAllUIHelpers();

        let disconnectedWatchersAmount = 0;
        this.watchersUIList.forEach((watcher: MutationObserver) => {
            watcher.disconnect();
            disconnectedWatchersAmount = disconnectedWatchersAmount + 1;
            console.log('UI Watcher disconnected');
        });
        if (this.watchersUIList.length === disconnectedWatchersAmount) {
            this.watchersUIList.length = 0;
        }
        return this.watchersUIList.length === 0 ? true : false;
    }

    public getReminders(reminderHttpList: ReminderHttp[]): void {
        //todo: show overlay
        Overlay.setLoadingOverlay('reminderOverlay', true);
        this.requestHandler.postReminderList(reminderHttpList, (currentIndex: number, totalLength: number, statusText: string) => {
            console.log(`${currentIndex}, / ${totalLength} - ${statusText}`);
            Overlay.setLoadingOverlayProgress('reminderOverlay', currentIndex, totalLength, statusText);
        }).then((reminderHttpList) => {
            console.dir(reminderHttpList);
            // eslint-disable-next-line no-debugger
            // debugger;
            //todo: hide overlay
            Overlay.setLoadingOverlay('reminderOverlay', false);
        });
    }

    private _postMessageBackgroundScript(actionName: PortAction): void {
        const portMessage: PortMessage = {
            messageSender: 'CONTENT',
            action: actionName,
            payload: ""
        };
        this.dataPort?.postMessage(portMessage);
    }
}
