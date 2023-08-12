import { DataRecord } from "../data/dataRecord";
import { DataTable } from "../data/dataTable";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../util/ConsoleColorLog/LogColors";
import { GenericPersonPropertiesList } from "../util/GenericPersonProperties/GenericPersonPropertiesList";

export class MatchesWatcherHappn {
    private nameController: string;
    private dataTable: DataTable;
    private timeoutNo: number | null = null;

    private currentMessagesList: {
        tempId: string;
        lastMessage: string;
    }[] = [];

    private watchersUIList: GenericPersonPropertiesList;
    private watcherKeys: string[] = [];

    private currentMatchesAmount = 0;

    // private matchListByMessages = new GenericPersonPropertiesList();

    //TODO TODO TODO: UPDATE THIS TEXT
    /* 
    Simple class which watches for DOM changes in messageslist via the MutationObserver. 
    If any changes occur (based on if the current list of messages has changed with the previous list of messages) it will attempt to get the corresponding dataRecord 
    and set it's messagesNeedToBeUpdated property to true. 
    It will also trigger a updateTable() which should prompt the parent controller to update it's data table (refresh getting the matches & messages).

    This approach makes use of the best of both the API & DOM solution:
    - The fetch all matches & corresponding latest messages which should automatically trigger a all messages update if the latest message from API does not correspond with the latest message in dataRecord
    - The DOM is checked which persons have updated their messages based on the tempId in found in the src url for their profile picture
    */

    constructor(nameController: string, dataTable: DataTable, watchersList: GenericPersonPropertiesList) {
        this.nameController = nameController;
        this.dataTable = dataTable;
        this.watchersUIList = watchersList;
    }

    public setMatchesNumberWatcherOnScreen(
        matchesContainers: JQuery<HTMLElement>,
        getCurrentMatchesAmount: () => number | null,
        updateTable: () => void
    ): void {

        const currentMatches = getCurrentMatchesAmount();
        if(getCurrentMatchesAmount() !== null){
            this.currentMatchesAmount = currentMatches !== null ? currentMatches : 0;
        }
        ConsoleColorLog.singleLog(`init matchesWatcher:`, currentMatches, LogColors.YELLOW);
        // this.setLatestMessagesMatchList(this.currentMessagesList);

        const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {
            ConsoleColorLog.singleLog(`Mutation observer for matches triggered, looking for changes`, ``, LogColors.LIGHTGREY);

            if (this.timeoutNo !== null) {
                return;
            }

            this.timeoutNo = setTimeout(() => {

                const currentMatches = getCurrentMatchesAmount();

                ConsoleColorLog.singleLog(`mutation matchesWatcher:`, currentMatches, LogColors.YELLOW);
                
                if(currentMatches !== null && currentMatches !== this.currentMatchesAmount){
                    this.currentMatchesAmount = currentMatches;
                    updateTable();
                    ConsoleColorLog.singleLog(`New matches available to update in DataTable. DataTable will be updated on next refresh`, '', LogColors.GREEN)
                }
                
                this.timeoutNo = null;

            }, 500);
        });

        matchesContainers.each((index, element)=>{
            mutationObv.observe(element, {
                childList: true, // observe direct children
                subtree: true, // lower descendants too
                characterDataOldValue: true, // pass old data to callback
                attributes: true, // also track changes to the attributes
                characterData: true // also track changes to character data (the (text-)contents?)
            });
    
            this.watchersUIList.updatePersonProperty('matchesWatcher'+index, mutationObv);
            this.watcherKeys.push('matchesWatcher'+index);

            ConsoleColorLog.multiLog(`MatchesMutationObserver set for: `, element, LogColors.YELLOW, false);
        });
    }

    public cleanData(): void {

        this.disconnectMessageWatchers();

        // clear the list of watcher keys
        this.watcherKeys = [];
    }

    private disconnectMessageWatchers(): void {
        // disconnect all message watchers & delete them from the list
        this.watcherKeys.forEach((key) => {
            const obs = this.watchersUIList.getPersonGenericPropertyByKey(key)?.value as MutationObserver;
            obs.disconnect();

            const watcherDeleted = this.watchersUIList.deletePersonGenericPropertyByKey(key);
            if(!obs || !watcherDeleted){
                ConsoleColorLog.singleLog(`A messageswatcher could not be deleted: `, key, LogColors.RED);
            }
        });
    }
}