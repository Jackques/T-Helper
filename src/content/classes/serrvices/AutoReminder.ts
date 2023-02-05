import { DataRecord } from "../data/dataRecord";

export class AutoReminder {

    private reminderMessageTextList = [
        new AutoReminderText("Hey, ${name}, leef je nog?"),
        new AutoReminderText("Ik snap wel dat jij bent overrompeld door mijn charmes en tijd nodig hebt om bij te komen ${name}. Geen probleem hoor, neem alle tijd die jij nodig hebt!"),
        new AutoReminderText("${name}! Weet jij waar ik bang voor ben? Ghosts.."),
    ];

    public getRandomReminderHttpList(dataRecordList: DataRecord[]): ReminderHttp[] {
        return dataRecordList.map((dataRecord)=>{
            const id: string = dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("System-no")].getValue(); //TODO: Will throw error! i'mn getting the system-id object, not the id itself
            const message: string = this.getRandomReminderMessage(dataRecord);

            return new ReminderHttp(id, message);
        });
    }

    private getRandomReminderMessage(dataRecord: DataRecord): string {
        const name = "sdhasd"; // todo: TEMPORARILY string to test interpolated text message, should be replaced by string retrieved by parameter

        const reminderMessageTextListLength: number = this.reminderMessageTextList.length - 1;
        return this.reminderMessageTextList[this.generateRandom(0, reminderMessageTextListLength)].getTextMessage(name);
    }

    private generateRandom(min = 0, max = 100): number {

        // find diff
        const difference = max - min;
    
        // generate random number 
        let rand = Math.random();
    
        // multiply with difference 
        rand = Math.floor( rand * difference);
    
        // add with min value 
        rand = rand + min;
    
        return rand;
    }
}

export class AutoReminderText {
    private textMessage = "";

    constructor(textMessage: string){
        this.textMessage = textMessage;
    }

    public getTextMessage(name: string): string {
        //todo: figure out how to interpolate string in here, 
        // > maybe simply find & replace some special characters? characters with a certain string which correlates with what i'm trying to personalize? e.g. name = ${name}, age = ${age}
        // e.g.: Hey ${name}, op ${age} moet jij toch geen mensen meer gaan ghosten?;)

        //todo: add some randomized characters in here (beginning & end of string) to not alert tinder's copy-pasta message bot
        return this.textMessage;
    }
}

export class ReminderHttp {
    private id: string;
    private message: string;

    constructor(id: string, message: string){
        this.id = id; // todo: check if received id is valid for sending http request to
        this.message = message;
    }
}