import { SubmitAction } from "src/background/SubmitAction.interface";

export class DataStorage {
    private dataStore:DataItem[] = [];

    constructor(){
        const submitAction: DataItem = {
            name: 'lastSubmitActions',
            data: []
        };
        this.dataStore.push(submitAction);
    }

    public addActionToDataStore(action: SubmitAction): void {
        const lastSubmitActionsIndex = this.dataStore.findIndex(dataItem => dataItem.name === 'lastSubmitActions');
        if(lastSubmitActionsIndex !== -1){
            const duplicateSubmitActionIndex = this.dataStore[lastSubmitActionsIndex].data.findIndex(submitAction => submitAction.submitType === action.submitType || submitAction.personId === action.personId);
            if(duplicateSubmitActionIndex === -1){
                this.dataStore[lastSubmitActionsIndex].data.push(action);
            }
        }else{
            console.error(`Data item 'lastSubmitActions' does not exist in data store`);
        }
    }

    public popLastActionFromDataStore(): SubmitAction | undefined {
        const lastSubmitActionsIndex = this.dataStore.findIndex(dataItem => dataItem.name === 'lastSubmitActions');
        if(lastSubmitActionsIndex === -1){
            console.error(`Data item 'lastSubmitActions' does not exist in data store`);
        }
        return this.dataStore[lastSubmitActionsIndex].data.pop();
    }
}

export interface DataItem {
    name: string,
    data: SubmitAction[]
}