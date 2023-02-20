import { ReminderHttp } from "../classes/data/ReminderHttp";
import { AutoReminder } from "../classes/serrvices/AutoReminder";

describe('Auto Reminder Test', () => {
    const id = "123abc";
    const name = "Rihanna";

    const dutchReminderList = new AutoReminder().getreminderMessageTextListDutch();
    const englishReminderList = new AutoReminder().getreminderMessageTextListEnglish();

    it('Test - Get Reminder HTTP no reminders sent yet', () => {
        const usedReminderTextMessageList: string[] = [];
        const isEnglish = false;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);
        expect(reminderHttp.getMessage().includes(name)).toEqual(true);
    });
    it('Test - Get Reminder HTTP no reminders sent yet but English', () => {
        const usedReminderTextMessageList: string[] = [];
        const isEnglish = true;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);
        expect(reminderHttp.getMessage().includes(name)).toEqual(true);
    });


    it('Test - Get Reminder HTTP no matching reminders sent', () => {
        const usedReminderTextMessageList: string[] = ["Hoi, ben je daar?"];
        const isEnglish = false;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);
        expect(reminderHttp.getMessage().includes(name)).toEqual(true);
    });
    it('Test - Get Reminder HTTP no matching reminders sent yet and English', () => {
        const usedReminderTextMessageList: string[] = ["Hello, are you there?"];
        const isEnglish = false;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);
        expect(reminderHttp.getMessage().includes(name)).toEqual(true);
    });


    it('Test - Get Reminder HTTP one matching reminders sent', () => {
        const usedReminderTextMessageList: string[] = [];
        usedReminderTextMessageList.push(dutchReminderList[0]);
        usedReminderTextMessageList.map((dutchReminder) => {
            dutchReminder.replace("${name}", name);
        });

        const isEnglish = false;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);
        expect(reminderHttp.getMessage().includes(name)).toEqual(true);
    });
    it('Test - Get Reminder HTTP one matching reminders sent and English', () => {
        const usedReminderTextMessageList: string[] = [];
        usedReminderTextMessageList.push(englishReminderList[0]);
        usedReminderTextMessageList.map((englishReminder) => {
            englishReminder.replace("${name}", name);
        });

        const isEnglish = true;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);
        expect(reminderHttp.getMessage().includes(name)).toEqual(true);
    });

    it('Test - Get Reminder HTTP multiple matching reminders sent', () => {
        let usedReminderTextMessageList: string[] = [];
        let unusedReminderTextMessageList: string[] = [];
        dutchReminderList.forEach((dutchReminder, index) => {
            if (index <= 5) {
                usedReminderTextMessageList.push(dutchReminder);
            } else {
                unusedReminderTextMessageList.push(dutchReminder);
            }
        });
        usedReminderTextMessageList = usedReminderTextMessageList.map((dutchReminder) => {
            return replaceName(dutchReminder, name);
        });
        unusedReminderTextMessageList = unusedReminderTextMessageList.map((dutchReminder) => {
            return removeBotCharacters(replaceName(dutchReminder, name));
        });

        const isEnglish = false;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);

        const message = reminderHttp.getMessage();
        expect(message.includes(name)).toEqual(true);
        expect(unusedReminderTextMessageList.includes(removeBotCharacters(message))).toEqual(true);
    });

    it('Test - Get Reminder HTTP multiple matching reminders sent and English', () => {
        let usedReminderTextMessageList: string[] = [];
        let unusedReminderTextMessageList: string[] = [];
        englishReminderList.forEach((englishReminder, index) => {
            if (index <= 5) {
                usedReminderTextMessageList.push(englishReminder);
            } else {
                unusedReminderTextMessageList.push(englishReminder);
            }
        });
        usedReminderTextMessageList = usedReminderTextMessageList.map((englishReminder) => {
            return replaceName(englishReminder, name);
        });
        unusedReminderTextMessageList = unusedReminderTextMessageList.map((englishReminder) => {
            return removeBotCharacters(replaceName(englishReminder, name));
        });

        const isEnglish = true;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);

        const message = reminderHttp.getMessage();
        expect(message.includes(name)).toEqual(true);
        expect(unusedReminderTextMessageList.includes(removeBotCharacters(message))).toEqual(true);
    });


    it('Test - Get Reminder HTTP some random reminders sent', () => {
        // some 'self-made' reminder sent & 1/2 reminder sent from the list
        let usedReminderTextMessageList: string[] = [dutchReminderList[1], dutchReminderList[6], dutchReminderList[8], "yo?", "ello ${name}?"];
        let unusedReminderTextMessageList: string[] = [dutchReminderList[0], dutchReminderList[2], dutchReminderList[3], dutchReminderList[4], dutchReminderList[5], dutchReminderList[7], dutchReminderList[1], dutchReminderList[9]];

        usedReminderTextMessageList = usedReminderTextMessageList.map((dutchReminder) => {
            return replaceName(dutchReminder, name);
        });
        unusedReminderTextMessageList = unusedReminderTextMessageList.map((dutchReminder) => {
            return removeBotCharacters(replaceName(dutchReminder, name));
        });

        const isEnglish = false;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);

        const message = reminderHttp.getMessage();
        expect(message.includes(name)).toEqual(true);
        expect(unusedReminderTextMessageList.includes(removeBotCharacters(message))).toEqual(true);
    });

    it('Test - Get Reminder HTTP some random reminders sent and English', () => {
        // some 'self-made' reminder sent & 1/2 reminder sent from the list
        let usedReminderTextMessageList: string[] = ["hi you there? ${name}", englishReminderList[5], "yo?", englishReminderList[1], "ello ${name}?"];
        let unusedReminderTextMessageList: string[] = [englishReminderList[0], englishReminderList[2], englishReminderList[3], englishReminderList[4], englishReminderList[6], englishReminderList[7], englishReminderList[8], englishReminderList[9]];

        usedReminderTextMessageList = usedReminderTextMessageList.map((dutchReminder) => {
            return replaceName(dutchReminder, name);
        });
        unusedReminderTextMessageList = unusedReminderTextMessageList.map((dutchReminder) => {
            return removeBotCharacters(replaceName(dutchReminder, name));
        });

        const isEnglish = true;
        const reminderHttp: ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getTempId()).toEqual(id);

        const message = reminderHttp.getMessage();
        expect(message.includes(name)).toEqual(true);
        expect(unusedReminderTextMessageList.includes(removeBotCharacters(message))).toEqual(true);
    });

    xit('Test - Get Reminder HTTP all matching reminders sent', () => {
        // spy on console.error and refactor code to throw error is all reminders are used up (should never happen)
    });
    xit('Test - Get Reminder HTTP all matching reminders sent and English', () => {
        // spy on console.error and refactor code to throw error is all reminders are used up (should never happen)
    });

    function replaceName(text: string, name: string): string {
        // return text.replace("${name}", name);
        return text.replace(/\${name}/g, name);
    }

    function removeBotCharacters(text: string): string {
        // return text.replaceAll(".", "").replaceAll(" ", "");
        return text.replace(/\./g, "").replace(/ /g, "").toLocaleLowerCase();
    }
});