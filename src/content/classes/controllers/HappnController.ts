import { datingAppController } from "src/content/interfaces/controllers/datingAppController.interface";
import { ParsedResultMatch } from "src/content/interfaces/controllers/ParsedResultMatch.interface";
import { TinderMessage, ParsedResultMessages } from "src/content/interfaces/http-requests/MessagesListTinder.interface";
import { Badges, Match, MatchApi, MatchListTinderAPI } from "src/content/interfaces/http-requests/MatchesListTinder.interface";
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
import { Overlay } from "../serrvices/Overlay";
import { MatchDataParser } from "./MatchDataParserHappn";
import { UIHelpersHappn } from "./UIHelpersHappn";
import { UrlHelper } from "../serrvices/UrlHelper";
import { MessagesWatcherHappn } from "./MessagesWatcher";
import { GenericPersonPropertiesList } from "../util/GenericPersonProperties/GenericPersonPropertiesList";
import { MatchesWatcherHappn } from "./MatchesWatcher";
import { ScreenController } from "../util/Screen/ScreenList";
import { screensHappn } from "../happn/config/Screens";
import { DatingAppType } from "../../../datingAppType.enum";

export class HappnController implements datingAppController {
    // private nameController = 'happn';
    private nameController: DatingAppType = DatingAppType.HAPPN;
    private dataRetrievalMethod: 'api' | 'dom' | null = null;
    private screenList: ScreenController = new ScreenController(screensHappn);
    private uiRenderer: UIFieldsRenderer = new UIFieldsRenderer(this.screenList);
    private uIHelpersHappn: UIHelpersHappn | null = null;
    private messagesWatcher: MessagesWatcherHappn | null = null;
    private matchesWatcher: MatchesWatcherHappn | null = null;

    private happnAccessToken = '';
    private requestHandler!: RequestHandlerHappn; // 'definite assignment assertion proerty (!) added here, is this a good practice?'
    private dataTable: DataTable;
    private dataStorage: DataStorage;
    private dataPort: chrome.runtime.Port | null;

    private currentScreenTimeoutId: number | null = null;
    private currentScreen: ScreenNavStateComboTinder = this.getCurrentScreenByDOM();
    private currentMatchIdByUrlChat: string | null = UrlHelper.getCurrentMatchIdFromUrl();

    private dataTableNeedsToBeUpdated = false;

    private watchersUIList = new GenericPersonPropertiesList();

    private happnMatchesAndMessagesController: HappnMatchesAndMessagesController | null = null;

    constructor(dataRetrievalMethod: 'api' | 'dom' | null, dataTable: DataTable, dataStorage: DataStorage, dataPort: chrome.runtime.Port | null) {

        this.dataRetrievalMethod = dataRetrievalMethod;
        this.dataTable = dataTable;
        this.dataStorage = dataStorage;
        this.dataPort = dataPort;

        if (this.dataRetrievalMethod === 'api' || this.dataRetrievalMethod === 'dom') {
            if (this.dataRetrievalMethod === 'api') {
                const hasCredentials = this.setCredentials();
                if (hasCredentials) {

                    this.requestHandler = new RequestHandlerHappn(this.happnAccessToken);
                    this.happnMatchesAndMessagesController = new HappnMatchesAndMessagesController(this.requestHandler, this.dataTable, this.nameController);
                    this.uIHelpersHappn = new UIHelpersHappn(this.nameController, this.screenList, this.uiRenderer, this.dataTable, this.requestHandler, this.dataStorage, this.dataPort);
                    this.messagesWatcher = new MessagesWatcherHappn(this.nameController, this.dataTable, this.watchersUIList);
                    this.matchesWatcher = new MatchesWatcherHappn(this.nameController, this.dataTable, this.watchersUIList);

                    Overlay.setLoadingOverlay('initApp', true);
                    this.happnMatchesAndMessagesController.refreshDataTableMatchesAndMatchMessages().then(() => {

                        console.log(`RefreshDataTableMatchesAndMatchMessages .then START`);
                        //todo: 4 Inplement add tinder UI support overlay (e.g. add icon/color to match who hasn't replied in a week)
                        this.setSwipeHelperOnScreen();

                    }).catch((error) => {
                        console.dir(error);
                        console.error(`Something went wrong`);
                    }).finally(() => {
                        Overlay.setLoadingOverlay('initApp', false);
                        this.setScreenWatcher('body');

                        this.setMessagesWatcher();

                        this.setMatchesWatcher();
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
    private setMatchesWatcher(): void {
        const matchesContainers = this.getMatchesContainerDOMRef();
        this.matchesWatcher?.cleanData();
        this.matchesWatcher?.setMatchesNumberWatcherOnScreen(
            matchesContainers,
            () => {
                return this.getMatchesAmount(matchesContainers);
            },
            () => {
                this.setRefreshDataTable(true);
        });
    }
    private setMessagesWatcher(): void {
        const messageListContainers = this.getMessageContainerDOMRef();
        this.messagesWatcher?.cleanData();
        this.messagesWatcher?.setMessageListWatcherOnScreen(
            messageListContainers,
            () => {
                return this.getMatchTempIdLatestFromLatestMessage(messageListContainers);
            },
            () => {
                this.setRefreshDataTable(true);
            });
    }

    private getMessageContainerDOMRef(): JQuery<HTMLElement> {
        const messageListContainers: JQuery<HTMLElement> = $('body [data-testid="conversations-pending-button-outer"]').next();
        if (messageListContainers.length === 0) {
            ConsoleColorLog.singleLog(`No element(s) found by HTML path: `, 'body [data-testid="conversations-pending-button-outer"]', LogColors.RED);
        }
        messageListContainers.each((index, element) => {
            if (!element) {
                console.error(`Element with identifier not found: ${element}. Please update identifiers.`);
                return;
            }
        });
        return messageListContainers;
    }

    private getMatchesContainerDOMRef(): JQuery<HTMLElement> {
        const messageListContainers: JQuery<HTMLElement> = $('body [data-testid="conversations-pending-button-outer"]');
        if (messageListContainers.length === 0) {
            ConsoleColorLog.singleLog(`No element(s) found by HTML path: `, 'body [data-testid="conversations-pending-button-outer"]', LogColors.RED);
        }
        messageListContainers.each((index, element) => {
            if (!element) {
                console.error(`Element with identifier not found: ${element}. Please update identifiers.`);
                return;
            }
        });
        return messageListContainers;
    }

    private getMatchTempIdLatestFromLatestMessage(messageListContainers: JQuery<HTMLElement>): {
        tempId: string;
        lastMessage: string;
    }[] {
        const messagesList: { tempId: string, lastMessage: string }[] = [];
        $(messageListContainers).each((index, element) => {
            const messagesPanel = $(element).find('[data-testid="conversation-list-item"]');
            messagesPanel.each((index, elem) => {
                const srcUrl = $(elem).find('[data-testid="conversations-avatar-picture"]').attr('src');
                const srcDisabledMatchUrl = $(elem).find('[data-testid="conversations-avatar-empty"]');

                if (srcDisabledMatchUrl.length > 0) {
                    ConsoleColorLog.singleLog(`A match conversation has been removed, thus unable to get tempId nor dataRecord`, 'Please remove this old deleted match from the list manually', LogColors.RED);
                    return;
                }

                let tempId = '';

                if (srcUrl?.includes('https://images.happn.fr/resizing/')) {
                    const reducedString = srcUrl.replace('https://images.happn.fr/resizing/', '');
                    const firstSlashPos = reducedString.indexOf('/');
                    tempId = reducedString.substring(0, firstSlashPos);
                } else {
                    ConsoleColorLog.singleLog('Warning! Picture url in message does no longer contain a recognized format to safely extract temorary id! Please check the image urls', '', LogColors.YELLOW);
                    return;
                }

                if (tempId.length === 0) {
                    ConsoleColorLog.singleLog(`Error while setting tempId, tempId turned out empty. Please check the code`, false, LogColors.RED);
                    return;
                }

                const lastMessage = $(elem).find('[data-testid="conversation-list-item-preview-text"]').text();
                messagesList.push({ tempId: tempId, lastMessage: lastMessage });
            });
        });
        return messagesList;
    }

    private getMatchesAmount(messageListContainers: JQuery<HTMLElement>): number | null {

        let matchesAmount: number | null = null;

        $(messageListContainers).each((index, element) => {

            const textElement$ = $(element).find('p:contains("Crushes op je")').first();
            if (textElement$.length === 0) {
                ConsoleColorLog.singleLog(`Could not find matches container element. Please update identifier for matchesContainer`, '', LogColors.RED);
                return;
            }

            const textContent = textElement$.text();
            if (!textContent.startsWith("Er wachten ") || !textContent.endsWith(" Crushes op je")) {
                ConsoleColorLog.singleLog(`Text content in matches container does not match expected format. Please update expected format.`, '', LogColors.RED);
                return;
            }

            const matchesNumberAsString = textContent.match(/\d+/)?.[0] ? textContent.match(/\d+/)?.[0] : "";
            if (!matchesNumberAsString || matchesNumberAsString === "") {
                ConsoleColorLog.singleLog(`Could not get matches amount from text. Please update expected format. Text received is: `, matchesNumberAsString, LogColors.RED);
                return;
            } else {
                const matchesNumberAsNumber: number = parseInt(matchesNumberAsString);
                if (matchesNumberAsNumber < 0) {
                    ConsoleColorLog.singleLog(`The amount of matches cannot be less than 0. Something went wrong while parsing from string to int. Parsed text is: `, matchesNumberAsNumber, LogColors.RED);
                    return;
                }

                if (matchesNumberAsNumber >= 90) {
                    ConsoleColorLog.singleLog(`I have gathered 90 or more matches. So far I think I cannot count more than 99+, please send some matches messages or delete some to decrease this number ands thus be able to watch the (new) incoming matches. Matches amount: `, matchesNumberAsNumber, LogColors.YELLOW);
                }

                matchesAmount = matchesNumberAsNumber;
            }
        });

        return matchesAmount;
    }

    private setScreenWatcher(containerDomElement: string) {

        /*
            Sets the currently active screen 
        */

        const $SOCcontainer = $(containerDomElement).first()[0];

        if (!$SOCcontainer) {
            console.error(`Element with identifier not found: ${containerDomElement}. Please update identifiers.`);
            return;
        }

        // Only need to observe the swipe-or-chat container. The matches & messageList container are always present (though not visible) anyway!
        // Thus I can always apply DOM manipulations on them when needed!
        const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {

            if (this.currentScreen === this.getCurrentScreenByDOM()) {
                ConsoleColorLog.singleLog(`Still on the same screen: `, this.currentScreen, LogColors.BLUE);

            }

            this.currentScreen = this.getCurrentScreenByDOM();
            ConsoleColorLog.singleLog(`New screen: `, this.currentScreen, LogColors.BLUE);

            if (this.currentScreenTimeoutId !== null) {
                // if timeout below is already set once, prevent it from setting it again untill it finishes to save resources
                return;
            }

            if(this.isAnyDataRecordProfileOrMessageSetToNeedsUpdate()){
                this.setRefreshDataTable(true);
            }

            if (this.currentScreen === ScreenNavStateComboTinder.Chat) {
                ConsoleColorLog.singleLog(`Switched to screen: `, ScreenNavStateComboTinder.Chat, LogColors.GREEN);
                const newMatchIdFromUrl = UrlHelper.getCurrentMatchIdFromUrl();

                this.setMessagesWatcher();

                this.setMatchesWatcher();

            } else if (this.currentScreen === ScreenNavStateComboTinder.Swipe) {
                ConsoleColorLog.singleLog(`Switched to screen: `, ScreenNavStateComboTinder.Swipe, LogColors.BLUE);
            }

            Overlay.setLoadingOverlay('switchScreen', true);

            this.uiRenderer.removeAllUIHelpers();

            this.currentScreenTimeoutId = setTimeout(() => {
                this.currentScreen = this.getCurrentScreenByDOM();
                this.screenList.updateCurrentScreen(this.currentScreen);
                
                console.log(`Current screen: ${this.currentScreen}`);

                this.currentScreenTimeoutId = null;

                console.log(`execute add UI helpers for screen: ${this.currentScreen}`);

                if (this.dataTableNeedsToBeUpdated) {
                    this.happnMatchesAndMessagesController?.refreshDataTableMatchesAndMatchMessages().then(() => {
                        this.setRefreshDataTable(false);
                        this.screenList.updateCurrentScreen(this.currentScreen);
                        this.setSwipeHelperOnScreen();
                    }).finally(() => {
                        Overlay.setLoadingOverlay('switchScreen', false);
                    });
                } else {
                    this.setSwipeHelperOnScreen();
                    Overlay.setLoadingOverlay('switchScreen', false);
                }

            }, 1000);
        });
        mutationObv.observe($SOCcontainer, {
            childList: false, // observe direct children
            subtree: false, // lower descendants too
            characterDataOldValue: false, // pass old data to callback
            attributes: true
        });

        this.watchersUIList.updatePersonProperty('screenWatcher', mutationObv);
    }

    private isAnyDataRecordProfileOrMessageSetToNeedsUpdate() {
        const firstDataRecordWhichNeedsUpdateProfileOrMessages = this.dataTable.getAllDataRecords().find((dataRecord)=>{
            return dataRecord.getIfProfileDetailsNeedsUpdate() || dataRecord.getIfMessagesNeedsUpdate();
        });
        return firstDataRecordWhichNeedsUpdateProfileOrMessages ? true : false;
    }

    private setRefreshDataTable(shouldDataTableBeRefreshed: boolean) {
        this.dataTableNeedsToBeUpdated = shouldDataTableBeRefreshed;
    }

    public setSwipeHelperOnScreen(): void {
        this.screenList.updateCurrentScreen(this.getCurrentScreenByDOM());
        this.uIHelpersHappn?.addUIHelpers(this.screenList, true);
    }

    public getCurrentScreenByDOM(): ScreenNavStateComboTinder {
        const bodyPageRef = $('body')[0];
        if (bodyPageRef) {
            const bodyPageDataPageAttr = bodyPageRef.getAttribute('data-page');

            if (!bodyPageDataPageAttr && typeof bodyPageDataPageAttr !== 'string') {
                throw new Error(`Could not get current page, please check the DOM properties & code references`);
            }

            let currentPage: ScreenNavStateComboTinder;

            switch (true) {
                case bodyPageDataPageAttr === '/home':
                    currentPage = ScreenNavStateComboTinder.Swipe;
                    break;
                case bodyPageDataPageAttr.startsWith('/conversations/'):
                    currentPage = ScreenNavStateComboTinder.Chat;
                    break;
                default:
                    currentPage = ScreenNavStateComboTinder.UnknownScreen;
                    break;
            }
            return currentPage;
        }
        throw new Error(`Could not get body DOM element from current page, please check the DOM properties & code references`);
    }

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

    public disconnectAllUIWatchers(): boolean {
        this.uiRenderer.removeAllUIHelpers();

        this.watchersUIList.getAllEntries().forEach((watcherItem) => {
            const watcher = watcherItem.getValue() as MutationObserver;
            watcher.disconnect();
        });
        this.watchersUIList.clearAllEntries();

        return this.watchersUIList.getEntriesAmount() === 0 ? true : false;
    }

    public getReminders(reminderHttpList: ReminderHttp[]): void {
        Overlay.setLoadingOverlay('reminderOverlay', true);
        this.requestHandler.postReminderList(reminderHttpList, (currentIndex: number, totalLength: number, statusText: string)=>{
            console.log(`${currentIndex}, / ${totalLength} - ${statusText}`);
            Overlay.setLoadingOverlayProgress('reminderOverlay', currentIndex, totalLength, statusText);
        }).then((reminderHttpList)=>{
            console.dir(reminderHttpList);
            Overlay.setLoadingOverlay('reminderOverlay', false);
        });
    }
}
