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

export enum GhostStatus { REPLIED = "replied", BLOCKED = "block", ONGOING = "ongoing" }