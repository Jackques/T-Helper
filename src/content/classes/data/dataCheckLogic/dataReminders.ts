export class dataReminders {
    public static isValidEntry(listEntry: Reminder): boolean {
        if(listEntry instanceof Reminder){
            return true;
        }
        return false;
        //todo: test ???
    }

}

export class Reminder {
    private _datetimeMyLastMessage: Date;
    private _datetimeReminderSent: Date;
    private _textContentReminder: string;
    private _hasGottenReply: boolean;

    constructor(datetimeMyLastMessage: string, datetimeReminderSent: string, textContentReminder: string, hasGottenReply: boolean){
        this._datetimeMyLastMessage = new Date(datetimeMyLastMessage);
        this._datetimeReminderSent = new Date(datetimeReminderSent);
        this._textContentReminder = textContentReminder;
        this._hasGottenReply = hasGottenReply;
    }

}