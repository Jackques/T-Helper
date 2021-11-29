export class dataItemReactionSpeed {
    private _datetimeMyLastMessage: Date;
    private _datetimeTheirResponse: Date;

    private _datetimebetween: Date;
    constructor(datetimeMyLastMessage: string, datetimeTheirResponse: string){
        this._datetimeMyLastMessage = new Date(datetimeMyLastMessage);
        this._datetimeTheirResponse = new Date(datetimeTheirResponse);

        this._datetimebetween = this.getDateTimeBetweenDates(this._datetimeMyLastMessage, this._datetimeTheirResponse);
    }

    private getDateTimeBetweenDates(datetimeMyLastMessage: Date, datetimeTheirResponse: Date){
        //todo inplement
        return new Date();
    }
}