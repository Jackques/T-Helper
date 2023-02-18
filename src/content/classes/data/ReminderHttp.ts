
export class ReminderHttp {
    private id: string;
    private name: string;
    private message: string;
    private reminderSent = false;
    private reminderSentError = "";

    constructor(id: string, name: string, message: string) {

        if(!id || id.length <= 0){
            console.error(`Datarecord with id: ${id} does not appear to have a valid id`); 
        }

        if(!message || message.length <= 0){
            console.error(`Message is invalid. Message: ${message}`);
        }

        this.id = id;
        this.name = name;
        this.message = message;
    }

    public getId(){
        return this.id;
    }

    public getName(){
        return this.name;
    }
    
    public getMessage(){
        return this.message;
    }

    public setReminderSent(): void {
        this.reminderSent = true;
    }

    public setReminderSentError(errorMessage: string): void {
        this.reminderSentError = errorMessage;
    }
}
