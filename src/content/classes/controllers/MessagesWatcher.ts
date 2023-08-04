import { DataRecord } from "../data/dataRecord";
import { DataTable } from "../data/dataTable";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../util/ConsoleColorLog/LogColors";

export class MessagesWatcherHappn {
    private nameController: string;
    private dataTable: DataTable;
    private timeoutNo: number | null = null;

    private currentMessagesList: {
        tempId: string;
        lastMessage: string;
    }[] = [];

    private watchersUIList: MutationObserver[] = [];

    /* 
    Simple class which watches for DOM changes in messageslist via the MutationObserver. 
    If any changes occur (based on if the current list of messages has changed with the previous list of messages) it will attempt to get the corresponding dataRecord 
    and set it's messagesNeedToBeUpdated property to true. 
    It will also trigger a updateTable() which should prompt the parent controller to update it's data table (refresh getting the matches & messages).

    This approach makes use of the best of both the API & DOM solution:
    - The fetch all matches & corresponding latest messages which should automatically trigger a all messages update if the latest message from API does not correspond with the latest message in dataRecord
    - The DOM is checked which persons have updated their messages based on the tempId in found in the src url for their profile picture
    */

    constructor(nameController: string, dataTable: DataTable, watchersList: MutationObserver[]){
        this.nameController = nameController;
        this.dataTable = dataTable;
        this.watchersUIList = watchersList;
    }
    
    public setMessageListWatcherOnScreen(
        messageListContainer: JQuery<HTMLElement>, 
        getMatchTempIdLatestFromLatestMessage: () => { tempId: string, lastMessage: string }[], 
        updateTable: () => void): void {

        const $MessageListContainer: HTMLElement = messageListContainer.first()[0];

        if (!$MessageListContainer) {
            console.error(`Element with identifier not found: ${$MessageListContainer}. Please update identifiers.`);
            return;
        }

        this.currentMessagesList = getMatchTempIdLatestFromLatestMessage();

        const mutationObv = new MutationObserver((mutations: MutationRecord[]) => {
            ConsoleColorLog.singleLog(`i don't fire whenever i feel like it right? only when something has actually changed..`, `so did something change?`, LogColors.RED);

            if(this.timeoutNo !== null){
                return;
            }

            this.timeoutNo = setTimeout(() => {
                const newMessagesList: {tempId: string;lastMessage: string;}[] = getMatchTempIdLatestFromLatestMessage();
                let updatedIdsFromMessages: string[] = this.getChangedMessagesTempIds(this.currentMessagesList, newMessagesList);
                let dataRecords: DataRecord[] = [];
                updatedIdsFromMessages.forEach((tempId)=>{
                    const dataRecord: DataRecord | null = this.dataTable.getRecordByRecordIndex(this.dataTable.getRecordIndexBySystemId(tempId, this.nameController));
                    dataRecord ? dataRecord.setUpdateMessages(true) : undefined;
                    //TODO TODO TODO figure out how to update messages in the new way (or refactor,.. since i made a new implementation for this which MAY NOT HAVE BEEN NECESSARY AT ALL!)
                });

                if (newMessagesList.length > 0 && dataRecords.length === 0) {
                    ConsoleColorLog.singleLog(`Could not get dataRecord with tempId`, newMessagesList, LogColors.RED);
                }

                if (dataRecords.length > 0) {
                    dataRecords = [];
                    updatedIdsFromMessages = [];
                    this.timeoutNo = null;
                    updateTable();
                }
            }, 500);



            // TODO TODO TDOO:
            // V 1. Write logic to get first person of message list, 
                //get their associated profile picture, 
                //get the conversations-avatar-picture which contains an img url, 
                //which contains a tempId (it is the part after reising/<tempId>/)
            // 2. TODO TODO TODO figure out how to update messages in the new way (or refactor,.. since i made a new implementation for this which MAY NOT HAVE BEEN NECESSARY AT ALL!)
            // 3. Document the use of getMatchTempIdLatestFromLatestMessage() method because this can change depending upon app implementation
            // 4. Remove all code below? i'm not going to need it anymore
            // 5. Consider refactoring 'setScreenWatcher' & 'setMessageListWatcherOnScreen' to their own respective classes, so they can each hold their own seperated state 
            // (i.e. what last message was for every match & their associated tempId VS what last message is now of every match and if that changed)
            // (i.e. how many matches there are VS how many matches after mutation)
            // 6. Refactor code so cleanup of watchersUIList is executed here instead of on happnController




            // ensures that only descandt nodes of the (div) node with class 'messageList' will be passed
            // const mutationsOnMessageItem = mutations.filter((mutation) => {
            //     const mutatedElement = mutation.target as HTMLElement;
            //     if (mutatedElement.nodeName === "DIV") {
            //         if (!mutatedElement.classList.contains('messageList')) {
            //             return mutatedElement;
            //         }
            //     } else {
            //         return mutatedElement;
            //     }
            // });
            // if (mutationsOnMessageItem.length === 0) {
            //     return;
            // }

            // // check if mutation are from receiving a new message, if so update the dataRecord to set 'needsTobeUpdated' to true
            // const matchId: string | null = this.getMatchIdFromMutations(mutationsOnMessageItem);

            // // Known flase positives (but does not matter, since all it does will be refetching the messages anyway);
            // // 'bug 1'; profile Aniek last message was a ANIMATED GIF sent to her.. this shows up as a hyperlink in the messages.. thus the last message ('You sent a GIF..') does INDEED NOT EQUAL the last message known by the dataRecord (the hyperlink to the gif)
            // if (matchId !== null) {
            //     const dataRecord = this.dataTable.getRecordByRecordIndex(this.dataTable.getRecordIndexBySystemId(matchId, 'tinder'));

            //     if (dataRecord === null) {
            //         console.error(`Observed last message from unknown match. Please check match in mutations: ${mutationsOnMessageItem} and check the datatable manually`);
            //         return;
            //     }

            //     if (this.hasReceivedNewMessagesFromMatch(mutationsOnMessageItem, dataRecord)) {
            //         // eslint-disable-next-line no-debugger
            //         // debugger;
            //         dataRecord.setUpdateMessages(true);
            //         this.setRefreshDataTable(true);
            //         console.log(`%c ${console.count()} (2)I just set profile: ${dataRecord.usedDataFields[5].getValue()} with id: ${matchId} with recordIndex: ${this.dataTable.getRecordIndexBySystemId(matchId, 'tinder')} to true.. for this person sent me a new message thus my messages list for her should be reviewed`, "color: orange");
            //         return;
            //     }
            // }
            // if not, then mutations are from switching match conversation
        });

        mutationObv.observe($MessageListContainer, {
            childList: true, // observe direct children
            subtree: true, // lower descendants too
            characterDataOldValue: false, // pass old data to callback
        });

        this.watchersUIList.push(mutationObv);
    }

    private getChangedMessagesTempIds(
        currentMessagesList: { tempId: string; lastMessage: string; }[], 
        newMessagesList: { tempId: string; lastMessage: string; }[]): string[] 
        {
            // TODO TODO TODO: IMPLEMENT LOGIC FOR COMPARING & RETURNING CORRECT STRING TEMPIDS
        throw new Error("Method not implemented.");
    }
}