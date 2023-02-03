import { reminderAmountItem } from "src/content/interfaces/data/reminderAmountItem.interface";
import { Message, MessageAuthorEnum } from "../../../message.interface";
import { DateHelper, DateHelperTimeStamp } from "./dateHelper";

export class Reminder {

    private maxNumberReminders = 3; // if I sent a match a maximum of 3 reminder over a long period of time, EVEN IF she responded at some point, do not send any more reminders
    private minDaysBetweenReminders = 3;
    private reminderAmountItem: reminderAmountItem[] = [];
    private dateAcquiredNumber: string | null = null;
    private dateBlockedOrRemoved: string | null = null;

    constructor(messages: Message[], dateAcquiredNumber: string | null, dateBlockedOrRemoved: string | null) {
        this.reminderAmountItem = this._getReminderAmount(messages, dateAcquiredNumber, dateBlockedOrRemoved);
        this.dateAcquiredNumber = dateAcquiredNumber;
        this.dateBlockedOrRemoved = dateBlockedOrRemoved;
    }

    public getNeedsReminder(messages: Message[] | undefined): boolean {
        // eslint-disable-next-line no-debugger
        // debugger;

        if (messages === undefined) {
            console.error(`Could not read tinder messages for this match. Expected an array of tinder messages but received: ${messages}`);
            return false;
        }

        // match does not need a reminder IF we did not exchange any messages, i acquired the number, the match has been blocked or removed, the amount of reminders is greater than or equal to the max amount of reminders
        if (messages.length <= 0 || this.dateAcquiredNumber || this.dateBlockedOrRemoved || this.reminderAmountItem.length >= this.maxNumberReminders) {
            return false;
        }

        // if has total of 3 reminders/messages EACH seperated by at least 2-3 days, return false
        if (this.isLastReminderOverdue()) {
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
        if (this.reminderAmountItem.length <= 0) {
            return false;
        }
        const lastReminder = this.reminderAmountItem[this.reminderAmountItem.length - 1];
        if (DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(new Date(lastReminder.datetimeReminderSent).getTime(), new Date().getTime(), this.minDaysBetweenReminders)) {
            return true;
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

        // old code to get reminders & type of reminders with
        // matchMessages.reduce((messagePrevious, messageNext, currentIndex, messageList) => {

        //     const isMessagePreviousLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(messagePrevious.datetime, dateAcquiredNumber) : false;
        //     const isMessagePreviousLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(messagePrevious.datetime, dateBlockedOrRemoved) : false;

        //     if(isMessagePreviousLaterThanAcquiredNumberDate || isMessagePreviousLaterThanBlockedDate){
        //         // date is later than acquired number date OR blocked or removed match date, thus should no longer add reminder item.
        //         return messageNext;
        //     }

        //     // 1. is there 2 days or more in between my last message and my other message? AND my match sent no message in between? = ghost moment
        //     if (messagePrevious.author !== MessageAuthorEnum.Match && messageNext.author !== MessageAuthorEnum.Match) {
        //         if (DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(new Date(messagePrevious.datetime).getTime(), new Date(messageNext.datetime).getTime(), 2)) {

        //             reminderAmountList.push({
        //                 number: reminderAmount,
        //                 datetimeMyLastMessage: messagePrevious.datetime,
        //                 datetimeReminderSent: messageNext.datetime,
        //                 textContentReminder: messageNext.message,
        //                 hasGottenReply: messageList[(currentIndex + 1)]?.author === MessageAuthorEnum.Match ? true : false
        //             });
        //             reminderAmount = reminderAmount + 1;
        //         }
        //     }
        //     return messageNext;
        // });

        matchMessages.forEach((message: Message, index: number, list: Message[]) => {

            const isMessagePreviousLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(message.datetime, dateAcquiredNumber) : false;
            const isMessagePreviousLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(message.datetime, dateBlockedOrRemoved) : false;

            if (isMessagePreviousLaterThanAcquiredNumberDate || isMessagePreviousLaterThanBlockedDate) {
                // date is later than acquired number date OR blocked or removed match date, thus should no longer add reminder item.
                return;
            }

            // 1. skip first message? or check if first message if from me or match? maybe wanna do something with that info? might leave a todo for this.
            // DO HOWEVER; save this message as previous message in local variabele
            if (index === 0) {
                previousMessage = message;
            } else {
                // 2. check if, current message is later than > 2 days from previous message, check if last message is from me or match.. 
                // if from me, and current message is also from me, add this message as reminder
                // if next message is from match, set hasGottenReply to true on the reminder
                // if from match, do nothing 

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

                // 3. set current message as previous message
                previousMessage = message;
            }
        });

        return reminderAmountList;
    }
}