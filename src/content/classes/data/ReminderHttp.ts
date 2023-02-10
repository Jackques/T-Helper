
export class ReminderHttp {
    private id: string;
    private message: string;

    constructor(id: string, message: string) {

        if(!id || id.length <= 0){
            console.error(`Datarecord with id: ${id} does not appear to have a valid id`); 
        }

        if(!message || message.length <= 0){
            console.error(`Message is invalid. Message: ${message}`);
        }

        this.id = id;
        this.message = message;
    }

    public getId(){
        return this.id;
    }
    public getMessage(){
        return this.message;
    }
}
