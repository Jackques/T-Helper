import { reminderAmountItem } from "src/content/interfaces/data/reminderAmountItem.interface";
import { Message, MessageAuthorEnum } from "../../../message.interface";
import { DateHelper, DateHelperTimeStamp } from "./dateHelper";

export class Reminder {

    private maxNumberReminders = 2;
    private minDaysBetweenReminders = 3;
    private reminderAmountItem: reminderAmountItem[] = [];
    private dateAcquiredNumber: string | null = null;
    private dateBlockedOrRemoved: string | null = null;

    constructor(messages: Message[], dateAcquiredNumber: string | null, dateBlockedOrRemoved: string | null){
        this.reminderAmountItem = this._getReminderAmount(messages, dateAcquiredNumber, dateBlockedOrRemoved);
        this.dateAcquiredNumber = dateAcquiredNumber;
        this.dateBlockedOrRemoved = dateBlockedOrRemoved;
    }

    public getNeedsReminder(messages: Message[] | undefined): boolean {
        // eslint-disable-next-line no-debugger
        // debugger;

        if(messages === undefined){
            console.error(`Could not read tinder messages for this match. Expected an array of tinder messages but received: ${messages}`);
            return false;
        }

        // match does not need a reminder IF we did not exchange any messages, i acquired the number, the match has been blocked or removed, the amount of reminder is greater than or equal to the max amount of reminders
        if(messages.length <= 0 || this.dateAcquiredNumber || this.dateBlockedOrRemoved || this.reminderAmountItem.length >= this.maxNumberReminders){
            return false;
        }

        // if has total of 3 reminders/messages EACH seperated by at least 2-3 days, return false
        if(this.isLastReminderOverdue()){
            return true;
        }
        // if last reminder has been 2-3 days ago. return true;
        // console.log('%c ' + 'check out my reminders list below me!', 'color: green; font-weight:bold') 
        // console.dir(this.reminderAmountItem);

        return false;
    }

    public getReminderAmountItems(): reminderAmountItem[] {
        return this.reminderAmountItem;
    }

    private isLastReminderOverdue(): boolean {
        const lastReminder = this.reminderAmountItem[this.reminderAmountItem.length - 1];
        if(DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(new Date(lastReminder.datetimeReminderSent).getTime(), new Date().getTime(), this.minDaysBetweenReminders)){
            return true;
        }
        return false;
    }

    private _getReminderAmount(matchMessages: Message[], dateAcquiredNumber: string | null, dateBlockedOrRemoved: string | null): reminderAmountItem[] {
        const reminderAmountList: reminderAmountItem[] = [];
        let reminderAmount = 0;

        if(matchMessages.length <= 0){
            return reminderAmountList;
        }

        matchMessages.reduce((messagePrevious, messageNext, currentIndex, messageList) => {

            const isMessagePreviousLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(messagePrevious.datetime, dateAcquiredNumber) : false;
            const isMessagePreviousLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(messagePrevious.datetime, dateBlockedOrRemoved) : false;

            if(isMessagePreviousLaterThanAcquiredNumberDate || isMessagePreviousLaterThanBlockedDate){
                // date is later than acquired number date OR blocked or removed match date, thus should no longer add reminder item.
                return messageNext;
            }

            // 1. is there 2 days or more in between my last message and my other message? AND my match sent no message in between? = ghost moment
            if (messagePrevious.author !== MessageAuthorEnum.Match && messageNext.author !== MessageAuthorEnum.Match) {
                if (DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(new Date(messagePrevious.datetime).getTime(), new Date(messageNext.datetime).getTime(), 2)) {

                    reminderAmountList.push({
                        number: reminderAmount,
                        datetimeMyLastMessage: messagePrevious.datetime,
                        datetimeReminderSent: messageNext.datetime,
                        textContentReminder: messageNext.message,
                        hasGottenReply: messageList[(currentIndex + 1)]?.author === MessageAuthorEnum.Match ? true : false
                    });
                    reminderAmount = reminderAmount + 1;
                }
            }
            return messageNext;
        });

        return reminderAmountList;
    }
}