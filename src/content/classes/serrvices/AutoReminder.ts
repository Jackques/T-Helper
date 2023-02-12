import { ReminderHttp } from "../data/ReminderHttp";
import { RandomNumber } from "../util/randomNumber";
import { AutoReminderText } from "./AutoReminderText";

export class AutoReminder {

    private reminderMessageTextListDutch = [
        "Hey ${name}, leef je nog?",
        "Nou ${name}, ben jij er nog?",
        "Ik snap wel dat jij overrompeld bent door mijn charmes en tijd nodig hebt om bij te komen ${name}. Geen probleem hoor, neem alle tijd die jij nodig hebt!",
        "${name}! Weet jij waar ik bang voor ben? Ghosts..",
        "Heb ik soms een Ouija bord nodig om jou weer op te roepen na deze ghost 👻 ${name}?",
        "${name}? 😲",
        "${name}? 🥺",
        "${name}! koffie zwart of liever een latte?",
        "Jij neemt The Sound of Silence wel heel letterlijk he ${name}? Het is maar een liedje!",
        "Ja ik vind chatten op tinder ook niks. Zullen wij dan maar eens wat gaan borrelen op in real life ${name}?",
    ];

    private reminderMessageTextListEnglish = [
        "Hey ${name}, are you still alive?",
        "Well ${name}, you still there?",
        "I get that my charmes are too much for you too handle and you need time to collect yourself in order to reply. Don't worry ${name}, take your time!",
        "${name}! Do you know what i'm afraid of? Ghosts..",
        "Do I need a Ouija board to summon you after this ghost 👻 ${name}?",
        "${name}? 😲",
        "${name}? 🥺",
        "${name}! cofee black or do you prefer a latte?",
        "You take The Sound of Silence very literally don't you ${name}? It's just a song!",
        "Yeah I don't like chatting on tinder either. How about we just go for a drink in real life ${name}?",
    ];

    public getReminderHttpMap(id: string, name: string, reminderTextMessageList: string[], english: boolean): ReminderHttp {
        const randomReminderMessage: string = this.getRandomReminderMessage(name, reminderTextMessageList, english);
        return new ReminderHttp(id, randomReminderMessage);
        //TODO TODO TODO: check if reminder exists in previous messages, if so.. choose another reminder!
            // can use the reminder-amount field for this!? perfect! it contains the reminders in text!!!
    }

    private getRandomReminderMessage(name: string, reminderTextMessageList: string[], english: boolean): string {
        const reminderMessageTextListLength: number = this.reminderMessageTextListDutch.length - 1;
        const filteredReminderMessageTextList = this.getUnusedReminderTextMessageList(reminderTextMessageList, english);
        return new AutoReminderText(filteredReminderMessageTextList[RandomNumber.getRandomNumber(0, reminderMessageTextListLength)]).getTextMessage(name);
    }
    private getUnusedReminderTextMessageList(reminderTextMessageList: string[], english: boolean): string[] {
        const reminderMessageTextListEnglish = this.reminderMessageTextListEnglish;
        const reminderMessageTextListDutch = this.reminderMessageTextListDutch;
        // 1. compare if EVERY string in current received reminder.. equals one or more of the strings in the reminder list
        // for this, to make a comparison; EACH current received reminder & the reminder from the reminderlist to compare must:
            // 1. remove name from the string (replaced by ${name})
            // 2. remove all spaces & dots
            // 3. set all characters to lowercase
        if(english){
            return reminderMessageTextListEnglish;
        }
        return reminderMessageTextListDutch;
    }
}