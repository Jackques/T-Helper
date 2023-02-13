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
        "${name}! coffee black or do you prefer a latte?",
        "You take The Sound of Silence very literally don't you ${name}? It's just a song!",
        "Yeah I don't like chatting on tinder either. How about we just go for a drink in real life ${name}?",
    ];

    public getReminderHttpMap(id: string, name: string, usedReminderTextMessageList: string[], english: boolean): ReminderHttp {
        const randomReminderMessage: string = this.getRandomReminderMessage(name, usedReminderTextMessageList, english);
        return new ReminderHttp(id, randomReminderMessage);
    }

    public getreminderMessageTextListDutch(): string[] {
        return this.reminderMessageTextListDutch;
    }

    public getreminderMessageTextListEnglish(): string[] {
        return this.reminderMessageTextListEnglish;
    }

    private getRandomReminderMessage(name: string, usedReminderTextMessageList: string[], english: boolean): string {
        const reminderMessageTextListLength: number = this.reminderMessageTextListDutch.length - 1;
        const namedReminderMessageTextList: string[] = this.getNamedReminderMessageTextList(name, english);
        const filteredReminderMessageTextList = this.getUnusedReminderTextMessageList(usedReminderTextMessageList, namedReminderMessageTextList);
        return new AutoReminderText(filteredReminderMessageTextList[RandomNumber.getRandomNumber(0, reminderMessageTextListLength)]).getTextMessage();
    }

    private getNamedReminderMessageTextList(name: string, english: boolean): string[] {
        if (english) {
            return this.reminderMessageTextListEnglish.map((reminderMessageText) => {
                return reminderMessageText.replace("${name}", name);
            });
        }
        return this.reminderMessageTextListDutch.map((reminderMessageText) => {
            return reminderMessageText.replace("${name}", name);
        });
    }

    private getUnusedReminderTextMessageList(usedReminderTextMessageList: string[], namedReminderMessageTextList: string[]): string[] {
        let unusedReminderMessageTextList: string[] = namedReminderMessageTextList;

        //todo: potential problem; if name gets updated/replaced either by me or by match who updates profile.. the old reminder will NOT register as a 'used reminder' anymore
        // thus, I should refactor name string to array string in order to track name changes and filter out used names in reminders
        // for now.. I consider this too much of an edge case to be a problem (and using a reminder twice in such edge cases will not be THAT much of a problem)

        usedReminderTextMessageList.forEach((reminderTextMessage) => {
            unusedReminderMessageTextList = namedReminderMessageTextList.filter((reminderMessage) => {
                return this.removeAvoidBotCharacters(reminderTextMessage) !== this.removeAvoidBotCharacters(reminderMessage);
            });
            console.log("does the foreach run before it is returned?");
        });
        console.log("or does it return before the foreach ran or finished running?");
        return unusedReminderMessageTextList;
    }

    private removeAvoidBotCharacters(reminderTextMessage: string) {
        // 3. remove all spaces & dots
        // 4. set all characters to lowercase
        return reminderTextMessage.replace(" ", "").replace(".", "").toLocaleLowerCase();
    }
}