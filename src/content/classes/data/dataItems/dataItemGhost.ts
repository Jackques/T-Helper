export class dataItemGhost {

    private _number: number;
    private _timeSinceLastMessageMS: string;
    private _status: GhostStatus;

    constructor(number: number, timeSinceLastMessageMS: string, status: GhostStatus){
        this._number = number;
        this._timeSinceLastMessageMS = timeSinceLastMessageMS;
        this._status = status;
    }
}

export enum GhostStatus { REPLIED = "answered", NOT_REPLIED_TO_REMINDER = "unanswered-to-reminder", NOT_REPLIED = 'unanswered', BLOCKED = "block", }