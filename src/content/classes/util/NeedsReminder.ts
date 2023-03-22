import { reminderAmountItem } from "src/content/interfaces/data/reminderAmountItem.interface";
import { Message, MessageAuthorEnum } from "../../../message.interface";
import { DateHelper, DateHelperTimeStamp } from "./dateHelper";

export class Reminder {

    private maxNumberReminders = 3; // if I sent a match a maximum of 3 reminder over a long period of time, EVEN IF she responded at some point, do not send any more reminders
    private minDaysBetweenReminders = 2;
    private minDaysForSendingReminder = 4;
    private reminderAmountItem: reminderAmountItem[] = [];
    private dateAcquiredNumber: string | null = null;
    private dateBlockedOrRemoved: string | null = null;
    private currentDateTimeNumber: number;

    constructor(messages: Message[], dateAcquiredNumber: string | null, dateBlockedOrRemoved: string | null, currentDateTimeNumber: number) {
        this.reminderAmountItem = this._getReminderAmount(messages, dateAcquiredNumber, dateBlockedOrRemoved);
        this.dateAcquiredNumber = dateAcquiredNumber;
        this.dateBlockedOrRemoved = dateBlockedOrRemoved;
        this.currentDateTimeNumber = currentDateTimeNumber;
    }

    public getNeedsReminder(messages: Message[] | undefined): boolean {

        if (messages === undefined) {
            console.error(`Could not read tinder messages for this match. Expected an array of tinder messages but received: ${messages}`);
            return false;
        }

        // match does not need a reminder IF we did not exchange any messages, i acquired the number, the match has been blocked or removed, the amount of reminders is greater than or equal to the max amount of reminders
        if (messages.length <= 0 || this.dateAcquiredNumber || this.dateBlockedOrRemoved || this.reminderAmountItem.length >= this.maxNumberReminders) {
            return false;
        }

        if(!this.isLastMessageUnanswered(messages)){
            return false;
        }

        // if has total of 3 reminders/messages EACH seperated by at least 2-3 days, return false
        if (this.isLastReminderOverdue(messages)) {
            return true;
        }

        return false;
    }

    public getReminderAmountItems(): reminderAmountItem[] {
        return this.reminderAmountItem;
    }

    private isLastReminderOverdue(messages: Message[]): boolean {
        const lastReminder: Message = this.getMostRecentMessages(messages);

        if (DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(new Date(lastReminder.datetime).getTime(), this.currentDateTimeNumber, this.minDaysForSendingReminder)) {
            return true;
        }
        return false;
    }

    private getMostRecentMessages(messages: Message[]): Message {
        let mostRecentMessage: Message = messages[messages.length - 1];
        for (let i = 0; i < messages.length; i++) {
            if(!DateHelper.isDateLaterThanDate(mostRecentMessage.datetime, messages[i].datetime)){
                mostRecentMessage = messages[i];
            }
        }
        return mostRecentMessage;
    }

    private isLastMessageUnanswered(messages: Message[]): boolean {
        if (messages.length > 0 && messages[messages.length - 1].author === MessageAuthorEnum.Me) {
            if(DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(new Date(messages[messages.length - 1].datetime).getTime(), this.currentDateTimeNumber, this.minDaysForSendingReminder)){
                return true;
            }
            return false;
        }
        return false;
    }

    private _getReminderAmount(matchMessages: Message[], dateAcquiredNumber: string | null, dateBlockedOrRemoved: string | null): reminderAmountItem[] {
        const reminderAmountList: reminderAmountItem[] = [];
        let reminderAmount = 0;

        let previousMessage: Message;

        if (matchMessages.length <= 0) {
            return reminderAmountList;
        }

        matchMessages.forEach((message: Message, index: number, list: Message[]) => {

            const isMessagePreviousLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(message.datetime, dateAcquiredNumber) : false;
            const isMessagePreviousLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(message.datetime, dateBlockedOrRemoved) : false;

            if (isMessagePreviousLaterThanAcquiredNumberDate || isMessagePreviousLaterThanBlockedDate) {
                // date is later than acquired number date OR blocked or removed match date, thus should no longer add reminder item.
                return;
            }

            if (index === 0) {
                previousMessage = message;
            } else {

                if (DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(new Date(previousMessage.datetime).getTime(), new Date(message.datetime).getTime(), this.minDaysBetweenReminders)) {
                    if (previousMessage.author === MessageAuthorEnum.Me && message.author === MessageAuthorEnum.Me) {
                        reminderAmountList.push({
                            number: reminderAmount,
                            datetimeMyLastMessage: previousMessage.datetime,
                            datetimeReminderSent: message.datetime,
                            textContentReminder: message.message,
                            hasGottenReply: list[(index + 1)]?.author === MessageAuthorEnum.Match ? true : false
                        });
                        reminderAmount = reminderAmount + 1;
                    }
                }

                previousMessage = message;
            }
        });

        return reminderAmountList;
    }
}