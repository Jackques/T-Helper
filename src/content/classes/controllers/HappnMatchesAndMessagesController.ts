import { ParsedResultMatch } from "src/content/interfaces/controllers/ParsedResultMatch.interface";
import { DataTable } from "../data/dataTable";
import { RequestHandlerHappn } from "../http-requests/requestHandlerHappn";
import { HappnConversation } from "src/content/interfaces/http-requests/MatchesListHappn.interface";
import { DataRecord } from "../data/dataRecord";
import { DataField, DataFieldMessages } from "../data/dataField";
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { MessagesHappn } from "src/content/interfaces/http-requests/MessagesHappn.interface";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { TinderMessage } from "src/content/interfaces/http-requests/MessagesListTinder.interface";
import { MatchProfileDetailsHappn } from "src/content/interfaces/http-requests/MatchProfileDetailsHappn.interface";
import { Match } from "src/content/interfaces/http-requests/MatchesListTinder.interface";
import { Reminder } from "../util/NeedsReminder";
import { Message, MessageAuthorEnum } from "../../../message.interface";
import { DateHelper, DateHelperTimeStamp } from "../util/dateHelper";
import { ghostMoment } from "src/content/interfaces/data/ghostMoment.interface";
import { GhostStatus } from "../data/dataItems/dataItemGhost";

export class HappnMatchesAndMessagesController {

    private nameController = 'happn';
    private requestHandler: RequestHandlerHappn;
    private dataTable: DataTable;

    constructor(requestHandler: RequestHandlerHappn, dataTable: DataTable, nameController: string){
        this.requestHandler = requestHandler;
        this.dataTable = dataTable;
        this.nameController = nameController;

        if (!this.requestHandler || !this.dataTable || !this.nameController) {
            throw new Error(`test`);
        }
    }

    // only method allowed to be public!
    public refreshDataTableMatchesAndMatchMessages(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Gather data (by api's OR (less preferably) DOM)
            this.getMatches()?.then(async (matches: ParsedResultMatch[] | null) => {

                console.log(`Matches & match messages:`);
                console.dir(matches);

                // eslint-disable-next-line no-debugger
                // debugger;

                if (matches === null) {
                    console.error(`Could not retrieve matches`);
                    return reject();
                }

                for (let i = 0; i <= (matches.length - 1); i++) {
                    const match = matches[i];
                    const systemIdMatch = this.dataTable.getRecordIndexBySystemId(match.match.id, this.nameController);
                    const dataRecord = this.dataTable.getRecordByRecordIndex(systemIdMatch);

                    // If profile/messages need update, then set need update to true. If datarecord is null (i.e. new record due to new match), always set to true
                    const profileNeedsUpdate = dataRecord?.getIfProfileDetailsNeedsUpdate();
                    const messagesNeedsUpdate = dataRecord?.getIfMessagesNeedsUpdate();

                    // Set profile needs update to true is this value has been previously set (manually by me or profile details has failed to retrieve its data previously)
                    if (profileNeedsUpdate) {
                        match.addedProperties.updatePersonProperty('needsProfileDetailsUpdate', true, 'true');
                    }

                    // Set messages needs update if this value has been previously set (manually by me or messages has failed to retrieve its data previously)
                    if (messagesNeedsUpdate) {
                        match.addedProperties.updatePersonProperty('needsMessagesUpdate', true, 'true');
                    }

                    // Set messages needs update if the value of the latest messages for this match differs from the value of the last messages stored in the data record
                    const happnConversation = match.match as HappnConversation;
                    const happnLastMessage = happnConversation.last_message?.message;
                    if (happnLastMessage) {
                        if (dataRecord !== null && !messagesNeedsUpdate) {
                            if (dataRecord?.getLatestMessage()?.message !== happnConversation.last_message.message) {
                                match.addedProperties.updatePersonProperty('needsMessagesUpdate', true, 'true');
                            }
                        }
                    }
                }

                console.log('I await');
                await this._addProfileDataMatchesHappn(matches);
                console.log(`50% complete..`);
                await this._addMessagesMatchesHappn(matches);
                console.log('I continue');

                this.updateDataTable(matches);

                this.setUnupdatedMatchesToBlocked(matches, this.dataTable).finally(() => {
                    console.log(`setUnupdatedMatchesToBlocked finally() START`);
                    // TODO TODO TODO: didn't I have a check on the tinder controller as well to check if messages needed to be updated? if so, then this code is still valid.
                    // if i get the messages per profile every time rergardless, then it is not valid.
                    // TODO TODO TODO: How exactly did my tinder matches get the status 'unupdated'? Shouldn't I implement this for my happn matches as well?
                    // TODO TODO TODO: How exactly did my tinder controller determine which match needed to update the messages? Shouldn't I implement this as well?
                    const dataRecordsWhereMessagesNeedToBeUpdated = this.dataTable.getAllDataRecordsWhereMessageNeedTobeUpdated();
                    if (dataRecordsWhereMessagesNeedToBeUpdated.length === 0) {
                        console.log(`NO DATA RECORDS NEED TO BE UPDATED`);
                        return resolve();
                    }

                    this.updateMessagesDataRecords(this.requestHandler, dataRecordsWhereMessagesNeedToBeUpdated, matches).then((hasMessagesBeenRetrieved) => {
                        console.log(`setUnupdatedMatchesToBlocked - this.updateMessageDataRecords finally() .then START`);

                        if (!hasMessagesBeenRetrieved) {
                            console.error(`Something went wrong with getting messages! Check the network logs.`);
                            return reject();
                        }

                        const dataRecords: DataRecord[] = this.dataTable.getAllDataRecords();
                        dataRecords.forEach((dataRecord) => {
                            const dataFields: DataField[] = dataRecord.getDataFields();

                            const systemId: string | null = dataRecord.getRecordPersonSystemId(this.nameController)
                            if (!systemId) {
                                console.warn(`Could not update dataRecord because record index could not be found due to not found system id: ${systemId}`);
                            } else {
                                const matchRecordIndex: number = this.dataTable.getRecordIndexBySystemId(systemId, this.nameController);
                                const tinderMatchDataRecordValues: DataRecordValues[] = this.parseMatchDataToDataRecordValues(dataFields, undefined, systemId);
                                this.dataTable.updateDataRecordByIndex(matchRecordIndex, tinderMatchDataRecordValues);
                            }
                        });

                        // return resolve(); // does this perhaps need to be put INSIDE the this.updateMessagesDataRecords?, nope doesnt help either.. try 1
                        console.log(`setUnupdatedMatchesToBlocked - this.updateMessageDataRecords finally() .then END`);
                    }).catch((error) => {
                        console.dir(error);
                        console.error(`Error occured getting matchMessages`);
                    }).finally(() => {
                        console.log(`And here is my data table:`);
                        console.dir(this.dataTable);
                    });
                    console.log(`setUnupdatedMatchesToBlocked finally() END`);


                });


                console.log(`getMatches() END`);
                return resolve(); // perhaps this will do the trick? try 2.. YES! THIS IS IT!
            }).catch((error) => {
                console.dir(error);
                console.error(`An error occured getting matches`);
            });
        });
    }

    private getMatches(): Promise<ParsedResultMatch[] | null> {
        return new Promise<ParsedResultMatch[] | null>((resolve, reject) => {
            if (!this.requestHandler) {
                reject(null);
            }
            this.requestHandler.getMatchesStart().then((matches: ParsedResultMatch[] | null) => {
                console.log(`Matches:`);
                console.dir(matches);

                if (matches && matches.length > 0) {
                    resolve(matches);
                } else {
                    reject(null);
                }
            });
        });
    }

    private _addMessagesMatchesHappn(matches: ParsedResultMatch[]): Promise<void> {
        // Get only the profiles which have been set to require an update
        const needsMessagesUpdateMatches: ParsedResultMatch[] = matches.filter((match) => {
            const result = match.addedProperties.getPersonGenericPropertyByPropName('needsMessagesUpdate')?.value;
            return result;
        });


        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolvedAllMessages, reject) => {
            for (let i = 0; i <= needsMessagesUpdateMatches.length - 1; i++) {
                const index = i;
                const match = needsMessagesUpdateMatches[index];
                const matchData = match.match as HappnConversation;
                const firstName = matchData.participants[1].user.first_name;

                console.log(`*** Getting MESSAGES for ${firstName}`);
                console.dir(matchData);
                // debugger;
                await new Promise<void>((resolvedMessages, reject) => {
                    this.requestHandler.getMatchMessages(matchData.id).then((result) => {
                        if (!result) {
                            match.addedProperties.updatePersonProperty('needsMessagesUpdate', true, 'true');
                            // console.log(`needsMessagesUpdate failure! thus set to true`);
                            // this._consoleColorLog(`needsMessagesUpdate failure! thus set to true`, 'red');
                        }

                        console.log(`I got yer MESSAGES for ${firstName} right here: `);
                        console.log(result);
                        this._updateParsedResultMatchWithMessages(match, result);

                        console.log(`*** Got MESSAGES for ${firstName}`);
                        match.addedProperties.updatePersonProperty('needsMessagesUpdate', false, 'false');
                        // console.log(`needsMessagesUpdate success! thus set to false`);
                        // this._consoleColorLog(`needsMessagesUpdate! thus set to false`, 'green');
                        resolvedMessages();
                    }).catch(() => {
                        match.addedProperties.updatePersonProperty('needsMessagesUpdate', true, 'true');
                        // console.log(`needsMessagesUpdate failure! thus set to true`);
                        // this._consoleColorLog(`needsMessagesUpdate failure! thus set to true`, 'red');
                    });
                });
            }
            resolvedAllMessages();
        });
    }

    private _updateParsedResultMatchWithMessages(parsedResultMatch: ParsedResultMatch, result: MessagesHappn): void {
        if(result.data.conversation.messages.edges.length >= 50){
            console.warn(`The messages for this conversation with ${parsedResultMatch.match.participants[1].user.name} has or exceeds 50 messages. Am I sure I am getting ALL the messages?`);
            ConsoleColorLog.singleLog(`The messages for this conversation with ${parsedResultMatch.match.participants[1].user.name} has or exceeds 50 messages. Am I sure I am getting ALL the messages?`, `Because I THINK I programmed tghe app in such a way that the first 50 messages are retrieved but if there are more than 50 messages it does not get those, thus those are lost (which would be a shame)`);
        }
        result.data.conversation.messages.edges.forEach((messageNode) => {
            const isMessengerMe = parsedResultMatch.match.participants[0].user.first_name === messageNode.node.sender.firstName;
            // if(isMessengerMe){
            //     console.log(`Yes! I am the sender of this message: ${messageNode.node.body}`);
            // }else{
            //     console.log(`No, i am not the sender of this message: ${messageNode.node.body}`);
            // }

            // for now i will use the TinderMessage interface because the ParsedResultMatch interface does not allow me to add multiple message interfaces for I would need to update every object i add to the list with similair properties
            // should probably want to refactor this for tinder + happn to 1 single interface (simply use Message interface?)
            const tinderMessageToConvert: TinderMessage = {
                _id: messageNode.node.id,
                match_id: parsedResultMatch.match.id,
                sent_date: messageNode.node.creationDate,
                message: messageNode.node.body,
                to: isMessengerMe ? 'match' : 'me',
                from: isMessengerMe ? 'me' : 'match',
                created_date: messageNode.node.creationDate,
                timestamp: new Date(messageNode.node.creationDate).getTime()
            };
            // diana personal id: 265882db-0bea-41a0-8d73-b71594bc128d"
            // "48d23184-6272-4244-865d-3ba4827f666a"

            // "c80ccd20-a193-11ed-9d4a-5d9e7dd210b0"
            // no personal nor conversation id matches the messages id! weirdddd! even the names are not safe!
            parsedResultMatch.matchMessages.push(tinderMessageToConvert);
        });
    }

    private _addProfileDataMatchesHappn(matches: ParsedResultMatch[]): Promise<void> {

        // Get only the profiles which have been set to require an update
        const needsProfileUpdateMatches: ParsedResultMatch[] = matches.filter((match) => match.addedProperties.getPersonGenericPropertyByPropName('needsProfileDetailsUpdate')?.value === true);

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolvedAllProfileDetails, reject) => {
            if (needsProfileUpdateMatches.length === 0) {
                resolvedAllProfileDetails();
            }
            for (let i = 0; i <= needsProfileUpdateMatches.length - 1; i++) {
                const index = i;
                const match = needsProfileUpdateMatches[index];
                const firstName = match.match.participants[1].user.first_name;
                console.log(`*** Getting result for ${firstName}`);

                const profileDetails = new Promise<boolean>((resolvedProfileDetail, reject) => {
                    this.requestHandler.getMatchProfileDetails(match.match.participants[1].user.id).then((result) => {
                        if (result.error !== null) {
                            console.warn(`Could not get profile data for ${firstName}`);
                            // console.log(`needsProfileDetailsUpdate failure! thus set to true`);
                            // this._consoleColorLog(`needsProfileDetailsUpdate failure! thus set to true`, 'red');
                            match.addedProperties.updatePersonProperty('needsProfileDetailsUpdate', true, 'true');
                            // return reject(false); // yes this is it! NOT calling reject here will prevent JS from executing! (or is it because i'm still calling resolve instead?.. test!..)
                            return resolvedProfileDetail(true);
                        }
                        console.log(`I got yer result (profile details) for ${firstName} right here: `);
                        console.log(result);
                        this._updateParsedResultMatchWithProfileDetails(match, result);

                        console.log(`*** Got result for ${firstName}`);
                        return resolvedProfileDetail(true);
                    }).catch(() => {
                        // console.log(`needsProfileDetailsUpdate failure! thus set to true`);
                        match.addedProperties.updatePersonProperty('needsProfileDetailsUpdate', true, 'true');
                        // this._consoleColorLog(`needsProfileDetailsUpdate! thus set to true`, 'red');
                    });
                });
                await profileDetails;
                console.log(`Succesfully retrtieved profile data for ${firstName}?: ${(await profileDetails).valueOf()}`);
                match.addedProperties.updatePersonProperty('needsProfileDetailsUpdate', false, 'false');
                // console.log(`needsProfileDetailsUpdate success! thus set to false`);
                // this._consoleColorLog(`needsProfileDetailsUpdate success! thus set to false`, 'green');
            }
            resolvedAllProfileDetails();
        });
    }

    private _updateParsedResultMatchWithProfileDetails(parsedResultMatch: ParsedResultMatch, result: MatchProfileDetailsHappn): void {
        parsedResultMatch.addedProperties.updatePersonProperty('Bio', result?.data?.about, 'string');
        parsedResultMatch.addedProperties.updatePersonProperty('Amount-of-pictures', result?.data.nb_photos, 'number');
        parsedResultMatch.addedProperties.updatePersonProperty('Type-of-match-or-like', 'like', 'string');
        parsedResultMatch.addedProperties.updatePersonProperty('Verification', result?.data.verification.status !== "unverified", 'boolean');
        parsedResultMatch.addedProperties.updatePersonProperty('Job', result?.data.job, 'string');
        parsedResultMatch.addedProperties.updatePersonProperty('School', result?.data.school, 'string');
    }

    private updateMessagesDataRecords(requestHandler: RequestHandlerHappn, dataRecords: DataRecord[], matches: ParsedResultMatch[]): Promise<boolean> {
        console.log(`updateMessagesDataRecords - START`);

        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve, reject) => {
            if (dataRecords.length === 0) {
                console.error(`Data records amount cannot be 0`);
                return reject(false);
            }

            for (let i = 0; i <= (dataRecords.length - 1); i = i + 1) {
                console.log(`GETTING MESSAGES now for: ${i} - ${dataRecords[i].usedDataFields[5].getValue()}`);
                const systemIdMatch = dataRecords[i].getRecordPersonSystemId(this.nameController);

                if (!systemIdMatch) {
                    console.warn(`Could not get messages for ${i} - ${dataRecords[i].usedDataFields[5].getValue()} because systemId was: ${systemIdMatch}`);
                } else {
                    const personId = this.getPersonIdFromMatch(systemIdMatch, matches);
                    const messages = await requestHandler.getMatchMessages(systemIdMatch);
                    const currentMatch: ParsedResultMatch = getParsedResultMatchBySystemId(systemIdMatch, matches);

                    const tinderMessages: TinderMessage[] = convertMessagesHappnToTinderMessages(messages, currentMatch);

                    if (personId) {
                        const messagesDataField = dataRecords[i].usedDataFields[2] as DataFieldMessages;
                        messagesDataField.updateMessagesList(this._convertTinderMessagesForDataRecord(tinderMessages, personId), true)
                    } else {
                        console.warn(`Messages could not be added to dataRecord because personId was not found in matches array. Please check the values provided.`);
                    }
                }

                if (i === (dataRecords.length - 1)) {
                    console.log(`updateMessagesDataRecords - END`);
                    return resolve(true);
                }

            }
        });

        function getParsedResultMatchBySystemId(systemId: string, matches: ParsedResultMatch[]): ParsedResultMatch {
            let matchIndex = matches.findIndex((match) => {
                return match.match.id === systemId;
            });
            if (matchIndex === -1) {
                matchIndex = 0;
            }
            return matches[matchIndex];
        }

        function convertMessagesHappnToTinderMessages(messages: MessagesHappn, parsedResultMatch: ParsedResultMatch): TinderMessage[] {
            const tinderMessages: TinderMessage[] = [];
            messages.data.conversation.messages.edges.forEach((messageNode) => {

                const isMessengerMe = parsedResultMatch.match.participants[0].user.first_name === messages.data.conversation.messages.edges[0].node.sender.firstName;

                if (isMessengerMe) {
                    console.log(`Yes! I am the sender of this message: ${messageNode.node.body}`);
                } else {
                    console.log(`No, i am not the sender of this message: ${messageNode.node.body}`);
                }

                // for now i will use the TinderMessage interface because the ParsedResultMatch interface does not allow me to add multiple message interfaces for I would need to update every object i add to the list with similair properties
                // should probably want to refactor this for tinder + happn to 1 single interface (simply use Message interface?)
                const tinderMessageToConvert: TinderMessage = {
                    _id: messageNode.node.id,
                    match_id: parsedResultMatch.match.id,
                    sent_date: messageNode.node.creationDate,
                    message: messageNode.node.body,
                    to: isMessengerMe ? 'match' : 'me',
                    from: isMessengerMe ? 'me' : 'match',
                    created_date: messageNode.node.creationDate,
                    timestamp: new Date(messageNode.node.creationDate).getTime()
                };

                tinderMessages.push(tinderMessageToConvert);
            });
            return tinderMessages;
        }
    }

    private getPersonIdFromMatch(systemIdMatch: string, matches: ParsedResultMatch[]): string | null {
        if (!systemIdMatch || !matches || matches.length === 0) {
            console.error(`Insufficient systemIdMatch or match array was provided. Please check the provided values.`);
            return null;
        }

        const match = matches.find((match) => {
            const happnMatch = match.match as HappnConversation;
            return happnMatch.id === systemIdMatch || happnMatch.participants[1].id === systemIdMatch;
        });
        if (match) {
            const happnMatch = match.match as HappnConversation;
            return happnMatch.participants[1].user.id;
        } else {
            console.error(`No match found in match array with systemIdMatch: ${systemIdMatch}`);
            return null;
        }
    }

    private updateDataTable(matches: ParsedResultMatch[]): void {

        matches?.forEach((match: ParsedResultMatch) => {

            const happnMatch = match.match as HappnConversation;
            match.match = happnMatch;

            const matchRecordIndex: number = this.getMatchRecordIndexBySystemIdOrPersonId(happnMatch, this.nameController);

            let happnMatchDataRecordValues: DataRecordValues[];
            let dataFields: DataField[];

            if (matchRecordIndex === -1) {
                // if match doesnt exist, create new data record, fill new record with all data needed
                console.log(`Going to CREATE new data record for: ${happnMatch.participants[1].user.first_name}`);
                const newDataRecord = new DataRecord();
                dataFields = newDataRecord.getDataFields();

                happnMatchDataRecordValues = this.parseMatchDataToDataRecordValues(dataFields, match, happnMatch.id);

                const dataAddedSuccessfully: boolean = newDataRecord.addDataToDataFields(happnMatchDataRecordValues);
                if (dataAddedSuccessfully) {
                    this.dataTable.addNewDataRecord(newDataRecord, this.nameController);
                } else {
                    console.error(`Error adding data from retrieved match. Please check match retrieved and error log.`);
                }

            } else {
                console.log(`Going to UPDATE data record for: ${happnMatch.participants[1].user.first_name}`);

                dataFields = this.dataTable.getDataFieldsByRecordIndex(matchRecordIndex);
                happnMatchDataRecordValues = this.parseMatchDataToDataRecordValues(dataFields, match, happnMatch.id);
                this.dataTable.updateDataRecordByIndex(matchRecordIndex, happnMatchDataRecordValues);
            }

        });

        console.log(`CHECK DATATABLE RESULT:`);
        console.dir(this.dataTable);
    }

    private getMatchRecordIndexBySystemIdOrPersonId(match: Match | HappnConversation, nameController: string): number {
        match = match as HappnConversation;
        const recordIndex = this.dataTable.getRecordIndexBySystemId(match.id, nameController);
        if (recordIndex === -1) {
            return this.dataTable.getRecordIndexBySystemId(match.participants[1].user.id, nameController);
        }
        return recordIndex;
    }

    private setUnupdatedMatchesToBlocked(matches: ParsedResultMatch[], dataTable: DataTable): Promise<void> {
        console.log(`setUnupdatedMatchesToBlocked - START`);
        return new Promise<void>((resolve) => {

            // if a match no longer appears in the retrieved (matches), then either the profile or our match has been deleted!
            const unupdatedMatchesList: DataRecord[] = dataTable.getAllDataRecords().filter((dataRecord) => {
                const doesDataRecordNotHaveMatchListed = matches.findIndex((match) => {
                    return match.match.id === dataRecord.getRecordPersonSystemId(this.nameController) || match.match.participants[1].user.id === dataRecord.getRecordPersonSystemId(this.nameController);
                });

                return doesDataRecordNotHaveMatchListed === -1 ? true : false;
            });

            for (let i = 0; i <= (unupdatedMatchesList.length - 1); i = i + 1) {
                const unupdatedMatch = unupdatedMatchesList[i];
                let presumedRequestsFired = 0;
                let actualRequestsFired = 0;

                // do not update if dataField 'Blocked' is already set to true
                const indexDataFieldBlocked: number = unupdatedMatch.getIndexOfDataFieldByTitle('Blocked-or-removed');
                let isDataFieldBlocked = false;
                if (unupdatedMatch.usedDataFields[indexDataFieldBlocked].getValue()) {
                    isDataFieldBlocked = true
                }

                // do not update if dataField 'isMatch' is still false, since this person can still become a match in the future
                const indexDataFieldIsMatch: number = unupdatedMatch.getIndexOfDataFieldByTitle('Is-match');
                let isDataFieldIsMatch = true;
                if (!unupdatedMatch.usedDataFields[indexDataFieldIsMatch].getValue()) {
                    isDataFieldIsMatch = false;
                }

                // do not update if datafield 'Seemingly-deleted-profile' is false, since this is an already confirmed deleted profile
                const indexDataFieldSeeminglyDeletedProfile: number = unupdatedMatch.getIndexOfDataFieldByTitle('Seemingly-deleted-profile');
                let hasDataFieldSeeminglyDeletedProfile = true;
                if (!unupdatedMatch.usedDataFields[indexDataFieldSeeminglyDeletedProfile].getValue()) {
                    hasDataFieldSeeminglyDeletedProfile = false;
                }

                if (isDataFieldBlocked || hasDataFieldSeeminglyDeletedProfile || !isDataFieldIsMatch) {
                    if (i === (unupdatedMatchesList.length - 1)) {
                        console.log(`I guess during?`);
                        resolve();
                    }
                    continue;
                }

                presumedRequestsFired = presumedRequestsFired + 1;
                const matchId = unupdatedMatch.getRecordPersonSystemId(this.nameController);
                const matchName = unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Name')].getValue();

                if (!matchId) {
                    console.warn(`Could not get profileDetails for unupdated match due to matchId being: ${matchId}, skipping this match..`);
                    continue;
                }

                // todo: continue here
                this.requestHandler.getMatchProfileDetails(matchId).then((matchDetails: MatchProfileDetailsHappn) => {
                    // what if a match blockes me?
                    // what kind of response will Happn retrieve on this api?
                    // what if a match removes their own profile?
                    // what kind of response will Happn retrieve on this api?
                    // what if I delete a match?
                    // what kind of response will Happn retrieve on this api?


                    // if(matchDetails === 404){
                    //     console.warn(`Matchdetails: ${matchName} with id: ${matchId} gave a 404. Probably deleted profile?`);
                    //     console.dir(unupdatedMatchesList[i]);

                    //     unupdatedMatch.addDataToDataFields([
                    //         {
                    //             label: 'Blocked-or-removed',
                    //             value: false
                    //         },
                    //         {
                    //             label: 'Date-of-unmatch',
                    //             value: new Date().toISOString()
                    //         },
                    //         {
                    //             label: 'Seemingly-deleted-profile',
                    //             value: true
                    //         }
                    //     ]);

                    //     unupdatedMatch.setUpdateMessages(false);
                    // }

                    // if(matchDetails === 500){
                    //     console.error(`Matchdetails: ${matchName} with id: ${matchId} request returned a 500. Probably only removed me as match?`);
                    // }

                    // if(typeof matchDetails !== 'number' && matchDetails?.closed){
                    //     const indexUnmatchDatafield = unupdatedMatch.getIndexOfDataFieldByTitle('Did-i-unmatch');
                    //     if(unupdatedMatch.usedDataFields[indexUnmatchDatafield].getValue()){
                    //         console.warn(`Matchdetails: ${matchName} with id: ${matchId} request returned a 200 while our match is gone. I (ME) deleted our match!`);
                    //         console.warn(unupdatedMatchesList[i]);
                    //     }else{
                    //         console.warn(`Matchdetails: ${matchName} with id: ${matchId} request returned a 200 while our match is gone. Match deleted our match!`);
                    //         console.warn(unupdatedMatchesList[i]);
                    //     }

                    //     unupdatedMatch.addDataToDataFields([
                    //         {
                    //             label: 'Blocked-or-removed',
                    //             value: true
                    //         },
                    //         {
                    //             label: 'Date-of-unmatch',
                    //             value: unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Date-of-unmatch')].getValue() ? unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Date-of-unmatch')].getValue() : (matchDetails.last_activity_date ? matchDetails.last_activity_date : new Date().toISOString())
                    //         },
                    //         {
                    //             label: 'Seemingly-deleted-profile',
                    //             value: false
                    //         }
                    //     ]);

                    //     unupdatedMatch.setUpdateMessages(false);
                    // }

                    // actualRequestsFired = actualRequestsFired + 1;
                    // if(presumedRequestsFired === actualRequestsFired){
                    //     resolve();
                    // }
                }).catch(() => {
                    const indexDataFieldName: number = unupdatedMatch.getIndexOfDataFieldByTitle('Name');
                    console.log(`Failed to get matchDetails for profile with name: ${unupdatedMatch.usedDataFields[indexDataFieldName].getValue()}. Please check if request adress is still correct.`);
                });

            }
            console.log(`setUnupdatedMatchesToBlocked - END`);
        });
    }

    // START - every method untill the end could live in it's own class?
    private parseMatchDataToDataRecordValues(dataFields: DataField[] | DataFieldMessages[], match?: ParsedResultMatch, systemId?: string): DataRecordValues[] {
        const dataRecordValuesList: DataRecordValues[] = [];
        const messagesDataField = dataFields[2] as DataFieldMessages;

        const happnMatch = match?.match as HappnConversation;

        if (match && match.matchMessages.length > 0) {
            const retrievedMessagesFromMatch = match.matchMessages as TinderMessage[];
            messagesDataField.updateMessagesList(this._convertTinderMessagesForDataRecord(retrievedMessagesFromMatch, happnMatch.participants[1].user.id))
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
                            'appType': this.nameController,
                            'id': match && happnMatch && happnMatch.id ? happnMatch.id : systemId,
                            'tempId': happnMatch.participants[1].id ? happnMatch.participants[1].id : ''
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
                    const jobFromProfile = match?.addedProperties.getPersonGenericPropertyByPropName('Job')?.value ? match?.addedProperties.getPersonGenericPropertyByPropName('Job')?.value : '';
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
                    const profileTextFromProfile = match?.addedProperties.getPersonGenericPropertyByPropName('Bio')?.value ? match?.addedProperties.getPersonGenericPropertyByPropName('Bio')?.value as string : '';
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
                    dataRecordValuesList.push({ 'label': 'Gender', 'value': happnMatch.participants[1].user.gender ? this._getGender(happnMatch.participants[1].user.gender) : dataField.getValue() });
                    break;
                case 'Is-verified': {
                    const verificationFromProfile = match?.addedProperties.getPersonGenericPropertyByPropName('Verification')?.value ? match?.addedProperties.getPersonGenericPropertyByPropName('Verification')?.value as boolean : null;

                    dataRecordValuesList.push({
                        'label': 'Is-verified',
                        'value': dataField.getValue() ? dataField.getValue() : verificationFromProfile
                    });
                    break;
                }
                case 'Type-of-match-or-like': {
                    const typeOfMatchFromProfile = match?.addedProperties.getPersonGenericPropertyByPropName('Type-of-match-or-like')?.value ? match?.addedProperties.getPersonGenericPropertyByPropName('Type-of-match-or-like')?.value as string : '';

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
                    const needsProfileUpdate = match?.addedProperties.getPersonGenericPropertyByPropName('needsProfileDetailsUpdate')?.value;

                    dataRecordValuesList.push({
                        'label': 'Needs-profile-update',
                        // 'value': dataField.getValue() ? dataField.getValue() : false
                        'value': needsProfileUpdate ? needsProfileUpdate : false
                    });
                    break;
                }
                case 'Needs-messages-update': {
                    const needsMessagesUpdate = match?.addedProperties.getPersonGenericPropertyByPropName('needsMessagesUpdate')?.value;

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
                    const picturesAmountFromProfile = match?.addedProperties.getPersonGenericPropertyByPropName('Amount-of-pictures')?.value ? match?.addedProperties.getPersonGenericPropertyByPropName('Amount-of-pictures')?.value as number : null;

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
                    const schoolFromProfile = match?.addedProperties.getPersonGenericPropertyByPropName('School')?.value ? match?.addedProperties.getPersonGenericPropertyByPropName('School')?.value as string : null;

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

    private _convertTinderMessagesForDataRecord(matchMessages: TinderMessage[], matchPersonId: string): Message[] {
        //todo: why can't i set the interface to {message: string, timestamp: number, author: 'me' | 'match'}[] ?
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
            // TODO: check if if the author of the message is being set here correctly
            // debugger;
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

    private _getResponseSpeedMoments(matchMessages: Message[]): any[] {
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

    private _getNumberOfGhosting(matchMessages: Message[], match?: Match | HappnConversation, dateAcquiredNumber?: string | null, dateBlockedOrRemoved?: string | null): ghostMoment[] {

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

    private _hasConversation(matchMessages: Message[]): boolean {
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

    private _hasMatchGivenResponse(matchMessages: Message[]): boolean {
        return matchMessages.some((matchMessage) => {
            return matchMessage.author === MessageAuthorEnum.Match;
        });
    }

    private _hasMatchSentFirstMessage(matchMessages: Message[]): boolean {
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

    private _getGender(genderString: string): string {
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

    private _getHappnAge(happnMatch: HappnConversation): number {
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

    // END - every method from the start could live in it's own class?
}