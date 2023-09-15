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
import { MatchDataParser } from "./MatchDataParserHappn";
import { LogColors } from "../util/ConsoleColorLog/LogColors";
import { DatingAppType } from "../../../datingAppType.enum";

export class HappnMatchesAndMessagesController {

    // private nameController = 'happn';
    private nameController: DatingAppType = DatingAppType.HAPPN;
    private requestHandler: RequestHandlerHappn;
    private dataTable: DataTable;

    constructor(requestHandler: RequestHandlerHappn, dataTable: DataTable, nameController: DatingAppType) {
        this.requestHandler = requestHandler;
        this.dataTable = dataTable;
        this.nameController = nameController;
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
                    const dataRecord: DataRecord | null = this.dataTable.getRecordByRecordIndex(systemIdMatch);

                    // If profile/messages need update, then set need update to true. If datarecord is null (i.e. new record due to new match), always set to true
                    const profileNeedsUpdate = dataRecord ? dataRecord.getIfProfileDetailsNeedsUpdate() : true;
                    const messagesNeedsUpdate = dataRecord ? dataRecord?.getIfMessagesNeedsUpdate() : true;

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

                    // const dataRecordsWhereMessagesNeedToBeUpdated = this.dataTable.getAllDataRecordsWhereMessageNeedTobeUpdated();
                    // if (dataRecordsWhereMessagesNeedToBeUpdated.length === 0) {
                    //     console.log(`NO DATA RECORDS NEED TO BE UPDATED`);
                    //     return resolve();
                    // }

                    // this.updateMessagesDataRecords(this.requestHandler, dataRecordsWhereMessagesNeedToBeUpdated, matches).then((hasMessagesBeenRetrieved) => {
                    //     console.log(`setUnupdatedMatchesToBlocked - this.updateMessageDataRecords finally() .then START`);

                    //     if (!hasMessagesBeenRetrieved) {
                    //         console.error(`Something went wrong with getting messages! Check the network logs.`);
                    //         return reject();
                    //     }

                    //     const dataRecords: DataRecord[] = this.dataTable.getAllDataRecords();
                    //     dataRecords.forEach((dataRecord) => {
                    //         const dataFields: DataField[] = dataRecord.getDataFields();

                    //         const systemId: string | null = dataRecord.getRecordPersonSystemId(this.nameController)
                    //         if (!systemId) {
                    //             console.warn(`Could not update dataRecord because record index could not be found due to not found system id: ${systemId}`);
                    //         } else {
                    //             const matchRecordIndex: number = this.dataTable.getRecordIndexBySystemId(systemId, this.nameController);
                    //             const tinderMatchDataRecordValues: DataRecordValues[] = MatchDataParser.parseMatchDataToDataRecordValues(this.nameController, dataFields, undefined, systemId);
                    //             this.dataTable.updateDataRecordByIndex(matchRecordIndex, tinderMatchDataRecordValues);
                    //         }
                    //     });

                    //     // return resolve(); // does this perhaps need to be put INSIDE the this.updateMessagesDataRecords?, nope doesnt help either.. try 1
                    //     console.log(`setUnupdatedMatchesToBlocked - this.updateMessageDataRecords finally() .then END`);
                    // }).catch((error) => {
                    //     console.dir(error);
                    //     console.error(`Error occured getting matchMessages`);
                    // }).finally(() => {
                    //     console.log(`And here is my data table:`);
                    //     console.dir(this.dataTable);
                    // });
                    // console.log(`setUnupdatedMatchesToBlocked finally() END`);
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
            const result = match.addedProperties.getPersonGenericPropertyByKey('needsMessagesUpdate')?.value;
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
                    this.requestHandler.getMatchMessages(matchData.id).then((result: MessagesHappn) => {
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
        if (result.data.conversation.messages.edges.length >= 50) {
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

            // no personal nor conversation id matches the messages id! weirdddd! even the names are not safe!
            parsedResultMatch.matchMessages.push(tinderMessageToConvert);
        });
    }

    private _addProfileDataMatchesHappn(matches: ParsedResultMatch[]): Promise<void> {

        // Get only the profiles which have been set to require an update
        const needsProfileUpdateMatches: ParsedResultMatch[] = matches.filter((match) => match.addedProperties.getPersonGenericPropertyByKey('needsProfileDetailsUpdate')?.value === true);

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
                        messagesDataField.updateMessagesList(MatchDataParser.convertTinderMessagesForDataRecord(tinderMessages, personId), true)
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

                happnMatchDataRecordValues = MatchDataParser.parseMatchDataToDataRecordValues(this.nameController, dataFields, match, happnMatch.id);

                const dataAddedSuccessfully: boolean = newDataRecord.addDataToDataFields(happnMatchDataRecordValues);
                if (dataAddedSuccessfully) {
                    this.dataTable.addNewDataRecord(newDataRecord, this.nameController);
                } else {
                    console.error(`Error adding data from retrieved match. Please check match retrieved and error log.`);
                }

            } else {
                console.log(`Going to UPDATE data record for: ${happnMatch.participants[1].user.first_name}`);

                dataFields = this.dataTable.getDataFieldsByRecordIndex(matchRecordIndex);
                happnMatchDataRecordValues = MatchDataParser.parseMatchDataToDataRecordValues(this.nameController, dataFields, match, happnMatch.id);
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

        let newBlockedOrRemovedPersons = 0;
        let updatedBlockedOrRemovedPersons = 0;
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

                newBlockedOrRemovedPersons = newBlockedOrRemovedPersons + 1;
                const matchId = unupdatedMatch.getRecordPersonSystemId(this.nameController);
                const matchName = unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Name')].getValue();

                if (!matchId) {
                    console.warn(`Could not get profileDetails for unupdated match due to matchId being: ${matchId}, skipping this match..`);
                    continue;
                }

                // todo: continue here
                // this.requestHandler.getMatchProfileDetails(matchId).then((matchDetails: MatchProfileDetailsHappn) => {
                this.requestHandler.getMatchConversation(matchId).then((matchMessagesDetails: MessagesHappn) => {
                    updatedBlockedOrRemovedPersons = updatedBlockedOrRemovedPersons + 1;
                    // debugger;

                    // if(matchMessagesDetails === 404){
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

                    if(!matchMessagesDetails){
                        ConsoleColorLog.multiLog(`Matchdetails: ${matchName} with id: ${matchId} request retrieved a falsy value`, matchMessagesDetails, LogColors.RED, true);
                        alert(`Match perhaps deleted profile hence why matchMessagesDetails is a falsy value? Check console log`)
                    }

                    if(matchMessagesDetails.data.conversation.isBlocked){
                        const indexUnmatchDatafield = unupdatedMatch.getIndexOfDataFieldByTitle('Did-i-unmatch');
                        if(unupdatedMatch.usedDataFields[indexUnmatchDatafield].getValue()){
                            console.warn(`Matchdetails: ${matchName} with id: ${matchId} request returned a 200 while our match is gone. I (ME) deleted our match!`);
                            console.warn(unupdatedMatchesList[i]);
                        }else{
                            console.warn(`Matchdetails: ${matchName} with id: ${matchId} request returned a 200 while our match is gone. Match deleted our match!`);
                            console.warn(unupdatedMatchesList[i]);
                        }

                        unupdatedMatch.addDataToDataFields([
                            {
                                label: 'Blocked-or-removed',
                                value: true
                            },
                            {
                                label: 'Date-of-unmatch',
                                value: unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Date-of-unmatch')].getValue() ? 
                                unupdatedMatch.usedDataFields[unupdatedMatch.getIndexOfDataFieldByTitle('Date-of-unmatch')].getValue() : 
                                (matchMessagesDetails.data.conversation.modificationDate ? matchMessagesDetails.data.conversation.modificationDate : new Date().toISOString())
                            },
                            {
                                label: 'Seemingly-deleted-profile',
                                value: false
                            }
                        ]);

                        unupdatedMatch.setUpdateMessages(false);
                    }else{
                        ConsoleColorLog.multiLog(`This blocked/deleted/disappeared match does no longer appear in my retrieved match list, but did she block me? (which should follow the code above) or did she delete her profile? (which is a new scenario I have not yet accounted for)`, matchMessagesDetails, LogColors.RED, true);
                        alert(`Unrecognized blocked match, please check console log`);
                    }
                }).catch(() => {
                    const indexDataFieldName: number = unupdatedMatch.getIndexOfDataFieldByTitle('Name');
                    console.log(`Failed to get matchDetails for profile with name: ${unupdatedMatch.usedDataFields[indexDataFieldName].getValue()}. Please check if request adress is still correct.`);
                }).finally(()=>{
                    if(newBlockedOrRemovedPersons === updatedBlockedOrRemovedPersons){
                        resolve();
                    }
                });

            }
            console.log(`setUnupdatedMatchesToBlocked - END`);
        });
    }
}