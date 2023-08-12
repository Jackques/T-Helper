import { DataRecord } from "../data/dataRecord";
import { DataTable } from "../data/dataTable";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../util/ConsoleColorLog/LogColors";
import { GenericPersonPropertiesList } from "../util/GenericPersonProperties/GenericPersonPropertiesList";

export class MessagesWatcherHappn {
    private nameController: string;
    private dataTable: DataTable;
    private timeoutNo: number | null = null;

    private currentMessagesList: {
        tempId: string;
        lastMessage: string;
    }[] = [];

    private watchersUIList: GenericPersonPropertiesList;
    private watcherKeys: string[] = [];

    private matchListByMessages = new GenericPersonPropertiesList();

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

    public setMessageListWatcherOnScreen(
        messageListContainers: JQuery<HTMLElement>,
        getMatchListLatestMessages: () => { tempId: string, lastMessage: string }[],
        updateTable: () => void
    ): void {
        this.currentMessagesList = getMatchListLatestMessages();
        ConsoleColorLog.multiLog(`init:`, this.currentMessagesList, LogColors.YELLOW, false);
        this.setLatestMessagesMatchList(this.currentMessagesList);

        const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {
            ConsoleColorLog.singleLog(`Mutation observer for messages triggered, looking for changes`, ``, LogColors.LIGHTGREY);

            if (this.timeoutNo !== null) {
                return;
            }

            this.timeoutNo = setTimeout(() => {
                const newMessagesList: { tempId: string; lastMessage: string; }[] = getMatchListLatestMessages();
                ConsoleColorLog.multiLog(`mutation:`, newMessagesList, LogColors.YELLOW, false);
                this.setLatestMessagesMatchList(this.currentMessagesList);

                let updatedIdsFromMessages: string[] = this.getChangedMessagesTempIds(newMessagesList);

                updatedIdsFromMessages.forEach((tempId) => {
                    const recordIndex = this.dataTable.getRecordIndexBySystemOrTempId(tempId, this.nameController);
                    if(recordIndex === -1){
                        ConsoleColorLog.singleLog(`Could not find record by system id, record index is: ${recordIndex}, tempId is:`, tempId, LogColors.RED);
                        return;
                    }
                    const dataRecord: DataRecord | null = this.dataTable.getRecordByRecordIndex(recordIndex);
                    dataRecord ? dataRecord.setUpdateMessages(true) : ConsoleColorLog.singleLog(`Could not get dataRecord with tempId: `, this.dataTable.getRecordIndexBySystemId(tempId, this.nameController), LogColors.RED);
                    dataRecord !== null ? ConsoleColorLog.multiLog(`Updated dataRecord: `, dataRecord, LogColors.GREEN, false) : null;
                });

                updatedIdsFromMessages = [];
                updateTable();

                this.timeoutNo = null;

            }, 500);
        });

        messageListContainers.each((index, element)=>{
            mutationObv.observe(element, {
                childList: true, // observe direct children
                subtree: true, // lower descendants too
                characterDataOldValue: true, // pass old data to callback
                attributes: true, // also track changes to the attributes
                characterData: true // also track changes to character data (the (text-)contents?)
            });
    
            this.watchersUIList.updatePersonProperty('messageListWatcher'+index, mutationObv);
            this.watcherKeys.push('messageListWatcher'+index);

            ConsoleColorLog.multiLog(`MessageListMutationObserver set for: `, element, LogColors.YELLOW, false);
        });
    }

    public cleanData(): void {

        this.disconnectMessageWatchers();

        // clear the list of watcher keys
        this.watcherKeys = [];

        // Clear all the entries of matchlist found by messages
        this.matchListByMessages.clearAllEntries();
    }

    private disconnectMessageWatchers(): void {
        // disconnect all message watchers & delete them from the list
        this.watcherKeys.forEach((key)=>{
            const obs = this.watchersUIList.getPersonGenericPropertyByKey(key)?.value as MutationObserver;
            obs.disconnect();

            const watcherDeleted = this.watchersUIList.deletePersonGenericPropertyByKey(key);
            if(!obs || !watcherDeleted){
                ConsoleColorLog.singleLog(`A messageswatcher could not be deleted: `, key, LogColors.RED);
            }
        });
    }

    private setLatestMessagesMatchList(messagesList: { tempId: string; lastMessage: string; }[]): void {
        messagesList.forEach((message)=>{
            this.matchListByMessages.updatePersonProperty(message.tempId, message.lastMessage, message.lastMessage);
        });
    }

    private getChangedMessagesTempIds(
        newMessagesList: { tempId: string; lastMessage: string; }[]): string[] {
        const toBeUpdatedIdList: string[] = [];

        newMessagesList.forEach((newMessage)=>{
            const person = this.matchListByMessages.getPersonGenericPropertyByKey(newMessage.tempId);
            if(person !== null){
                // ConsoleColorLog.singleLog(`Person value: ${person.value}, while newMessage.lastMessage is: ${newMessage.lastMessage}`, '', LogColors.LIGHTGREY);
                if(person.value !== newMessage.lastMessage){
                    ConsoleColorLog.singleLog(`Message was updated: `, newMessage.lastMessage, LogColors.YELLOW);
                    toBeUpdatedIdList.push(newMessage.tempId);
                }
            }else{
                this.matchListByMessages.updatePersonProperty(newMessage.tempId, newMessage.lastMessage, newMessage.lastMessage);
            }
        });

        return toBeUpdatedIdList;  
    }
}