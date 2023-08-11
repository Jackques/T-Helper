import { HappnConversation } from "src/content/interfaces/http-requests/MatchesListHappn.interface";
import { DateHelper, DateHelperTimeStamp } from "../util/dateHelper";
import { Message, MessageAuthorEnum } from "../../../message.interface";
import { GhostStatus } from "../data/dataItems/dataItemGhost";
import { ghostMoment } from "src/content/interfaces/data/ghostMoment.interface";
import { Match } from "src/content/interfaces/http-requests/MatchesListTinder.interface";
import { TinderMessage } from "src/content/interfaces/http-requests/MessagesListTinder.interface";
import { DataField, DataFieldMessages } from "../data/dataField";
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { ParsedResultMatch } from "src/content/interfaces/controllers/ParsedResultMatch.interface";
import { Reminder } from "../util/NeedsReminder";

export class MatchDataParser {

    public static  parseMatchDataToDataRecordValues(nameController: string, dataFields: DataField[] | DataFieldMessages[], match?: ParsedResultMatch, systemId?: string): DataRecordValues[] {
        const dataRecordValuesList: DataRecordValues[] = [];
        const messagesDataField = dataFields[2] as DataFieldMessages;

        const happnMatch = match?.match as HappnConversation;

        if (match && match.matchMessages.length > 0) {
            const retrievedMessagesFromMatch = match.matchMessages as TinderMessage[];
            messagesDataField.updateMessagesList(this.convertTinderMessagesForDataRecord(retrievedMessagesFromMatch, happnMatch.participants[1].user.id))
        }

        const dateAcquiredNumber: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-acquired-number')?.getValue() as string | null;
        const dateBlockedOrRemoved: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-unmatch')?.getValue() as string | null;

        const reminder: Reminder = new Reminder(messagesDataField.getAllMessages(), dateAcquiredNumber, dateBlockedOrRemoved, new Date().getTime());

        dataFields.forEach((dataField, index, dataFields) => {
            switch (dataField.title) {
                case 'System-no': {
                    if (!match) {
                        break;
                    }
                    dataRecordValuesList.push({
                        'label': 'System-no', 'value': {
                            'appType': nameController,
                            'id': match && happnMatch && happnMatch.id ? happnMatch.id : systemId,
                            'tempId': happnMatch.participants[1].user.id ? happnMatch.participants[1].user.id : ''
                        }
                    });
                    break;
                }
                case 'No':
                    dataRecordValuesList.push({
                        'label': 'No',
                        'value': dataField.getValue() ? dataField.getValue() : undefined
                    });
                    break;
                case 'Last-updated':
                    dataRecordValuesList.push({ 'label': 'Last-updated', 'value': new Date().toISOString() });
                    break
                case 'Date-liked-or-passed':
                    dataRecordValuesList.push({ 'label': 'Date-liked-or-passed', 'value': dataField.getValue() ? dataField.getValue() : null });
                    break;
                case 'Name':
                    dataRecordValuesList.push({
                        'label': 'Name',
                        'value': match ? happnMatch.participants[1].user.first_name : dataField.getValue()
                    });
                    break;
                case 'Age':
                    dataRecordValuesList.push({
                        'label': 'Age',
                        'value': dataField.getValue() ? dataField.getValue() : this._getHappnAge(happnMatch)
                    });
                    break;
                case 'City':
                    dataRecordValuesList.push({
                        'label': 'City',
                        'value': dataField.getValue() ? dataField.getValue() : null
                    });
                    break;
                case 'Job': {
                    const jobFromProfile = match?.addedProperties.getPersonGenericPropertyByKey('Job')?.value ? match?.addedProperties.getPersonGenericPropertyByKey('Job')?.value : '';
                    dataRecordValuesList.push({
                        'label': 'Job',
                        'value': dataField.getValue() ? dataField.getValue() : jobFromProfile,
                    });
                    break;
                }
                case 'Seems-fake':
                    dataRecordValuesList.push({
                        'label': 'Seems-fake',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;
                case 'Seems-empty':
                    dataRecordValuesList.push({
                        'label': 'Seems-empty',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;

                case 'Has-profiletext': {
                    const profileTextFromProfile = match?.addedProperties.getPersonGenericPropertyByKey('Bio')?.value ? match?.addedProperties.getPersonGenericPropertyByKey('Bio')?.value as string : '';
                    dataRecordValuesList.push({
                        'label': 'Has-profiletext',
                        'value': dataField.getValue() ? dataField.getValue() : (profileTextFromProfile.length > 0 ? true : false)
                    });
                    break;
                }
                case 'Has-usefull-profiletext':
                    dataRecordValuesList.push({ 'label': 'Has-usefull-profiletext', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break;
                case 'Gender':
                    dataRecordValuesList.push({ 'label': 'Gender', 'value': happnMatch.participants[1].user.gender ? this.getGender(happnMatch.participants[1].user.gender) : dataField.getValue() });
                    break;
                case 'Is-verified': {
                    const verificationFromProfile = match?.addedProperties.getPersonGenericPropertyByKey('Verification')?.value ? match?.addedProperties.getPersonGenericPropertyByKey('Verification')?.value as boolean : null;

                    dataRecordValuesList.push({
                        'label': 'Is-verified',
                        'value': dataField.getValue() ? dataField.getValue() : verificationFromProfile
                    });
                    break;
                }
                case 'Type-of-match-or-like': {
                    const typeOfMatchFromProfile = match?.addedProperties.getPersonGenericPropertyByKey('Type-of-match-or-like')?.value ? match?.addedProperties.getPersonGenericPropertyByKey('Type-of-match-or-like')?.value as string : '';

                    dataRecordValuesList.push({
                        'label': 'Type-of-match-or-like',
                        'value': dataField.getValue() ? dataField.getValue() : typeOfMatchFromProfile
                    });
                    break;
                }
                case 'Liked-me-first-is-instant-match': {
                    dataRecordValuesList.push({
                        'label': 'Liked-me-first-is-instant-match',
                        'value': dataField.getValue() || dataField.getValue() === null ? dataField.getValue() : false
                    });
                    break;
                }
                case 'Is-gold-match': {
                    dataRecordValuesList.push({
                        'label': 'Is-gold-match',
                        'value': dataField.getValue() || dataField.getValue() === null ? dataField.getValue() : false
                    });
                    break;
                }
                case 'Needs-profile-update': {
                    const needsProfileUpdate = match?.addedProperties.getPersonGenericPropertyByKey('needsProfileDetailsUpdate')?.value;

                    dataRecordValuesList.push({
                        'label': 'Needs-profile-update',
                        // 'value': dataField.getValue() ? dataField.getValue() : false
                        'value': needsProfileUpdate ? needsProfileUpdate : false
                    });
                    break;
                }
                case 'Needs-messages-update': {
                    const needsMessagesUpdate = match?.addedProperties.getPersonGenericPropertyByKey('needsMessagesUpdate')?.value;

                    dataRecordValuesList.push({
                        'label': 'Needs-messages-update',
                        // 'value': dataField.getValue() ? dataField.getValue() : false
                        'value': needsMessagesUpdate ? needsMessagesUpdate : false
                    });
                    break;
                }
                case 'Needs-reminder': {
                    dataRecordValuesList.push({
                        'label': 'Needs-reminder',
                        'value': messagesDataField.hasMessages() ? reminder.getNeedsReminder(messagesDataField.getAllMessages()) : false
                    });
                    break;
                }
                case 'Amount-of-pictures': {
                    const picturesAmountFromProfile = match?.addedProperties.getPersonGenericPropertyByKey('Amount-of-pictures')?.value ? match?.addedProperties.getPersonGenericPropertyByKey('Amount-of-pictures')?.value as number : null;

                    dataRecordValuesList.push({
                        'label': 'Amount-of-pictures',
                        'value': dataField.getValue() ? dataField.getValue() : picturesAmountFromProfile
                    });
                    break;
                }
                case 'Attractiveness-score':
                    dataRecordValuesList.push({ 'label': 'Attractiveness-score', 'value': dataField.getValue() || dataField.getValue() === 0 ? dataField.getValue() : null });
                    break;
                case 'Details-tags': {
                    const currentValue = dataField.getValue() as Array<unknown>;
                    dataRecordValuesList.push({ 'label': 'Details-tags', 'value': currentValue && currentValue.length > 0 ? dataField.getValue() : [] });
                    break;
                }
                case 'Vibe-tags': {
                    const currentValue = dataField.getValue() as Array<unknown>;
                    dataRecordValuesList.push({ 'label': 'Vibe-tags', 'value': currentValue && currentValue.length > 0 ? dataField.getValue() : [] });
                    break;
                }
                case 'Seems-to-be-active': {
                    const hasMatchGivenResponse = this._hasMatchGivenResponse(messagesDataField.getAllMessages());
                    dataRecordValuesList.push({ 'label': 'Seems-to-be-active', 'value': dataField.getValue() || hasMatchGivenResponse ? true : false });
                    break;
                }
                case 'Did-i-like':
                    dataRecordValuesList.push({ 'label': 'Did-i-like', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break;
                case 'Is-match':
                    // if match.match.person is valid, then it is obviously a match, if not it's probably false thus use the value this field already has.
                    dataRecordValuesList.push({ 'label': 'Is-match', 'value': match?.match?.id ? true : dataField.getValue() });
                    break;
                case 'Date-match':
                    dataRecordValuesList.push({
                        'label': 'Date-match',
                        'value': match ? happnMatch.creation_date : dataField.getValue()
                    });
                    break;
                case 'Match-sent-first-message': {
                    dataRecordValuesList.push({
                        'label': 'Match-sent-first-message',
                        'value': messagesDataField.hasMessages() ? this._hasMatchSentFirstMessage(messagesDataField.getAllMessages()) : null
                    });
                    break;
                }
                case 'Match-responded':
                    dataRecordValuesList.push({ 'label': 'Match-responded', 'value': messagesDataField.hasMessages() ? this._hasMatchGivenResponse(messagesDataField.getAllMessages()) : null });
                    break;
                case 'Conversation-exists':
                    dataRecordValuesList.push({
                        'label': 'Conversation-exists',
                        'value': messagesDataField.hasMessages() ? this._hasConversation(messagesDataField.getAllMessages()) : null
                    });
                    break;
                case 'Vibe-conversation':
                    dataRecordValuesList.push({ 'label': 'Vibe-conversation', 'value': dataField.getValue() || dataField.getValue() === 0 ? dataField.getValue() : null });
                    break;
                case 'How-many-ghosts': {

                    // const dateAcquiredNumber: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-acquired-number')?.getValue() as string | null;
                    // const dateBlockedOrRemoved: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-unmatch')?.getValue() as string | null;

                    dataRecordValuesList.push({
                        'label': 'How-many-ghosts',
                        'value': messagesDataField.hasMessages() ? this._getNumberOfGhosting(messagesDataField.getAllMessages(), match && match.match ? match.match : undefined, dateAcquiredNumber, dateBlockedOrRemoved) : []
                    });
                    break;
                }
                case 'Acquired-number':
                    dataRecordValuesList.push({ 'label': 'Acquired-number', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Response-speed':
                    dataRecordValuesList.push(
                        {
                            'label': 'Response-speed',
                            'value': messagesDataField.hasMessages() ? this._getResponseSpeedMoments(messagesDataField.getAllMessages()) : []
                        });
                    break;
                case 'Reminders-amount': {

                    // const dateAcquiredNumber: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-acquired-number')?.getValue() as string | null;
                    // const dateBlockedOrRemoved: string | null = dataFields.find((dataField: DataField) => dataField.title === 'Date-of-unmatch')?.getValue() as string | null;

                    dataRecordValuesList.push(
                        {
                            'label': 'Reminders-amount',
                            // 'value': messagesDataField.hasMessages() ? this._getReminderAmount(messagesDataField.getAllMessages(), dateAcquiredNumber, dateBlockedOrRemoved) : []
                            'value': messagesDataField.hasMessages() ? reminder.getReminderAmountItems() : []
                        });
                }
                    break;
                case 'Match-wants-no-contact':
                    dataRecordValuesList.push({ 'label': 'Match-wants-no-contact', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Interested-in-sex':
                    dataRecordValuesList.push({ 'label': 'Interested-in-sex', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Potential-click':
                    dataRecordValuesList.push({ 'label': 'Potential-click', 'value': dataField.getValue() || dataField.getValue() === false ? dataField.getValue() : null });
                    break
                case 'Why-i-removed': {
                    const currentValue = dataField.getValue() as Array<unknown>;
                    dataRecordValuesList.push({ 'label': 'Why-i-removed', 'value': currentValue && currentValue.length > 0 ? dataField.getValue() : [] });
                    break;
                }
                case 'Did-i-unmatch':
                    dataRecordValuesList.push({
                        'label': 'Did-i-unmatch',
                        'value': dataField.getValue() ? dataField.getValue() : false
                    });
                    break;
                case 'School': {
                    const schoolFromProfile = match?.addedProperties.getPersonGenericPropertyByKey('School')?.value ? match?.addedProperties.getPersonGenericPropertyByKey('School')?.value as string : null;

                    dataRecordValuesList.push({
                        'label': 'School',
                        'value': dataField.getValue() ? dataField.getValue() : schoolFromProfile
                    });
                    break;
                }
                case 'Notes':
                    dataRecordValuesList.push({ 'label': 'Notes', 'value': dataField.getValue() ? dataField.getValue() : '' });
                    break;

                default:
                    if (!dataField.emptyFieldAllowed) {
                        console.warn(`DataField: ${dataField.title} does not have an inplementation in TinderController thus could not be resolved`);
                    }
                    break;
            }
        });
        return dataRecordValuesList;
    }

    public static convertTinderMessagesForDataRecord(matchMessages: TinderMessage[], matchPersonId: string): Message[] {
        const messagesForDataRecord: Message[] = [];
        matchMessages.forEach((matchMessage) => {

            const datetime = (matchMessage: TinderMessage) => {
                if (DateHelper.isValidDate(matchMessage.sent_date)) {
                    return matchMessage.sent_date;
                }
                if (DateHelper.isValidDate(matchMessage.created_date)) {
                    return matchMessage.created_date;
                }
                if (DateHelper.isValidDate(new Date(matchMessage.timestamp).toISOString())) {
                    return new Date(matchMessage.timestamp).toISOString();
                }
                console.error(`Failed to get proper datetime for message`);
                return '';
            };

            messagesForDataRecord.push(
                {
                    message: matchMessage.message,
                    datetime: datetime(matchMessage),
                    author: matchMessage.from === 'me' ? MessageAuthorEnum.Me : MessageAuthorEnum.Match
                }
            );
        });
        return messagesForDataRecord;
    }

    private static _getResponseSpeedMoments(matchMessages: Message[]): any[] {
        const responseSpeedMoments: any = [];

        // if there are no messages from the other person at all, return 0
        if (!matchMessages.some(message => message.author === MessageAuthorEnum.Match)) {
            return responseSpeedMoments;
        }

        matchMessages.forEach((currentMessage: Message, index: number, messagesList: Message[]) => {
            const nextMessage: Message | undefined = (index + 1) < (messagesList.length - 1) ? messagesList[index + 1] : undefined;
            // if the first message is from me, and the second message is from the other person

            // total messagesList (existing items) is 89
            // if 88, index + 1 = 89, messageList (90)-1 = 89 = gets the 89th message
            // if 89 (last item) + 1 = 90, messageList is (90)-1 = 89, item is NOT less than messageList, thus undefined

            if (!nextMessage) {
                return;
            }

            if (currentMessage.author !== MessageAuthorEnum.Match && nextMessage.author === MessageAuthorEnum.Match) {
                // get the difference between these two moments in datetime

                // add this datetime to the list
                responseSpeedMoments.push({
                    datetimeMyLastMessage: currentMessage.datetime,
                    datetimeTheirResponse: nextMessage.datetime,
                    // get the difference in MS between the following received message received from my match and my previously sent message
                    differenceInMS: new Date(nextMessage.datetime).getTime() - new Date(currentMessage.datetime).getTime()
                });

            }
        });

        return responseSpeedMoments;
    }

    private static _getNumberOfGhosting(matchMessages: Message[], match?: Match | HappnConversation, dateAcquiredNumber?: string | null, dateBlockedOrRemoved?: string | null): ghostMoment[] {

        let amountOfGhosts = 0;
        const ghostsList: ghostMoment[] = [];

        // if there are no messages from the other person at all, return 0
        if (!matchMessages.some(message => message.author === MessageAuthorEnum.Match)) {
            return ghostsList;
        }

        matchMessages.reduce((formerMessage, laterMessage) => {

            // 1. is there 2 days or more in between my last message and her reply message? = ghost moment
            // if(myMessage.from !== matchPersonId && matchMessageReply.from === matchPersonId){

            const isMatchMessageLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(formerMessage.datetime, dateAcquiredNumber) : false;
            const isMyMessageLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(laterMessage.datetime, dateAcquiredNumber) : false;
            if (isMatchMessageLaterThanAcquiredNumberDate || isMyMessageLaterThanAcquiredNumberDate) {
                // date is later thasn acquired number date, thus should no longer add ghostMoments.
                return laterMessage;
            }

            const isMatchMessageLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(formerMessage.datetime, dateBlockedOrRemoved) : false;
            const isMyMessageLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(laterMessage.datetime, dateBlockedOrRemoved) : false;
            if (isMatchMessageLaterThanBlockedDate || isMyMessageLaterThanBlockedDate) {
                // date is later than blocked or removed date, thus should no longer add ghostMoments.
                return laterMessage;
            }

            const matchMessageReplyTimeStamp = new Date(laterMessage.datetime).getTime();
            const myMessageTimeStamp = new Date(formerMessage.datetime).getTime();

            const isGhostMoment = DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(myMessageTimeStamp, matchMessageReplyTimeStamp, 2);
            //todo: What if I ghost her!? she sends me message after message.. will get registered as a ghost moment..
            if (isGhostMoment) {
                ghostsList.push(
                    {
                        number: amountOfGhosts,
                        timeSinceLastMessageMS: matchMessageReplyTimeStamp - myMessageTimeStamp,
                        status: laterMessage.author === MessageAuthorEnum.Match ? GhostStatus.REPLIED : GhostStatus.NOT_REPLIED_TO_REMINDER
                    }
                );
                amountOfGhosts = amountOfGhosts + 1;
            }

            return laterMessage;
        });

        // 2. is the last message sent from me AND is it older or equal than 2 days?  = ghost moment
        const lastMessage: Message = matchMessages[matchMessages.length - 1];
        const lastMessageTimeStamp = new Date(lastMessage.datetime).getTime();

        const isLastMessageLaterThanAcquiredNumberDate: boolean = dateAcquiredNumber ? DateHelper.isDateLaterThanDate(lastMessage.datetime, dateAcquiredNumber) : false;
        const isLastMessageLaterThanBlockedDate: boolean = dateBlockedOrRemoved ? DateHelper.isDateLaterThanDate(lastMessage.datetime, dateBlockedOrRemoved) : false;

        if (dateBlockedOrRemoved && dateBlockedOrRemoved.length > 0) {
            const lastGhostMoment = ghostsList.pop();
            if (lastGhostMoment && lastGhostMoment.status === GhostStatus.NOT_REPLIED_TO_REMINDER) {
                lastGhostMoment.status = GhostStatus.BLOCKED;
                ghostsList.push(lastGhostMoment);
            }
        }

        if (isLastMessageLaterThanAcquiredNumberDate || isLastMessageLaterThanBlockedDate) {
            // lastMessage date is later than blocked or removed date, thus should no longer add ghostMoments.
            return ghostsList;
        }

        if (lastMessage.author !== MessageAuthorEnum.Match && DateHelperTimeStamp.isDateBetweenGreaterThanAmountOfDays(lastMessageTimeStamp, new Date().getTime(), 2)) {
            ghostsList.push(
                {
                    number: amountOfGhosts,
                    timeSinceLastMessageMS: new Date().getTime() - lastMessageTimeStamp,
                    status: GhostStatus.NOT_REPLIED
                }
            );
            amountOfGhosts = amountOfGhosts + 1;
        }

        return ghostsList;
    }

    private static _hasConversation(matchMessages: Message[]): boolean {
        // if i sent at least 3 messages
        // if person sent 3 messages in return
        // my messages must be somewhere in between the other person's messages

        /*
        if i have sent her a message, and another one..(2 me),
        10 messages in total..

        check if i sent her a message (or vice versa), ignore other messages afetrwards from the same sender (a.1)
        then check if she sent me a message (or vice versa), ignore other messages afterwards from the same sender (b.1),

        afterwards check if i replied to her message (or vice versa), ignore other messages afterwards from the same sender (a.2)
        then check if she sent me a message (or vice versa), ignore other messages aterwards from the same sender (b.2),

        do the same untill you reach (a.3) and (b.3).
        If result is a.3 && b.3 return true, otherwise return false
        */
        let amountMessagesSentByMe = 0;
        let amountMessagesSentByOther = 0;

        let lastRespondent: MessageAuthorEnum;

        matchMessages.forEach((message, index) => {
            // determine the sender of the first message
            if (index === 0) {
                if (message.author === MessageAuthorEnum.Match) {
                    amountMessagesSentByOther = amountMessagesSentByOther + 1;
                } else {
                    amountMessagesSentByMe = amountMessagesSentByMe + 1;
                }
                lastRespondent = message.author;
            }

            // determine if the next message after the first is from different sender
            if (index !== 0 && message.author !== lastRespondent) {
                if (message.author === MessageAuthorEnum.Match) {
                    amountMessagesSentByOther = amountMessagesSentByOther + 1;
                } else {
                    amountMessagesSentByMe = amountMessagesSentByMe + 1;
                }
                lastRespondent = message.author;
            }

        });
        if (amountMessagesSentByMe >= 3 && amountMessagesSentByOther >= 3) {
            return true;
        } else {
            return false;
        }
    }

    private static _hasMatchGivenResponse(matchMessages: Message[]): boolean {
        return matchMessages.some((matchMessage) => {
            return matchMessage.author === MessageAuthorEnum.Match;
        });
    }

    private static _hasMatchSentFirstMessage(matchMessages: Message[]): boolean {
        return matchMessages[0].author === MessageAuthorEnum.Match ? true : false;
    }

    // private _isVerifiedMatch(badgesList: Badges[]): boolean {
    //     if (badgesList.length > 0) {
    //         return badgesList.some((badge) => {
    //             return badge.type === "selfie_verified";
    //         });
    //     } else {
    //         return false;
    //     }
    // }

    public static getGender(genderString: string): string {
        switch (genderString) {
            case "FEMALE":
            case "Female":
            case "female":
                return 'Female';
            case "MALE":
            case "Male":
            case "male":
                return 'Male';
            default:
                console.warn(`Tried to get gender by genderCode but genderCode was not recognized: ${genderString}. Thus "Other" was inserted. Checking & updating genderCodes may be advised.`);
                return 'Other';
        }
    }

    // private _convertDistanceMilesToKM(distance_mi: number): number {
    //     return (distance_mi * 1.6);
    // }

    public static _getHappnAge(happnMatch: HappnConversation): number {
        const match = happnMatch?.participants[1]?.user;
        if (match.age) {
            return match.age;
        } else if (match.birth_date) {
            return DateHelper.getAgeFromBirthDate(match.birth_date);
        } else {
            console.warn(`Could not get age nor birth_date from match: ${match.first_name}. Please check the code & api response.`);
            return NaN;
        }
    }

    // private _getTypeOfMatchAndLike(matchDetailsResults: Match): string[] {
    //     const matchOrLikeStringsList: string[] = [];

    //         if(matchDetailsResults.is_boost_match){
    //             matchOrLikeStringsList.push('boost_match');
    //         }
    //         if(matchDetailsResults.is_experiences_match){
    //             matchOrLikeStringsList.push('experiences_match');
    //         }
    //         if(matchDetailsResults.is_fast_match){
    //             matchOrLikeStringsList.push('fast_match');
    //         }
    //         if(matchDetailsResults.is_super_boost_match){
    //             matchOrLikeStringsList.push('super_boost_match');
    //         }
    //         if(matchDetailsResults.is_super_like){
    //             matchOrLikeStringsList.push('super_like_match');
    //         }
    //         if(matchDetailsResults.super_liker && typeof matchDetailsResults.super_liker === 'string'){
    //             if (matchDetailsResults.super_liker === matchDetailsResults.person._id) {
    //                 matchOrLikeStringsList.push('match_sent_me_superlike');
    //             } else {
    //                 matchOrLikeStringsList.push('i_sent_match_superlike');
    //             }
    //         }

    //     return matchOrLikeStringsList;
    // }

    // private _getInterests(selectedInterests: Record<string, string>[]): string[] {
    //     const hasRecognizedStructure = selectedInterests.every((selectedInterest) => Object.prototype.hasOwnProperty.call(selectedInterest, "name") && selectedInterest['name'].length > 0 ? true : false);
    //     if (hasRecognizedStructure) {
    //         return selectedInterests.map((selectedinterest) => {
    //             return selectedinterest['name'] as string;
    //         });
    //     }
    //     console.warn(`Could not get interests as the received interests array does not match the recognized structure required. Check the interests received.`);
    //     return [];
    // }
}