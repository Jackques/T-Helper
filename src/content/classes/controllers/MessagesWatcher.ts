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

    private watchersUIList = new GenericPersonPropertiesList();
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

    constructor(nameController: string, dataTable: DataTable, watchersList: MutationObserver[]) {
        this.nameController = nameController;
        this.dataTable = dataTable;
        // this.watchersUIList = watchersList; //TODO TODO TODO: fix this
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

                let updatedIdsFromMessages: string[] = this.getChangedMessagesTempIds(this.currentMessagesList, newMessagesList);

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



            // TODO TODO TDOO:
            // V 1. Write logic to get first person of message list, 
            //get their associated profile picture, 
            //get the conversations-avatar-picture which contains an img url, 
            //which contains a tempId (it is the part after reising/<tempId>/)
            // V 2. Figure out how to update messages in the new way (or refactor,.. since i made a new implementation for this which MAY NOT HAVE BEEN NECESSARY AT ALL!)
            // V 3. Document the use of getMatchTempIdLatestFromLatestMessage() method because this can change depending upon app implementation
            // V 4. Remove all code below? i'm not going to need it anymore
            // V 5. Consider refactoring 'setScreenWatcher' & 'setMessageListWatcherOnScreen' to their own respective classes, so they can each hold their own seperated state 
            // V (i.e. what last message was for every match & their associated tempId VS what last message is now of every match and if that changed)
            // V (i.e. how many matches there are VS how many matches after mutation)
            // 6. Refactor code so cleanup of watchersUIList is executed here instead of on happnController
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

    public disconnectMessageWatchers(): void {
        // disconnect all message watchers & delete them from the list
        this.watcherKeys.forEach((key)=>{
            const obs = this.watchersUIList.getPersonGenericPropertyByKey(key)?.value as MutationObserver;
            obs.disconnect();

            const watcherDeleted = this.watchersUIList.deletePersonGenericPropertyByKey(key);
            if(!obs || !watcherDeleted){
                ConsoleColorLog.singleLog(`A messageswatcher could not be deleted: `, key, LogColors.RED);
            }
        });

        // clear the list of watcher keys
        this.watcherKeys = [];
    }

    private setLatestMessagesMatchList(messagesList: { tempId: string; lastMessage: string; }[]): void {
        messagesList.forEach((message)=>{
            this.matchListByMessages.updatePersonProperty(message.tempId, message.lastMessage, message.lastMessage);
        });
    }

    private getChangedMessagesTempIds(
        currentMessagesList: { tempId: string; lastMessage: string; }[],
        newMessagesList: { tempId: string; lastMessage: string; }[]): string[] {
        const toBeUpdatedIdList: string[] = [];

        newMessagesList.forEach((newMessage)=>{
            const person = this.matchListByMessages.getPersonGenericPropertyByKey(newMessage.tempId);
            if(person !== null){
                ConsoleColorLog.singleLog(`Person value: ${person.value}, while newMessage.lastMessage is: ${newMessage.lastMessage}`, '', LogColors.LIGHTGREY);
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