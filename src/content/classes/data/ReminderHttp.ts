
export class ReminderHttp {
    private tempId: string;
    private completeId: string;
    private name: string;
    private message: string;
    private reminderSent = false;
    private reminderSentError = "";

    constructor(tempId: string, completeid: string, name: string, message: string) {

        if(!tempId || tempId.length <= 0){
            console.error(`Datarecord with id: ${tempId} does not appear to have a valid id`);
        }

        if(!message || message.length <= 0){
            console.error(`Message is invalid. Message: ${message}`);
        }

        this.tempId = tempId;
        this.completeId = completeid;
        this.name = name;
        this.message = message;
    }

    public getTempId(): string {
        return this.tempId;
    }

    public getCompleteId(): string {
        return this.completeId;
    }

    public getMyId(): string {
        return this.completeId.replace(this.getTempId(), "");
    }

    public getName(): string {
        return this.name;
    }
    
    public getMessage(): string {
        return this.message;
    }

    public setReminderSent(): void {
        this.reminderSent = true;
    }

    public setReminderSentError(errorMessage: string): void {
        this.reminderSentError = errorMessage;
    }
}
