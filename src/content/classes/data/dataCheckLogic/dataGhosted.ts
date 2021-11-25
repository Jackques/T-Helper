export class dataGhosted {
    public static isValidEntry(listEntry: GhostMoment): boolean {
        if(listEntry instanceof GhostMoment){
            return true;
        }
        return false;
        //todo: test ???
    }

}

export class GhostMoment {
    private _number: number;
    private _timeSinceLastMessage: string;
    private _status: GhostStatus;
    constructor(number: number, timeSinceLastMessage: string, status: GhostStatus){
        this._number = number;
        this._timeSinceLastMessage = timeSinceLastMessage;
        this._status = status;
    }

    public updateMoment (updatedTime: string):void {
        if(this.isValidTimeEntry(updatedTime)){
            this._timeSinceLastMessage = updatedTime;
        }
        console.error('timeSinceLastMessage not updated');
        
    }
    private isValidTimeEntry(updatedTime: string): boolean {
        return true;
        //todo: make sure the updatedTime is in the future (or is more) than it's current time
    }
    private isUniqueNumber():boolean {
        const test = true;
        if(test){
            return true;
        }
        return false;
        //todo: do this? or have list / object provide a unique number?
    }
}
type GhostStatus = "replied" | "block" | "ongoing";

//todo: this should be a special object in a array (so multiple objects of this kind) which contains the moment(s) since the last message I have sent which has not been answered in as timely manner (2 days orso?). 
// I controll these rules in the tinderController or subsequent classes
//i need to know; the number of times a ghosting occured, the time it took since the ghost to reply, block or is ongoing (status)