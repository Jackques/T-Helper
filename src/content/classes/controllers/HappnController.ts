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
import { DataStorage } from '../data/dataStorage';
import { DataField, DataFieldDistances, DataFieldMessages, UIRequired } from "../data/dataField";
import { PersonAction } from "../../../personAction.enum"; // todo: had to move this to top level AND make a relative path.. but since ALL components (content, background, popup) share the same interfaces/enums etc. why not move everything to top lvl for importing? ALSO; why did an error occur when i tried to relative import this?
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
import { Overlay } from "../serrvices/Overlay";
import { MatchDataParser } from "./MatchDataParserHappn";
import { UIHelpersHappn } from "./UIHelpersHappn";
import { UrlHelper } from "../serrvices/UrlHelper";
import { MessagesWatcherHappn } from "./MessagesWatcher";

export class HappnController implements datingAppController {
    private nameController = 'happn';
    private dataRetrievalMethod: 'api' | 'dom' | null = null;
    private uiRenderer: UIFieldsRenderer = new UIFieldsRenderer({
        fieldsContainerSwipeScreen: 'body',
        fieldsContainerChatScreen: 'body [data-testid="conversation-message-list-scrollbars"]',

        swipeActionLike: 'body [data-testid="profile-btn-like"]',
        swipeActionPass: 'body [data-testid="profile-btn-reject"]',
        swipeActionSuperlike: 'body [data-testid="profile-btn-flashnote"]',

        chatActionSendMessage: 'body [data-testid="conversation"] textarea',
    });
    private uIHelpersHappn: UIHelpersHappn | null = null;
    private messagesWatcher: MessagesWatcherHappn | null = null;

    private happnAccessToken = '';
    private requestHandler!: RequestHandlerHappn; // 'definite assignment assertion proerty (!) added here, is this a good practice?'
    private dataTable: DataTable;
    private dataStorage: DataStorage;

    private currentScreenTimeoutId: number | null = null;
    private currentScreen: ScreenNavStateCombo = this.getCurrentScreenByDOM();
    private currentMatchIdByUrlChat: string | null = UrlHelper.getCurrentMatchIdFromUrl();

    private amountOfUnmessagedMatches = 0;
    private matchesListTimeoutId: number | null = null;

    private dataTableNeedsToBeUpdated = false;

    private watchersUIList: MutationObserver[] = [];

    private happnMatchesAndMessagesController: HappnMatchesAndMessagesController | null = null;

    constructor(dataRetrievalMethod: 'api' | 'dom' | null, dataTable: DataTable, dataStorage: DataStorage) {

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
                    this.uIHelpersHappn = new UIHelpersHappn(this.nameController, this.uiRenderer, this.dataTable, this.requestHandler, this.dataStorage);
                    this.messagesWatcher = new MessagesWatcherHappn(this.nameController, this.dataTable, this.watchersUIList);

                    Overlay.setLoadingOverlay('initApp', true);
                    this.happnMatchesAndMessagesController.refreshDataTableMatchesAndMatchMessages().then(() => {

                        // ConsoleColorLog.startCategorizedLogs(CategoryStatus.START, LogColors.BLUE);
                        // ConsoleColorLog.singleLog(`my first test message`, true);
                        // ConsoleColorLog.singleLog(`my second test message`, false);
                        // ConsoleColorLog.singleLog(`my third test message`, 'testmessage');
                        // ConsoleColorLog.startCategorizedLogs(CategoryStatus.END, LogColors.BLUE);

                        console.log(`RefreshDataTableMatchesAndMatchMessages .then START`);
                        //todo: 4 Inplement add tinder UI support overlay (e.g. add icon/color to match who hasn't replied in a week)
                        this.setSwipeHelperOnScreen();

                    }).catch((error) => {
                        console.dir(error);
                        console.error(`Something went wrong`);
                    }).finally(() => {
                        Overlay.setLoadingOverlay('initApp', false);
                        // this.setScreenWatcher('#root');
                        this.setScreenWatcher('body');

                        const messageListContainers = this.getMessageContainerDOMRef();
                        this.messagesWatcher?.setMessageListWatcherOnScreen(
                            messageListContainers,
                            () => {
                                return this.getMatchTempIdLatestFromLatestMessage(messageListContainers);
                            },
                            () => {
                                this.setRefreshDataTable(true);
                            });
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
                    ConsoleColorLog.singleLog(`A match conversation has been removed, thus unable to get tempId nor dataRecord`, '', LogColors.YELLOW);
                    //TODO TODO TODO: Send message to screenwatcher, this has matchid set!
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

    private setScreenWatcher(containerDomElement: string) {

        /*
            Sets the currently active screen 
        */
        const swipeOrChatContainerIdentifier = containerDomElement;

        // const $SOCcontainer = $('body').find(swipeOrChatContainerIdentifier).first()[0];
        const $SOCcontainer = $('body').first()[0];

        if (!$SOCcontainer) {
            console.error(`Element with identifier not found: ${swipeOrChatContainerIdentifier}. Please update identifiers.`);
            return;
        }

        // Only need to observe the swipe-or-chat container. The matches & messageList container are always present (though not visible) anyway!
        // Thus I can always apply DOM manipulations on them when needed!
        const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {
            
            if(this.currentScreen === this.getCurrentScreenByDOM()){
                ConsoleColorLog.singleLog(`Still on the same screen: `, this.currentScreen, LogColors.BLUE);
                //TODO TODO TODO: If screen is still CHAT, maybe set a global current chat person id? Pass it to messageWatcher maybe?
            }
            this.currentScreen = this.getCurrentScreenByDOM();
            ConsoleColorLog.singleLog(`New screen: `, this.currentScreen, LogColors.BLUE);

            if (this.currentScreenTimeoutId !== null) {
                // if timeout below is already set once, prevent it from setting it again untill it finishes to save resources
                return;
            }

            if (this.currentScreen === ScreenNavStateCombo.Chat) {
                ConsoleColorLog.singleLog(`Switched to screen: `, ScreenNavStateCombo.Chat, LogColors.GREEN);
                const newMatchIdFromUrl = UrlHelper.getCurrentMatchIdFromUrl();

                const messageListContainers = this.getMessageContainerDOMRef();
                this.messagesWatcher?.disconnectMessageWatchers();
                this.messagesWatcher?.setMessageListWatcherOnScreen(
                    messageListContainers,
                    () => {
                        return this.getMatchTempIdLatestFromLatestMessage(messageListContainers);
                    },
                    () => {
                        this.setRefreshDataTable(true);
                    }
                );

                if (this.currentMatchIdByUrlChat === null || this.currentMatchIdByUrlChat !== newMatchIdFromUrl) {
                    console.log(`%c Switched CHAT from match with id ${this.currentMatchIdByUrlChat} to match with id: ${newMatchIdFromUrl}`, "color: green");
                    this.currentMatchIdByUrlChat = newMatchIdFromUrl;
                } else {
                    return;
                }
            } else if (this.currentScreen === this.getCurrentScreenByDOM()) {
                return;
            }

            Overlay.setLoadingOverlay('switchScreen', true);

            this.uiRenderer.removeAllUIHelpers();

            this.currentScreenTimeoutId = setTimeout(() => {
                this.currentScreen = this.getCurrentScreenByDOM();
                console.log(`Current screen: ${this.currentScreen}`);

                this.currentScreenTimeoutId = null;

                console.log(`execute add UI helpers for screen: ${this.currentScreen}`);

                if (this.dataTableNeedsToBeUpdated) {
                    this.happnMatchesAndMessagesController?.refreshDataTableMatchesAndMatchMessages().then(() => {
                        this.setRefreshDataTable(false);
                        this.setSwipeHelperOnScreen();
                    }).finally(() => {
                        Overlay.setLoadingOverlay('switchScreen', false);
                    });
                } else {
                    this.uIHelpersHappn?.addUIHelpers(this.currentScreen);
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

        this.watchersUIList.push(mutationObv);
    }

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

    private setRefreshDataTable(shouldDataTableBeRefreshed: boolean) {
        this.dataTableNeedsToBeUpdated = shouldDataTableBeRefreshed;
    }

    private getLatestMessageFromMutations(mutations: MutationRecord[]): string | null {
        // KAN WEG?
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
        //KAN WEG?
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
        // KAN WEG?
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
        // KAN WEG?
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

    public setSwipeHelperOnScreen(): void {
        this.currentScreen = this.getCurrentScreenByDOM();
        this.uIHelpersHappn?.addUIHelpers(this.currentScreen);
    }

    public getCurrentScreenByDOM(): ScreenNavStateCombo {
        const bodyPageRef = $('body')[0];
        if (bodyPageRef) {
            const bodyPageDataPageAttr = bodyPageRef.getAttribute('data-page');

            if (!bodyPageDataPageAttr && typeof bodyPageDataPageAttr !== 'string') {
                throw new Error(`Could not get current page, please check the DOM properties & code references`);
            }

            let currentPage: ScreenNavStateCombo;

            switch (true) {
                case bodyPageDataPageAttr === '/home':
                    currentPage = ScreenNavStateCombo.Swipe;
                    break;
                case bodyPageDataPageAttr.startsWith('/conversations/'):
                    currentPage = ScreenNavStateCombo.Chat;
                    break;
                default:
                    currentPage = ScreenNavStateCombo.UnknownScreen;
                    break;
            }
            // console.log(`You are on page: ${currentPage}`);
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

    // public getReminders(reminderHttpList: ReminderHttp[]){
    //     //todo: show overlay
    //     Overlay.setLoadingOverlay('reminderOverlay', true);
    //     this.requestHandler.postReminderList(reminderHttpList, (currentIndex: number, totalLength: number, statusText: string)=>{
    //         console.log(`${currentIndex}, / ${totalLength} - ${statusText}`);
    //         Overlay.setLoadingOverlayProgress('reminderOverlay', currentIndex, totalLength, statusText);
    //     }).then((reminderHttpList)=>{
    //         console.dir(reminderHttpList);
    //         debugger;
    //         //todo: hide overlay
    //         Overlay.setLoadingOverlay('reminderOverlay', false);
    //     });
    // }
}
