import { ReminderHttp } from "../classes/data/ReminderHttp";
import { AutoReminder } from "../classes/serrvices/AutoReminder";

describe('Auto Reminder Test', () => {
    const id = "123abc";
    const name = "Rihanna";

    const dutchReminderList = new AutoReminder().getreminderMessageTextListDutch();
    const englishReminderList = new AutoReminder().getreminderMessageTextListDutch();

    it('Test - Get Reminder HTTP no reminders sent yet', () => {
        const usedReminderTextMessageList: string[] = [];
        const isEnglish = false;
        const reminderHttp:ReminderHttp = new AutoReminder().getReminderHttpMap(id, name, usedReminderTextMessageList, isEnglish);
        expect(reminderHttp.getId()).toEqual(id);
        expect(reminderHttp.getMessage().includes(name)).toEqual(true);
    });
    xit('Test - Get Reminder HTTP no reminders sent yet but English', () => {

    });


    xit('Test - Get Reminder HTTP no matching reminders sent', () => {

    });
    xit('Test - Get Reminder HTTP no matching reminders sent yet and English', () => {

    });


    xit('Test - Get Reminder HTTP one matching reminders sent', () => {

    });
    xit('Test - Get Reminder HTTP one matching reminders sent and English', () => {

    });

    xit('Test - Get Reminder HTTP multiple matching reminders sent', () => {

    });
    xit('Test - Get Reminder HTTP multiple matching reminders sent and English', () => {

    });
});