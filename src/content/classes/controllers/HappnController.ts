import { datingAppController } from "src/content/interfaces/controllers/datingAppController.interface";
import { ParsedResultMatch } from "src/content/interfaces/controllers/ParsedResultMatch.interface";
import { TinderMessage, ParsedResultMessages } from "src/content/interfaces/http-requests/MessagesListTinder.interface";
import { Badges, Match, MatchApi, MatchListTinderAPI } from "src/content/interfaces/http-requests/MatchesListTinder.interface";
import { DataTable } from '../data/dataTable';
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataRecord } from "../data/dataRecord";
import { SubmitType } from "../../../SubmitType";
import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";
import { DateHelper, DateHelperTimeStamp } from "../util/dateHelper";
import { GhostStatus } from "../data/dataItems/dataItemGhost";
import { ScreenNavStateCombo } from "../tinder/screenStateCombo.enum";
import { UIFieldsRenderer } from "./UIFieldsRenderer";
import { RequestHandlerTinder } from "../http-requests/requestHandlerTinder";
import { Person } from "../tinder/Person";
import { dataStorage } from '../data/dataStorage';
import { DataField, DataFieldDistances, DataFieldMessages, UIRequired } from "../data/dataField";
import { PersonAction } from "../../../peronAction.enum"; // todo: had to move this to top level AND make a relative path.. but since ALL components (content, background, popup) share the same interfaces/enums etc. why not move everything to top lvl for importing? ALSO; why did an error occur when i tried to relative import this?
import { SubmitAction } from "src/background/SubmitAction.interface";
import { DOMHelper } from "../util/DOMHelper";
import { Message, MessageAuthorEnum } from "../../../message.interface";
import { MatchDetailsAPI } from "src/content/interfaces/http-requests/MatchDetailsAPI.interface";
import { ghostMoment } from "src/content/interfaces/data/ghostMoment.interface";
import { reminderAmountItem } from "src/content/interfaces/data/reminderAmountItem.interface";
import { Reminder } from "../util/NeedsReminder";
import { ReminderHttp } from "../data/ReminderHttp";
import { RequestHandlerHappn } from "../http-requests/requestHandlerHappn";
import { HappnConversation } from "src/content/interfaces/http-requests/MatchesListHappn.interface";
import { MatchProfileDetailsHappn } from "src/content/interfaces/http-requests/MatchProfileDetailsHappn.interface";
import { MessagesHappn } from "src/content/interfaces/http-requests/MessagesHappn.interface";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { CategoryStatus } from "../util/ConsoleColorLog/CategoryStatus";
import { LogColors } from "../util/ConsoleColorLog/LogColors";
import { HappnMatchesAndMessagesController } from "./HappnMatchesAndMessagesController";

export class HappnController implements datingAppController {
    private nameController = 'happn';
    private dataRetrievalMethod: 'api' | 'dom' | null = null;
    private uiRenderer: UIFieldsRenderer = new UIFieldsRenderer();

    private happnAccessToken = '';
    private requestHandler!: RequestHandlerHappn; // 'definite assignment assertion proerty (!) added here, is this a good practice?'
    private dataTable: DataTable;
    private dataStorage: dataStorage;

    private currentScreenTimeoutId: number | null = null;
    // private currentScreen: ScreenNavStateCombo = this.getCurrentScreenByDOM();
    private currentMatchIdByUrlChat: string | null = null;

    private amountOfUnmessagedMatches = 0;
    private matchesListTimeoutId: number | null = null;

    private dataTableNeedsToBeUpdated = false;

    private watchersUIList: MutationObserver[] = [];

    private happnMatchesAndMessagesController: HappnMatchesAndMessagesController | null = null;

    constructor(dataRetrievalMethod: 'api' | 'dom' | null, dataTable: DataTable, dataStorage: dataStorage) {

        this.dataRetrievalMethod = dataRetrievalMethod;
        this.dataTable = dataTable;
        this.dataStorage = dataStorage;

        if (this.dataRetrievalMethod === 'api' || this.dataRetrievalMethod === 'dom') {
            if (this.dataRetrievalMethod === 'api') {
                //todo: update this to actually get the getCredentials, put in a constant, and check if the constant is filled with a correct string value
                const hasCredentials = this.setCredentials();
                if (hasCredentials) {

                    this.requestHandler = new RequestHandlerHappn(this.happnAccessToken);
                    // debugger;
                    this.happnMatchesAndMessagesController = new HappnMatchesAndMessagesController(this.requestHandler, this.dataTable, this.nameController);

                    this.uiRenderer.setLoadingOverlay('initApp', true);
                    this.happnMatchesAndMessagesController.refreshDataTableMatchesAndMatchMessages().then(() => {

                        // ConsoleColorLog.startCategorizedLogs(CategoryStatus.START, LogColors.BLUE);
                        // ConsoleColorLog.singleLog(`my first test message`, true);
                        // ConsoleColorLog.singleLog(`my second test message`, false);
                        // ConsoleColorLog.singleLog(`my third test message`, 'testmessage');
                        // ConsoleColorLog.startCategorizedLogs(CategoryStatus.END, LogColors.BLUE);

                        console.log(`RefreshDataTableMatchesAndMatchMessages .then START`);
                        //todo: 4 Inplement add tinder UI support overlay (e.g. add icon/color to match who hasn't replied in a week)
                        // this.setSwipeHelperOnScreen();

                    }).catch((error) => {
                        console.dir(error);
                        console.error(`Something went wrong`);
                    }).finally(() => {
                        this.uiRenderer.setLoadingOverlay('initApp', false);
                        // this.setScreenWatcher();
                        // this.setMessageListWatcherOnScreen();
                        // this.setMatchesListWatcher();
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

    // private setScreenWatcher() {

    //     // main & aside container (with this class) is always present as far as i know, so should always work.
    //     const swipeOrChatContainerIdentifier = '.App__body > .desktop > main.BdStart';

    //     const $SOCcontainer = $('body').find(swipeOrChatContainerIdentifier).first()[0];

    //     if (!$SOCcontainer) {
    //         console.error(`Element with identifier not found: ${swipeOrChatContainerIdentifier}. Please update identifiers.`);
    //         return;
    //     }

    //     // Only need to observe the swipe-or-chat container. The matches & messageList container are always present (though not visible) anyway!
    //     // Thus I can always apply DOM manipulations on them when needed!
    //     const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {

    //         if (this.currentScreenTimeoutId !== null) {
    //             // if timeout below is already set once, prevent it from setting it again untill it finishes to save resources
    //             return;
    //         }

    //         if (this.currentScreen === ScreenNavStateCombo.Chat) {
    //             const newMatchIdFromUrl = this.getMatchIdFromMessageHrefSDtring(window.location.href);
    //             if (this.currentMatchIdByUrlChat === null || this.currentMatchIdByUrlChat !== newMatchIdFromUrl) {
    //                 console.log(`%c Switched CHAT from match with id ${this.currentMatchIdByUrlChat} to match with id: ${newMatchIdFromUrl}`, "color: green");
    //                 this.currentMatchIdByUrlChat = newMatchIdFromUrl;
    //             } else {
    //                 return;
    //             }
    //         } else if (this.currentScreen === this.getCurrentScreenByDOM()) {
    //             return;
    //         }

    //         this.uiRenderer.setLoadingOverlay('switchScreen', true);

    //         this.uiRenderer.removeAllUIHelpers();

    //         this.currentScreenTimeoutId = setTimeout(() => {
    //             this.currentScreen = this.getCurrentScreenByDOM();
    //             console.log(`Current screen: ${this.currentScreen}`);

    //             this.currentScreenTimeoutId = null;

    //             console.log(`execute add UI helpers for screen: ${this.currentScreen}`);

    //             if (this.dataTableNeedsToBeUpdated) {
    //                 this.refreshDataTableMatchesAndMatchMessages(this.requestHandler).then(() => {
    //                     this.setRefreshDataTable(false);
    //                     this.setSwipeHelperOnScreen();
    //                 }).finally(() => {
    //                     this.uiRenderer.setLoadingOverlay('switchScreen', false);
    //                 });
    //             } else {
    //                 this.addUIHelpers(this.currentScreen);
    //                 this.uiRenderer.setLoadingOverlay('switchScreen', false);
    //             }

    //         }, 500);
    //     });
    //     mutationObv.observe($SOCcontainer, {
    //         childList: true, // observe direct children
    //         subtree: true, // lower descendants too
    //         characterDataOldValue: true, // pass old data to callback
    //     });

    //     this.watchersUIList.push(mutationObv);
    // }

    // private setMessageListWatcherOnScreen() {

    //     const messageListIdentifier = '.messageList';
    //     const $MessageListContainer = $('body').find(messageListIdentifier).first()[0];

    //     if (!$MessageListContainer) {
    //         console.error(`Element with identifier not found: ${messageListIdentifier}. Please update identifiers.`);
    //         return;
    //     }

    //     const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {

    //         // ensures that only descandt nodes of the (div) node with class 'messageList' will be passed
    //         const mutationsOnMessageItem = mutations.filter((mutation) => {
    //             const mutatedElement = mutation.target as HTMLElement;
    //             if (mutatedElement.nodeName === "DIV") {
    //                 if (!mutatedElement.classList.contains('messageList')) {
    //                     return mutatedElement;
    //                 }
    //             } else {
    //                 return mutatedElement;
    //             }
    //         });
    //         if (mutationsOnMessageItem.length === 0) {
    //             return;
    //         }

    //         // check if mutation are from receiving a new message, if so update the dataRecord to set 'needsTobeUpdated' to true
    //         const matchId: string | null = this.getMatchIdFromMutations(mutationsOnMessageItem);

    //         //Known flase positives (but does not matter, since all it does will be refetching the messages anyway);
    //         // 'bug 1'; profile Aniek last message was a ANIMATED GIF sent to her.. this shows up as a hyperlink in the messages.. thus the last message ('You sent a GIF..') does INDEED NOT EQUAL the last message known by the dataRecord (the hyperlink to the gif)
    //         if (matchId !== null) {
    //             const dataRecord = this.dataTable.getRecordByRecordIndex(this.dataTable.getRecordIndexBySystemId(matchId, 'tinder'));

    //             if (dataRecord === null) {
    //                 console.error(`Observed last message from unknown match. Please check match in mutations: ${mutationsOnMessageItem} and check the datatable manually`);
    //                 return;
    //             }

    //             if (this.hasReceivedNewMessagesFromMatch(mutationsOnMessageItem, dataRecord)) {
    //                 // eslint-disable-next-line no-debugger
    //                 // debugger;
    //                 dataRecord.setUpdateMessages(true);
    //                 this.setRefreshDataTable(true);
    //                 console.log(`%c ${console.count()} (2)I just set profile: ${dataRecord.usedDataFields[5].getValue()} with id: ${matchId} with recordIndex: ${this.dataTable.getRecordIndexBySystemId(matchId, 'tinder')} to true.. for this person sent me a new message thus my messages list for her should be reviewed`, "color: orange");
    //                 return;
    //             }
    //         }
    //         // if not, then mutations are from switching match conversation
    //     });

    //     mutationObv.observe($MessageListContainer, {
    //         childList: true, // observe direct children
    //         subtree: true, // lower descendants too
    //         characterDataOldValue: false, // pass old data to callback
    //     });

    //     this.watchersUIList.push(mutationObv);
    // }

    // private setMatchesListWatcher(): void {
    //     const matchesListIdentifier = 'a.matchListItem';
    //     const matchesListElement: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector(matchesListIdentifier);
    //     let matchesListContainer: null | HTMLElement = null;

    //     if (matchesListElement !== null) {
    //         matchesListContainer = $(matchesListElement).parents('[role="tabpanel"]').first()[0] ? $(matchesListElement).parents('[role="tabpanel"]').first()[0] : null;
    //         if (matchesListContainer !== null) {
    //             this.amountOfUnmessagedMatches = this.getUnmessagedMatchesAmount(matchesListContainer);

    //             const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {
    //                 if (matchesListContainer !== null) {
    //                     const currentUnmessagedMatchesAmount: number = this.getUnmessagedMatchesAmount(matchesListContainer);
    //                     console.log(`Did the UI get updated so I can NOW get the number of unmessaged matches after one or more has been added/deleted?`);
    //                     console.log(`Old number: ${this.amountOfUnmessagedMatches}, current/new number: ${currentUnmessagedMatchesAmount}`);

    //                     if (this.amountOfUnmessagedMatches !== currentUnmessagedMatchesAmount) {
    //                         this.amountOfUnmessagedMatches = currentUnmessagedMatchesAmount;

    //                         this.setRefreshDataTable(true);
    //                     }
    //                 } else {
    //                     console.error(`Could not find matchesListContainer. Please update the identifier.`);
    //                     return;
    //                 }

    //             });

    //             mutationObv.observe(matchesListContainer, {
    //                 childList: true, // observe direct children
    //                 subtree: true, // lower descendants too
    //                 characterDataOldValue: false, // pass old data to callback
    //             });

    //             this.watchersUIList.push(mutationObv);

    //         } else {
    //             console.error(`Could not find matchesListContainer. Please update the identifier.`);
    //             return;
    //         }
    //     } else {
    //         console.error(`Could not find matchesListElement. Please update the identifier.`);
    //         return;
    //     }
    // }
    // private setRefreshDataTable(shouldDataTableBeRefreshed: boolean) {
    //     this.dataTableNeedsToBeUpdated = shouldDataTableBeRefreshed;
    // }

    // private getUnmessagedMatchesAmount(matchesListContainerElement: HTMLElement): number {
    //     const matchListItemsAmount = $(matchesListContainerElement).find('a.matchListItem').length;

    //     // I assume the 'likes you' and 'sent-likes' will always be present, thus accounting for at least 2 elements with class matchListItem
    //     if (matchListItemsAmount >= 1) {
    //         return matchListItemsAmount;
    //     } else {
    //         console.error(`Unable to find matchListItems. Please update selectors.`);
    //         return 0;
    //     }
    // }

    // private getLatestMessageFromMutations(mutations: MutationRecord[]): string | null {
    //     let latestMessageFromUI: string | null = null;

    //     mutations.forEach((mutation) => {
    //         if (mutation.target) {
    //             const element$: JQuery<Node> = $(mutation.target).hasClass('messageListItem') ? $(mutation.target).first() : $(mutation.target).parents('.messageListItem').first();
    //             if (element$.length > 0) {
    //                 latestMessageFromUI = element$.find('.messageListItem__message').text();
    //             } else {
    //                 console.error(`Jquery node not found with class "messageListItem__message"`);
    //                 return null;
    //             }
    //         }
    //     });
    //     return latestMessageFromUI;
    // }

    // private getMatchIdFromMutations(mutations: MutationRecord[]): string | null {
    //     let matchId: string | null = null;

    //     mutations.forEach((mutation) => {
    //         if ($(mutation.target).hasClass('messageList')) {
    //             return;
    //         }

    //         const element$: JQuery<Node> = $(mutation.target).hasClass('messageListItem') ? $(mutation.target).first() : $(mutation.target).parents('.messageListItem').first();

    //         if (element$.length > 0) {
    //             matchId = this.getMatchIdFromMessageListItem(element$[0] as HTMLElement);
    //         } else {
    //             console.error(`Jquery node not found with class "messageListItem__message"`);
    //             return null;
    //         }

    //     });

    //     return matchId;
    // }

    // private hasReceivedNewMessagesFromMatch(mutations: MutationRecord[], dataRecord: DataRecord): boolean {
    //     const latestMessageFromUI: string | null = this.getLatestMessageFromMutations(mutations);
    //     let latestMessageFromMatchInDataTable: string | null | undefined;
    //     if (dataRecord.hasMessages()) {
    //         latestMessageFromMatchInDataTable = dataRecord.getLatestMessage() ? dataRecord.getLatestMessage()?.message : null;
    //     } else {
    //         latestMessageFromMatchInDataTable = "";
    //     }

    //     if (!latestMessageFromUI) {
    //         console.error(`Unable to get new message from match. The value for from the UI is: "${latestMessageFromUI}". Please update the selectors.`);
    //         return false;
    //     }

    //     if (latestMessageFromUI !== latestMessageFromMatchInDataTable) {
    //         return true;
    //     } else {
    //         return false;
    //     }

    // }

    // private getMatchIdFromMessageListItem(latestMessageElement: HTMLElement): string | null {

    //     if (!$(latestMessageElement).hasClass('messageListItem')) {
    //         console.error(`latestMessageElement received is  not a messageListItem element. Please update the selectors.`);
    //         return null;
    //     }

    //     const matchIdHref: string | undefined = $(latestMessageElement).attr('href');
    //     let matchId: string;

    //     if (matchIdHref && matchIdHref.length > 0) {
    //         matchId = matchIdHref.substring(matchIdHref.lastIndexOf('/') + 1);
    //         if (matchId && matchId.length > 0) {
    //             return matchId;
    //         }
    //     }
    //     console.error(`Unable to get match id from message list item. Please update the DOM selectors.`);
    //     return null;
    // }

    // public setSwipeHelperOnScreen(): void {
    //     this.currentScreen = this.getCurrentScreenByDOM();
    //     this.addUIHelpers(this.currentScreen);
    // }

    // public addUIHelpers(currentScreen: ScreenNavStateCombo, forceRefresh?: boolean): void {
    //     if (currentScreen === ScreenNavStateCombo.Chat) {

    //         if (forceRefresh) {
    //             this.uiRenderer.removeAllUIHelpers();
    //         }

    //         // 1. get current messageListItemPerson
    //         const currentMatchid: string = this.getCurrentMatchIdFromChatScreen();
    //         let dataRecord: DataRecord | null = null;
    //         let dataFields: DataField[] | undefined | null = undefined;

    //         // 2. get record in table for this person
    //         if (currentMatchid.length > 0) {
    //             const recordIndexId = this.dataTable.getRecordIndexBySystemId(currentMatchid, 'tinder');
    //             if (recordIndexId !== -1) {
    //                 // todo: so i need to get the data first BEFORE i update the record? or just change this entirely?
    //                 // todo: why do i need to include undefined here while at no point in the assignment of this variabele does it ever get undefined assigned to it?
    //                 dataRecord = this.dataTable.getRecordByRecordIndex(recordIndexId);
    //                 if (dataRecord !== null) {
    //                     dataFields = dataRecord.getDataRecordDataFields();

    //                     // 3. show helpers for chat (all?), make space above messagebox, put helper container there?
    //                     this.uiRenderer.renderFieldsContainerForScreen(currentScreen, () => {
    //                         // $('div[id*="SC.chat"]').first().css('width', '730px');
    //                         const chatContainerDOM: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector('div[id*="SC.chat"]');
    //                         if (chatContainerDOM !== null) {
    //                             $(chatContainerDOM).css('padding-right', '315px');
    //                         } else {
    //                             console.error(`Cannot find chat container DOM element. Please update the selectors.`);
    //                             return;
    //                         }

    //                     });
    //                     let uiRequiredDataFields: DataField[] = [];

    //                     if (dataFields && dataFields.length > 0) {
    //                         uiRequiredDataFields = dataRecord.getDataFields(false, true, UIRequired.CHAT_ONLY);

    //                         // 4. on send/receive message.. add message to/update dataRecord? (check; messageListObserver)
    //                         // 5. on switch person in messagelist; switch settings of the above? (check screenWatcher (Observer))
    //                         this.uiRenderer.renderFieldsFromDataFields(uiRequiredDataFields,
    //                             (value: DataRecordValues) => {
    //                                 console.log(`Updated value to existing data record; label: ${value.label}, value: ${value.value}`);
    //                                 const updatedValuesForDataFields: DataRecordValues[] = [value];

    //                                 if(value.label === "Acquired-number" && value.value){
    //                                     updatedValuesForDataFields.push({
    //                                         label: 'Date-of-acquired-number',
    //                                         value: new Date().toISOString()
    //                                     });
    //                                 }else if(value.label === "Acquired-number" && !value.value){
    //                                     updatedValuesForDataFields.push({
    //                                         label: 'Date-of-acquired-number',
    //                                         value: null
    //                                     });
    //                                 }

    //                                 dataRecord?.addDataToDataFields(updatedValuesForDataFields);
    //                                 console.log(`Updated dataRecord: `);
    //                                 console.dir(dataRecord);
    //                             }, (submitType: SubmitType) => {
    //                                 dataRecord?.setUpdateMessages(true);
    //                             });
    //                     }

    //                     const indexDataFieldDistance = dataRecord.getIndexOfDataFieldByTitle('Distance-in-km');
    //                     if (indexDataFieldDistance !== -1) {

    //                         const distanceDataField = dataRecord.usedDataFields[indexDataFieldDistance] as DataFieldDistances;
    //                         const hasRecentDistanceEntry = distanceDataField.containsRecordWithinHours(12);
    //                         const personId = dataRecord.getRecordPersonSystemId(this.nameController, true);

    //                         if (hasRecentDistanceEntry === false && personId && personId.length > 0) {
    //                             this.requestHandler.getProfileDetailsStart(personId).then((matchDetails: MatchDetailsAPI) => {

    //                                 const dataForDataFields: DataRecordValues[] = [
    //                                     {
    //                                         label: 'Name',
    //                                         // value: matchDetails?.results?.name ? matchDetails.results.name : 'Unknown name'
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Name')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Name')].getValue() : (matchDetails?.results?.name ? matchDetails.results.name : 'Unknown name')
    //                                     },
    //                                     {
    //                                         label: 'Age',
    //                                         // value: matchDetails?.results?.birth_date ? DateHelper.getAgeFromBirthDate(matchDetails.results.birth_date) : NaN
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Age')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Age')].getValue() : (matchDetails?.results?.birth_date ? DateHelper.getAgeFromBirthDate(matchDetails.results.birth_date) : NaN)
    //                                     },
    //                                     {
    //                                         label: 'City',
    //                                         // value: matchDetails?.results?.city?.name.length > 0 ? matchDetails.results.city.name : ''
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('City')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('City')].getValue() : (matchDetails?.results?.city?.name.length > 0 ? matchDetails.results.city.name : '')
    //                                     },
    //                                     {
    //                                         label: 'Job',
    //                                         // value: matchDetails?.results?.jobs?.at(0)?.title?.name ? matchDetails?.results.jobs.at(0)?.title.name : ''
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Job')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Job')].getValue() : (matchDetails?.results?.jobs?.at(0)?.title?.name ? matchDetails?.results.jobs.at(0)?.title?.name : '')

    //                                     },
    //                                     {
    //                                         label: 'School',
    //                                         // value: matchDetails?.results?.schools?.at(0)?.name ? matchDetails?.results.schools.at(0)?.name : ''
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('School')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('School')].getValue() : (matchDetails?.results?.schools?.at(0)?.name ? matchDetails?.results.schools.at(0)?.name : '')
    //                                     },
    //                                     {
    //                                         label: 'Gender',
    //                                         // value: matchDetails?.results?.gender ? this._getGender(matchDetails?.results?.gender) : ''
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Gender')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Gender')].getValue() : (matchDetails?.results?.gender ? this._getGender(matchDetails?.results?.gender) : '')

    //                                     },
    //                                     {
    //                                         label: 'Interests',
    //                                         // value: matchDetails?.results?.user_interests?.selected_interests?.length > 0 ? this._getInterests(matchDetails?.results?.user_interests?.selected_interests) : []
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Interests')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Interests')].getValue() : (matchDetails?.results?.user_interests?.selected_interests?.length > 0 ? this._getInterests(matchDetails?.results?.user_interests?.selected_interests) : [])
    //                                     },
    //                                     {
    //                                         label: 'Has-profiletext',
    //                                         // value: matchDetails?.results?.bio.length > 0 ? true : false
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Has-profiletext')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Has-profiletext')].getValue() : (matchDetails?.results?.bio.length > 0 ? true : false)
    //                                     },
    //                                     {
    //                                         label: 'Is-verified',
    //                                         // value: matchDetails?.results?.badges.length > 0 ? this._isVerifiedMatch(matchDetails?.results?.badges) : false
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Is-verified')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Is-verified')].getValue() : (matchDetails?.results?.badges.length > 0 ? this._isVerifiedMatch(matchDetails?.results?.badges) : false)

    //                                     },
    //                                     {
    //                                         label: 'Distance-in-km',
    //                                         value: [{
    //                                             dateTime: new Date().toISOString(),
    //                                             distanceInKM: this._convertDistanceMilesToKM(matchDetails?.results?.distance_mi)
    //                                         }]
    //                                     },
    //                                     {
    //                                         label: 'Amount-of-pictures',
    //                                         value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Amount-of-pictures')].getValue() ? dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Amount-of-pictures')].getValue() : this.getAmountOfPictures(matchDetails.results)
    //                                     },
    //                                 ];

    //                                 dataRecord?.addDataToDataFields(dataForDataFields);

    //                             });
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 //todo: needs inplementation on what to do if recordid is not found? This should not happen tho.. wait.. yes it should! What if i get a new match after i imported everything and started chatting with match!?
    //                 console.error('Current match id not found');
    //                 // 2.a if chat new person (recognize chat new person or not) (and record does not exist yet); add new record?
    //                 //todo: nice-to-have; prompt user to add this unknown person or not?
    //                 // dataRecord = new DataRecord();
    //                 // dataRecord.addDataToDataFields([{ label: "System-no", value: currentMatchid}]);

    //                 //todo: gather person data by ui (but this time; via chat interface!) OR; get data by api?
    //             }

    //         } else {
    //             console.error('Invalid matchId.');
    //         }


    //     }

    //     if (currentScreen === ScreenNavStateCombo.Swipe) {

    //         if (forceRefresh) {
    //             this.uiRenderer.removeAllUIHelpers();
    //         }

    //         const newDataRecord: DataRecord = new DataRecord();

    //         this.uiRenderer.renderFieldsContainerForScreen(currentScreen, ()=>{

    //             const swipeContainerDOM: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector('.recsCardboard__cards');
    //             if (swipeContainerDOM !== null) {
    //                 $(swipeContainerDOM).css('position', 'absolute');
    //                 $(swipeContainerDOM).css('left', '-200px');
    //             } else {
    //                 console.error(`Cannot find swipe container DOM element. Please update the selectors.`);
    //                 return;
    //             }
    //         });

    //         const uiRequiredDataFields: DataField[] = newDataRecord.getDataFields(false, true, UIRequired.SELECT_ONLY);

    //         newDataRecord.addDataToDataFields([
    //             // set initial value to later be adjusted by ui control
    //             {
    //                 label: 'Has-usefull-profiletext',
    //                 value: false
    //             },
    //             {
    //                 label: 'Attractiveness-score',
    //                 value: 6
    //             },
    //             {
    //                 label: 'Seems-fake',
    //                 value: false
    //             },
    //             {
    //                 label: 'Seems-empty',
    //                 value: false
    //             },
    //             {
    //                 label: 'Seems-obese',
    //                 value: false
    //             },
    //             {
    //                 label: 'Seems-toppick',
    //                 value: false
    //             },
    //             {
    //                 label: 'Last-updated',
    //                 value: new Date().toISOString()
    //             },
    //             {
    //                 label: 'Is-match',
    //                 value: false
    //             },
    //             {
    //                 label: 'Date-liked-or-passed',
    //                 value: new Date().toISOString()
    //             },
    //         ]);

    //         // todo: WHY NOT DIRECTLY GET/USE DATA FIELDS? WHY GET DATAFIELDTYPES AT ALL? cuz i might also need required property in the future, i need a default value (which i'm going to set on data field), i DO need a already set property for use when chatting etc..
    //         this.uiRenderer.renderFieldsFromDataFields(uiRequiredDataFields, (value: DataRecordValues) => {
    //             console.log(`Added value to new data record; label: ${value.label}, value: ${value.value}`);
    //             newDataRecord.addDataToDataFields([value]);
    //             console.log(`Updated dataRecord: `);
    //             console.dir(newDataRecord);

    //         }, (submitType: SubmitType) => {
    //             console.log('Callback received a submit type! But it will only be used if no response from background can be retrieved');
    //             this.uiRenderer.setLoadingOverlay('loadingSwipeAction', true);
    //             console.log(submitType);

    //             console.log(this.dataStorage);
    //             console.assert(this.dataStorage.popLastActionFromDataStore() === undefined);

    //             //todo: refactor all code below to use a promise, in which a set interval checks every 100ms orso if a dataStorage item is available then executes code as normal to a max of 60 sec
    //             // OR even better; once submittype has been pressed, do nothing here, copy the code below to the backgroundscriptlistener? (let THAT code check if we are on swiping page, what is filled into the datafields etc.)
    //             // OR EVEN BETTER YET; this code (except for when the timeout begins should always run first, sooner than my backgroundscript can receive a response..), so; create a new promise, add it to the dataStore, let the eventlistener from backgroundscript trigger the resolve, if no response comes make my script below (with timeout) trigger the reject after 1 min orso

    //             // get (request) personid from backgroundscript (get response), after 1 sec
    //             const ms = 1000;
    //             setTimeout(() => {
    //                 console.log('this is what is found in dataStore after 1 sec: ');
    //                 console.log(this.dataStorage);
    //                 const submitAction: SubmitAction | undefined = this.dataStorage.popLastActionFromDataStore();
    //                 console.log(submitAction);

    //                 let typeOfLikeOrPass = '';
    //                 if (submitAction !== undefined) {
    //                     let personActionStatus: boolean | undefined = undefined;
    //                     if (submitAction.submitType === PersonAction.LIKED_PERSON) {
    //                         personActionStatus = true;
    //                         typeOfLikeOrPass = 'like';
    //                     }
    //                     if (submitAction.submitType === PersonAction.SUPER_LIKED_PERSON) {
    //                         personActionStatus = true;
    //                         typeOfLikeOrPass = 'superlike';
    //                     }
    //                     if (submitAction.submitType === PersonAction.PASSED_PERSON) {
    //                         personActionStatus = false;
    //                         typeOfLikeOrPass = 'pass';
    //                     }

    //                     if (personActionStatus === undefined) {
    //                         return;
    //                     }

    //                     const dataForDataFields: DataRecordValues[] = [
    //                         {
    //                             label: 'System-no',
    //                             value: {
    //                                 appType: 'tinder',
    //                                 tempId: submitAction.personId
    //                             }
    //                         },
    //                         {
    //                             label: 'Did-i-like',
    //                             value: personActionStatus
    //                         },
    //                         {
    //                             label: 'Type-of-match-or-like',
    //                             value: [typeOfLikeOrPass]
    //                         },
    //                     ];
    //                     newDataRecord.addDataToDataFields(dataForDataFields);

    //                     this.requestHandler.getProfileDetailsStart(submitAction.personId).then((matchDetails: MatchDetailsAPI) => {
    //                         //todo: Build in; valid from guard. I must check a box in order to proceed to 'like' or 'pass' a person to prevent accidental skipping a field

    //                         const dataForDataFields: DataRecordValues[] = [
    //                             {
    //                                 label: 'Name',
    //                                 value: matchDetails?.results?.name ? matchDetails.results.name : 'Unknown name'
    //                             },
    //                             {
    //                                 label: 'Age',
    //                                 value: matchDetails?.results?.birth_date ? DateHelper.getAgeFromBirthDate(matchDetails.results.birth_date) : NaN
    //                             },
    //                             {
    //                                 label: 'City',
    //                                 value: matchDetails?.results?.city?.name.length > 0 ? matchDetails.results.city.name : ''
    //                             },
    //                             {
    //                                 label: 'Job',
    //                                 value: matchDetails?.results?.jobs?.at(0)?.title?.name ? matchDetails?.results.jobs.at(0)?.title.name : ''
    //                             },
    //                             {
    //                                 label: 'School',
    //                                 value: matchDetails?.results?.schools?.at(0)?.name ? matchDetails?.results.schools.at(0)?.name : ''
    //                             },
    //                             {
    //                                 label: 'Gender',
    //                                 value: matchDetails?.results?.gender ? this._getGender(matchDetails?.results?.gender) : ''
    //                             },
    //                             {
    //                                 label: 'Interests',
    //                                 value: matchDetails?.results?.user_interests?.selected_interests?.length > 0 ? this._getInterests(matchDetails?.results?.user_interests?.selected_interests) : []
    //                             },
    //                             {
    //                                 label: 'Has-profiletext',
    //                                 value: matchDetails?.results?.bio.length > 0 ? true : false
    //                             },
    //                             {
    //                                 label: 'Is-verified',
    //                                 value: matchDetails?.results?.badges.length > 0 ? this._isVerifiedMatch(matchDetails?.results?.badges) : false
    //                             }
    //                         ];

    //                         if (matchDetails?.results?.distance_mi) {
    //                             dataForDataFields.push({
    //                                 label: 'Distance-in-km',
    //                                 value: [{
    //                                     dateTime: new Date().toISOString(),
    //                                     distanceInKM: this._convertDistanceMilesToKM(matchDetails?.results?.distance_mi)
    //                                 }]
    //                             });
    //                         }

    //                         newDataRecord.addDataToDataFields(dataForDataFields);


    //                         //TODO:
    //                         // 1. V Test when swiping and CAN retrieve all data if this still works
    //                         // 2. V Test when swiping and CANNOT reach getProfileDetails endpoint if this still works
    //                         // 3. V Test when swiping and CANNOT reach getProfileDetails endpoint NOR dataStorage has been set if this still works

    //                         // BONUS: Add updated dataRecords to localStorage? or even simply use the FileSystemApi (the one exclusive to chrome, since my chrome extension is chrome exclusive anwyay..)
    //                         // would be very usefull for temporary storing data if...
    //                             // 1. my browser were to suddenly crash for whatever reason, or my entire computer
    //                             // 2. for whatever reason i need to run (catch train?) thus aborting export for storing data records

    //                         // works =
    //                         // swiped profile is still added to the dataRecords
    //                         // screen is still reset correctly
    //                         // overlay is gone

    //                     }).catch(()=>{
    //                         console.error(`Swiped person received tempId, but could not get details of swiped person! Saving inserted info of record regardless`);
    //                     }).finally(()=>{
    //                         this.dataTable.addNewDataRecord(newDataRecord, this.nameController);
    //                         this.addUIHelpers(currentScreen, true);
    //                         this.uiRenderer.setLoadingOverlay('loadingSwipeAction', false);
    //                     });
    //                 }else{
    //                     newDataRecord.addDataToDataFields([
    //                         // set initial value to later be adjusted by ui control
    //                         {
    //                             label: 'System-no',
    //                             value: {
    //                                 appType: 'tinder',
    //                                 tempId: `idNotRetrievedPleaseCheckBackgroundRequestsBackupsInLocalStorage-${new Date().toISOString()}`
    //                             }
    //                         },
    //                         {
    //                             label: 'Did-i-like',
    //                             value: submitType === 'liked' ? true : false
    //                         },
    //                         {
    //                             label: 'Type-of-match-or-like',
    //                             value: [submitType]
    //                         },
    //                     ]);
    //                     this.dataTable.addNewDataRecord(newDataRecord, this.nameController);
    //                     this.addUIHelpers(currentScreen, true);
    //                     this.uiRenderer.setLoadingOverlay('loadingSwipeAction', false);

    //                     console.error(`Swiped person received no tempId! Saving inserted info of record regardless.. Don't forget to check background local storage requests backup to get the corresponding personid and to overwrite the tempId later!`);
    //                     //todo: Should REALLY throw a important alert to notify myself what I need to pay extra attention!
    //                 }
    //             }, ms);
    //         });

    //         //TODO TODO TODO:
    //         // AM I SURE I DO NOT WANT TO ALWAYS STORE MY (ONLY) NEWLY MADE DATARECORDS IN LOCALSTORAGE JUST TO BE 100% SURE I DON'T LOSE ANY OF MY INSERTED DATA?
    //         // AND TO REMOVE THESE RECORDS FROM LOCALSTORAGE AFTER E.G. 3 DAYS 
    //         // I WOULD ONLY BE STORING DATA RECORDS I JUST MADE AFTER ALL, NOT ALL OF THE DATA OFF COURSE (IN CASE OF ERRORS; BROWSER CRASH, PC CRASH ETC. IT WOULD BE USEFULL)
    //         // I COULD CREATE A SIMILAIR CLASS (OR REFACTOR THE CLASS) AND LOGIC I USE IN BACKGROUND SCRIPT
    //     }

    //     //todo: create view to show gathered info for all dataFields (thus also showing current value of; name, age, hasProfiletext etc.)
    //     //todo: create 're-try retrieve' button; for when the tinder UI finishes loading too late and my app already attempted to gather data
    //     //todo: figure out a solution to auto get 'hasProfileText' for when a profile DOES HAVE profileText but isnt show in the initial view because there is too much other info (location, age, distance, job etc.).. maybe do inplement a previous screen?

    //     //todo: create ability to while swipe/chat see all the values being stored for this record/person

    //     //todo: create checker method which checks if above DOM element ref exists, otherwise throw error
    //     //todo: FUTURE; create checker method which checks if all required DOM elements used here still exist (auto loop through application?)
    //     //todo: add other state (if,.. or seperate method) for adding chat ui helper VS swipe ui helper. Currently working on swipe ui helper

    //     //todo: seperate out logic for everything UI related; create a seperate class which recognizes app state (which screen we are on), removes existing helprs when on switch etc.
    // }

    // public getCurrentMatchIdFromChatScreen(): string {
    //     const matchIdFromUrl: string | null = this.getCurrentMatchIdFromUrl();
    //     if (matchIdFromUrl) {
    //         return matchIdFromUrl;
    //     } else {
    //         console.error(`Message List Item DOM Element not found. Please check & update the selector.`);
    //     }
    //     return '';
    // }

    // private getCurrentMatchIdFromUrl(): string | null {
    //     const indexLastSlash: number = window.location.href.lastIndexOf('/');
    //     if (indexLastSlash >= 0) {
    //         return window.location.href.substring(indexLastSlash + 1);
    //     } else {
    //         console.error(`Url does not seem to contain a slash?`);
    //         return null;
    //     }
    // }

    // private getMatchIdFromMessageHrefSDtring(href: string): string {
    //     return href.substring(href.lastIndexOf('/') + 1);
    // }

    // public getCurrentScreenByDOM(): ScreenNavStateCombo {
    //     const swipeIdentifier = '.recsToolbar';
    //     const chatIdentifier = '.chat';
    //     const chatProfileIdentifier = '.chatProfile';

    //     const backButtonOnMainPanelIdentifier = 'a[href="/app/recs"].focus-button-style';

    //     let currentPage: ScreenNavStateCombo;

    //     switch (true) {
    //         case $(swipeIdentifier).length > 0 && $(backButtonOnMainPanelIdentifier).length === 0 ? true : false:
    //             currentPage = ScreenNavStateCombo.Swipe;
    //             break;
    //         case $(swipeIdentifier).length > 0 && $(backButtonOnMainPanelIdentifier).length > 0 ? true : false:
    //             currentPage = ScreenNavStateCombo.SwipeProfile;
    //             break;
    //         case $(chatIdentifier).length > 0 && $(chatProfileIdentifier).length > 0 ? true : false:
    //             currentPage = ScreenNavStateCombo.Chat;
    //             break;
    //         default:
    //             currentPage = ScreenNavStateCombo.UnknownScreen;
    //             break;
    //     }
    //     console.log(`You are on page: ${currentPage}`);
    //     return currentPage;
    // }

    // public getMatchesAndMatchMessagesByAPI(requestHandler: RequestHandlerTinder, useMock: boolean): Promise<ParsedResultMatch[] | null> {
    //     //todo: make seperate out logic in different methods because whilst 'getData' may be generic, getting it will differ for each supported app.

    //     return new Promise<ParsedResultMatch[]>((resolve, reject) => {

    //         if (useMock) {

    //             console.error(`Mock unavailable, please set a (new) mock first`);

    //             resolve([]);

    //             // const test: ParsedResultMatch[] = <ParsedResultMatch[]><unknown>matchMockTwo;
    //             // console.log(`Mock data (matches & messages):`);
    //             // console.log(matchMockTwo);
    //             // resolve(test);
    //         }

    //         if (requestHandler) {
    //             this.getMatches().then((matchList: ParsedResultMatch[] | null) => {
    //                 async function getMessagesPerMatchesAsynchronously(matchesWithoutMessagesList: ParsedResultMatch[]): Promise<ParsedResultMatch[]> {
    //                     // used a standard for loop to ensure synchronous looping
    //                     for (let i = 0; i < matchesWithoutMessagesList.length; i = i + 1) {
    //                         console.log(`GETTING MESSAGES now for: ${i} - ${matchesWithoutMessagesList[i].match.id}`);
    //                         matchesWithoutMessagesList[i].matchMessages = await requestHandler.getMatchesMessagesStart(matchesWithoutMessagesList[i].match.id);
    //                         return matchesWithoutMessagesList;
    //                     }
    //                     return matchesWithoutMessagesList;
    //                 }

    //                 if (matchList === null) {
    //                     reject(null);
    //                 } else {
    //                     resolve(getMessagesPerMatchesAsynchronously(matchList));
    //                 }

    //             });

    //         } else {
    //             console.error(`The requestHandler was not set`);
    //             return null;
    //         }
    //     });
    // }

    public setCredentials(): boolean {
        const happnAccessToken: string | null = localStorage.getItem('access_token');
        if (happnAccessToken && happnAccessToken.length > 0) {
            this.happnAccessToken = happnAccessToken;
            return true;
        }
        return false;
    }

    // public disconnectAllUIWatchers(): boolean {
    //     this.uiRenderer.removeAllUIHelpers();

    //     let disconnectedWatchersAmount = 0;
    //     this.watchersUIList.forEach((watcher: MutationObserver) => {
    //         watcher.disconnect();
    //         disconnectedWatchersAmount = disconnectedWatchersAmount + 1;
    //         console.log('UI Watcher disconnected');
    //     });
    //     if (this.watchersUIList.length === disconnectedWatchersAmount) {
    //         this.watchersUIList.length = 0;
    //     }
    //     return this.watchersUIList.length === 0 ? true : false;
    // }

    // public getReminders(reminderHttpList: ReminderHttp[]){
    //     //todo: show overlay
    //     this.uiRenderer.setLoadingOverlay('reminderOverlay', true);
    //     this.requestHandler.postReminderList(reminderHttpList, (currentIndex: number, totalLength: number, statusText: string)=>{
    //         console.log(`${currentIndex}, / ${totalLength} - ${statusText}`);
    //         this.uiRenderer.setLoadingOverlayProgress('reminderOverlay', currentIndex, totalLength, statusText);
    //     }).then((reminderHttpList)=>{
    //         console.dir(reminderHttpList);
    //         debugger;
    //         //todo: hide overlay
    //         this.uiRenderer.setLoadingOverlay('reminderOverlay', false);
    //     });
    // }
}
