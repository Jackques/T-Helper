import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataField, DataFieldDistances, UIRequired } from "../data/dataField";
import { DataRecord } from "../data/dataRecord";
import { DataTable } from "../data/dataTable";
import { ScreenNavStateComboTinder } from "../util/Screen/screenStateComboTinder.enum";
import { DOMHelper } from "../util/DOMHelper";
import { UIFieldsRenderer } from "./UIFieldsRenderer";
import { SubmitType } from "src/SubmitType.enum";
import { RequestHandlerHappn } from "../http-requests/requestHandlerHappn";
import { MatchProfileDetailsHappn } from "src/content/interfaces/http-requests/MatchProfileDetailsHappn.interface";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../util/ConsoleColorLog/LogColors";
import { MatchDataParser } from "./MatchDataParserHappn";
import { Overlay } from "../serrvices/Overlay";
import { SubmitAction } from "src/SubmitAction.interface";
import { PersonAction } from "./../../../personAction.enum";
import { DataStorage } from "../data/dataStorage";
import { UrlHelper } from "../serrvices/UrlHelper";
import { ScreenController } from "../util/Screen/ScreenList";
import { PortMessage } from "src/content/interfaces/portMessage.interface";
import { PortAction } from "../../../PortAction.enum";
import { DatingAppType } from "../../../datingAppType.enum";
import { ScreenElement } from "../util/Screen/ScreenElement";

export class UIHelpersHappn {

    private uiRenderer: UIFieldsRenderer;
    private screenController: ScreenController;
    private nameController: DatingAppType;
    private dataTable: DataTable;
    private requestHandler: RequestHandlerHappn;
    private dataStorage: DataStorage;
    private dataPort: chrome.runtime.Port | null;

    constructor(nameController: DatingAppType, screenController: ScreenController, uiRenderer: UIFieldsRenderer, dataTable: DataTable, requestHandler: RequestHandlerHappn, dataStorage: DataStorage, dataPort: chrome.runtime.Port | null){
        this.uiRenderer = uiRenderer;
        this.screenController = screenController;
        this.nameController = nameController;
        this.dataTable = dataTable;
        this.requestHandler = requestHandler;
        this.dataStorage = dataStorage;
        this.dataPort = dataPort;
    }

    public addUIHelpers(currentScreen: ScreenNavStateComboTinder, forceRefresh?: boolean): void {
        if (currentScreen === ScreenNavStateComboTinder.Chat) {

            if (forceRefresh) {
                this.uiRenderer.removeAllUIHelpers();
            }

            // 1. get current messageListItemPerson
            const currentMatchid: string = this.getCurrentMatchIdFromChatScreen();

            let dataRecord: DataRecord | null = null;
            let dataFields: DataField[] | undefined | null = undefined;

            // 2. get record in table for this person
            if (currentMatchid.length > 0) {
                const recordIndexId = this.dataTable.getRecordIndexBySystemId(currentMatchid, this.nameController);
                if (recordIndexId !== -1) {
                    // todo: so i need to get the data first BEFORE i update the record? or just change this entirely?
                    // todo: why do i need to include undefined here while at no point in the assignment of this variabele does it ever get undefined assigned to it?
                    dataRecord = this.dataTable.getRecordByRecordIndex(recordIndexId);
                    if (dataRecord !== null) {
                        dataFields = dataRecord.getDataRecordDataFields();

                        // 3. show helpers for chat (all?), make space above messagebox, put helper container there?
                        // debugger;
                        this.uiRenderer.renderFieldsContainerForScreen(this.screenController, () => {
                            // $('div[id*="SC.chat"]').first().css('width', '730px');
                            const chatContainerDOM: HTMLElement | null = DOMHelper.getFirstDOMNodeByJquerySelector('div[data-testid="conversation-message-list-scrollbars"]');
                            if (chatContainerDOM !== null) {
                                $(chatContainerDOM).css('padding-right', '315px');
                            } else {
                                console.error(`Cannot find chat container DOM element. Please update the selectors.`);
                                return;
                            }

                        });
                        let uiRequiredDataFields: DataField[] = [];

                        if (dataFields && dataFields.length > 0) {
                            uiRequiredDataFields = dataRecord.getDataFields(false, true, UIRequired.CHAT_ONLY);

                            // 4. on send/receive message.. add message to/update dataRecord? (check; messageListObserver)
                            // 5. on switch person in messagelist; switch settings of the above? (check screenWatcher (Observer))
                            this.uiRenderer.renderFieldsFromDataFields(uiRequiredDataFields,
                                (value: DataRecordValues) => {
                                    console.log(`Updated value to existing data record; label: ${value.label}, value: ${value.value}`);
                                    const updatedValuesForDataFields: DataRecordValues[] = [value];

                                    if (value.label === "Acquired-number" && value.value) {
                                        updatedValuesForDataFields.push({
                                            label: 'Date-of-acquired-number',
                                            value: new Date().toISOString()
                                        });
                                    } else if (value.label === "Acquired-number" && !value.value) {
                                        updatedValuesForDataFields.push({
                                            label: 'Date-of-acquired-number',
                                            value: null
                                        });
                                    }

                                    dataRecord?.addDataToDataFields(updatedValuesForDataFields);
                                    console.log(`Updated dataRecord: `);
                                    console.dir(dataRecord);
                                }, (preSubmitType: SubmitType) => {
                                    // no preSubmit needed for chat screen
                                }, (submitType: SubmitType) => {
                                    dataRecord?.setUpdateMessages(true);
                                });
                        }

                        const indexDataFieldDistance = dataRecord.getIndexOfDataFieldByTitle('Distance-in-km');
                        if (indexDataFieldDistance !== -1) {

                            const distanceDataField = dataRecord.usedDataFields[indexDataFieldDistance] as DataFieldDistances;
                            const hasRecentDistanceEntry = distanceDataField.containsRecordWithinHours(12);
                            const personId = dataRecord.getRecordPersonSystemId(this.nameController, true);

                            if (hasRecentDistanceEntry === false && personId && personId.length > 0) {
                                this.requestHandler.getMatchProfileDetails(personId).then((matchDetails: MatchProfileDetailsHappn) => {
                                    if (matchDetails.error) {
                                        ConsoleColorLog.singleLog(`Could not get match profile details for currently opened match: `, dataRecord, LogColors.RED);
                                    }

                                    const dataForDataFields: DataRecordValues[] = [
                                        {
                                            label: 'Name',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Name')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Name')].getValue() :
                                                (matchDetails?.data?.first_name ? matchDetails.data.first_name : 'Unknown name')
                                        },
                                        {
                                            label: 'Age',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Age')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Age')].getValue() :
                                                (matchDetails?.data?.age ? matchDetails?.data?.age : NaN)
                                        },
                                        {
                                            label: 'Job',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Job')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Job')].getValue() :
                                                (matchDetails?.data?.job ? matchDetails?.data?.job : '')

                                        },
                                        {
                                            label: 'School',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('School')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('School')].getValue() :
                                                (matchDetails?.data?.school ? matchDetails?.data?.school : '')
                                        },
                                        {
                                            label: 'Gender',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Gender')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Gender')].getValue() :
                                                (matchDetails?.data?.gender ? MatchDataParser.getGender(matchDetails?.data?.gender) : 'Other')

                                        },
                                        {
                                            label: 'Has-profiletext',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Has-profiletext')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Has-profiletext')].getValue() :
                                                (matchDetails?.data?.about?.length > 0 ? true : false)
                                        },
                                        {
                                            label: 'Is-verified',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Is-verified')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Is-verified')].getValue() :
                                                (matchDetails?.data.verification.status !== "unverified")

                                        },
                                        //todo: Figure out if I want to include distance & how (last crossed/know location maybe? but maybe i'll need a lat/long for that with external api?..hmm..)
                                        // {
                                        //     label: 'Distance-in-km',
                                        //     value: [{
                                        //         dateTime: new Date().toISOString(),
                                        //         distanceInKM: this._convertDistanceMilesToKM(matchDetails?.results?.distance_mi)
                                        //     }]
                                        // },
                                        {
                                            label: 'Amount-of-pictures',
                                            value: dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Amount-of-pictures')].getValue() ?
                                                dataRecord?.usedDataFields[dataRecord?.getIndexOfDataFieldByTitle('Amount-of-pictures')].getValue() :
                                                matchDetails?.data?.nb_photos
                                        },
                                    ];

                                    dataRecord?.addDataToDataFields(dataForDataFields);

                                });
                            }
                        }
                    }
                } else {
                    console.error('Current match id not found');
                }

            } else {
                console.error('Invalid matchId.');
            }
        }

        if (currentScreen === ScreenNavStateComboTinder.Swipe) {

            if (forceRefresh) {
                this.uiRenderer.removeAllUIHelpers();
            }

            const newDataRecord: DataRecord = new DataRecord();

            this.uiRenderer.renderFieldsContainerForScreen(this.screenController, () => {
                $(".uiHelperFieldsContainer").css('height', '785px');
                $(".uiHelperFieldsContainer").css('overflow-y', 'scroll');
                $(".uiHelperFieldsContainer").css('position', 'absolute');
                $(".uiHelperFieldsContainer").css('right', '0px');
                $(".uiHelperFieldsContainer").css('left', 'auto');
                $(".uiHelperFieldsContainer").css('top', '80px');
            },
            () => {
                const dataRecordValuesFromCollectedData: DataRecordValues[] = [];
                this.screenController.getCurrentScreen().getScreenElements().forEach((screenElement: ScreenElement) => {
                    const hasCollectedData = screenElement.collectData();

                        switch (screenElement.getName()) {
                            case "Name": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: screenElement.getValueAsString()
                                    });
                                break;
                            }
                            case "Age": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: screenElement.getValueAsNumber()
                                    });
                                break;
                            }
                            case "Job": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: hasCollectedData ? screenElement.getValueAsString() : "" 
                                    });
                                break;
                            }
                            case "School": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: hasCollectedData ? screenElement.getValueAsString() : ""
                                    });
                                break;
                            }
                            case "City": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: hasCollectedData ? screenElement.getValueAsString() : ""
                                    });
                                break;
                            }
                            case "Has-profiletext": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: hasCollectedData ? screenElement.getValueAsString() : false
                                    });
                                break;
                            }
                            case "Is-verified": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: hasCollectedData ? screenElement.getValueAsBoolean() : false
                                    });
                                break;
                            }
                            case "Amount-of-pictures": {
                                dataRecordValuesFromCollectedData.push(
                                    {
                                        label: screenElement.getName(),
                                        value: hasCollectedData ? screenElement.getValueAsString() : null
                                    });
                                break;
                            }
                            default:
                                ConsoleColorLog.singleLog(`Screen element with name: ${screenElement.getName()} is not collected for adding to the dataRecord. Please check if this is correct.`, screenElement.getValueAsString(), LogColors.YELLOW);
                        }
                });
                this.screenController.getCurrentScreen().clearValuesScreenElements();

                ConsoleColorLog.multiLog(`Here is the collected data from DOM: `, dataRecordValuesFromCollectedData, LogColors.GREEN, true);

                newDataRecord.addDataToDataFields(dataRecordValuesFromCollectedData);
                this.uiRenderer.updateDataFieldValues();

                // TODO TODO TODO: first get if user is on swipe or swipe profile screen? both delivers different DOM,.. but wait! i removed swipe-profile screen..
                // todo: nice what i thought about making each dataField autogather or not, but this was not needed.. so maybe remove the autoGather & autoGatherOnce all together to reduce unnecessary complexity?
            });

            const uiRequiredDataFields: DataField[] = newDataRecord.getDataFields(false, true, UIRequired.SELECT_ONLY);

            newDataRecord.addDataToDataFields([
                // set initial value to later be adjusted by ui control
                {
                    label: 'Has-usefull-profiletext',
                    value: false
                },
                {
                    label: 'Attractiveness-score',
                    value: 6
                },
                {
                    label: 'Seems-fake',
                    value: false
                },
                {
                    label: 'Seems-empty',
                    value: false
                },
                {
                    label: 'Seems-obese',
                    value: false
                },
                {
                    label: 'Seems-toppick',
                    value: false
                },
                {
                    label: 'Last-updated',
                    value: new Date().toISOString()
                },
                {
                    label: 'Is-match',
                    value: false
                },
                {
                    label: 'Date-liked-or-passed',
                    value: new Date().toISOString()
                },
            ]);

            // todo: WHY NOT DIRECTLY GET/USE DATA FIELDS? WHY GET DATAFIELDTYPES AT ALL? cuz i might also need required property in the future, i need a default value (which i'm going to set on data field), i DO need a already set property for use when chatting etc..
            let timeoutSubmit: number | null = null;
            this.uiRenderer.renderFieldsFromDataFields(uiRequiredDataFields, (value: DataRecordValues) => {
                console.log(`Added value to new data record; label: ${value.label}, value: ${value.value}`);
                newDataRecord.addDataToDataFields([value]);
                console.log(`Updated dataRecord: `);
                console.dir(newDataRecord);

            },(preSubmitType: SubmitType) => {
                console.log('Callback received a (pre-)submit type! But it will only be used if no response from background can be retrieved');
                this._postMessageBackgroundScript(PortAction.SWIPED_PERSON_ACTION_START);

            }, (submitType: SubmitType) => {
                console.log('Callback received a submit type! But it will only be used if no response from background can be retrieved');
                Overlay.setLoadingOverlay('loadingSwipeAction', true);
                console.log(submitType);

                this._postMessageBackgroundScript(PortAction.SWIPED_PERSON_ACTION_PROCESS);

                console.log(this.dataStorage);
                console.assert(this.dataStorage.popLastActionFromDataStore() === undefined);

                //todo: refactor all code below to use a promise, in which a set interval checks every 100ms orso if a dataStorage item is available then executes code as normal to a max of 60 sec
                // OR even better; once submittype has been pressed, do nothing here, copy the code below to the backgroundscriptlistener? (let THAT code check if we are on swiping page, what is filled into the datafields etc.)
                // OR EVEN BETTER YET; this code (except for when the timeout begins should always run first, sooner than my backgroundscript can receive a response..), so; create a new promise, add it to the dataStore, let the eventlistener from backgroundscript trigger the resolve, if no response comes make my script below (with timeout) trigger the reject after 1 min orso

                // get (request) personid from backgroundscript (get response), after 1 sec
                const ms = 1000;

                if(timeoutSubmit !== null){
                    return;
                }

                timeoutSubmit = setTimeout(() => {
                    console.log('this is what is found in dataStore after 1 sec: ');
                    console.log(this.dataStorage);
                    const submitAction: SubmitAction | undefined = this.dataStorage.popLastActionFromDataStore();
                    console.log(submitAction);

                    let typeOfLikeOrPass = '';
                    if (submitAction !== undefined) {
                        let personActionStatus: boolean | undefined = undefined;
                        if (submitAction.submitType === PersonAction.LIKED_PERSON) {
                            personActionStatus = true;
                            typeOfLikeOrPass = 'like';
                        }
                        if (submitAction.submitType === PersonAction.SUPER_LIKED_PERSON) {
                            personActionStatus = true;
                            typeOfLikeOrPass = 'superlike';
                        }
                        if (submitAction.submitType === PersonAction.PASSED_PERSON) {
                            personActionStatus = false;
                            typeOfLikeOrPass = 'pass';
                        }

                        if (personActionStatus === undefined) {
                            return;
                        }

                        const dataForDataFields: DataRecordValues[] = [
                            {
                                label: 'System-no',
                                value: {
                                    appType: this.nameController,
                                    tempId: submitAction.personId
                                }
                            },
                            {
                                label: 'Did-i-like',
                                value: personActionStatus
                            },
                            {
                                label: 'Type-of-match-or-like',
                                value: [typeOfLikeOrPass]
                            },
                        ];
                        newDataRecord.addDataToDataFields(dataForDataFields);

                        this.requestHandler.getMatchProfileDetails(submitAction.personId).then((matchDetails: MatchProfileDetailsHappn) => {
                            //todo: Build in; valid from guard. I must check a box in order to proceed to 'like' or 'pass' a person to prevent accidental skipping a field

                            const dataForDataFields: DataRecordValues[] = [
                                {
                                    label: 'Name',
                                    value: matchDetails?.data?.first_name ? matchDetails.data.first_name : 'Unknown name'
                                },
                                {
                                    label: 'Age',
                                    value: matchDetails?.data?.age ? matchDetails.data.age : NaN
                                },
                                // {
                                //     label: 'City',
                                //     value: matchDetails?.data?.city?.name.length > 0 ? matchDetails.data.city.name : ''
                                // },
                                {
                                    label: 'Job',
                                    value: matchDetails?.data?.job ? matchDetails?.data?.job : ''
                                },
                                {
                                    label: 'School',
                                    value: matchDetails?.data?.school ? matchDetails?.data?.school : ''
                                },
                                {
                                    label: 'Gender',
                                    value: matchDetails?.data?.gender ? MatchDataParser.getGender(matchDetails?.data?.gender) : 'Other'
                                },
                                // {
                                //     label: 'Interests',
                                //     value: matchDetails?.results?.user_interests?.selected_interests?.length > 0 ? this._getInterests(matchDetails?.results?.user_interests?.selected_interests) : []
                                // },
                                {
                                    label: 'Has-profiletext',
                                    value: matchDetails?.data?.about?.length > 0 ? true : false
                                },
                                {
                                    label: 'Is-verified',
                                    value: matchDetails?.data?.verification?.status !== "unverified"
                                }
                            ];

                            // if (matchDetails?.results?.distance_mi) {
                            //     dataForDataFields.push({
                            //         label: 'Distance-in-km',
                            //         value: [{
                            //             dateTime: new Date().toISOString(),
                            //             distanceInKM: this._convertDistanceMilesToKM(matchDetails?.results?.distance_mi)
                            //         }]
                            //     });
                            // }

                            newDataRecord.addDataToDataFields(dataForDataFields);

                        }).catch(() => {
                            console.error(`Swiped person received tempId, but could not get details of swiped person! Saving inserted info of record regardless`);
                        }).finally(() => {
                            this.dataTable.addNewDataRecord(newDataRecord, this.nameController);
                            this.addUIHelpers(currentScreen, true);
                            Overlay.setLoadingOverlay('loadingSwipeAction', false);
                        });
                    } else {
                        newDataRecord.addDataToDataFields([
                            // set initial value to later be adjusted by ui control
                            {
                                label: 'System-no',
                                value: {
                                    appType: 'tinder',
                                    tempId: `idNotRetrievedPleaseCheckBackgroundRequestsBackupsInLocalStorage-${new Date().toISOString()}`
                                }
                            },
                            {
                                label: 'Did-i-like',
                                value: submitType === 'liked' ? true : false
                            },
                            {
                                label: 'Type-of-match-or-like',
                                value: [submitType]
                            },
                        ]);
                        this.dataTable.addNewDataRecord(newDataRecord, this.nameController);
                        this.addUIHelpers(currentScreen, true);
                        Overlay.setLoadingOverlay('loadingSwipeAction', false);

                        console.error(`Swiped person received no tempId! Saving inserted info of record regardless.. Don't forget to check background local storage requests backup to get the corresponding personid and to overwrite the tempId later!`);
                        //todo: Should REALLY throw a important alert to notify myself what I need to pay extra attention!
                    }
                    
                    this._postMessageBackgroundScript(PortAction.SWIPED_PERSON_ACTION_END);
                    timeoutSubmit = null;
                }, ms);
            });
        }

        //todo: create view to show gathered info for all dataFields (thus also showing current value of; name, age, hasProfiletext etc.)
        //todo: create 're-try retrieve' button; for when the tinder UI finishes loading too late and my app already attempted to gather data
        //todo: figure out a solution to auto get 'hasProfileText' for when a profile DOES HAVE profileText but isnt show in the initial view because there is too much other info (location, age, distance, job etc.).. maybe do inplement a previous screen?

        //todo: create ability to while swipe/chat see all the values being stored for this record/person

        //todo: create checker method which checks if above DOM element ref exists, otherwise throw error
        //todo: FUTURE; create checker method which checks if all required DOM elements used here still exist (auto loop through application?)
        //todo: add other state (if,.. or seperate method) for adding chat ui helper VS swipe ui helper. Currently working on swipe ui helper

        //todo: seperate out logic for everything UI related; create a seperate class which recognizes app state (which screen we are on), removes existing helprs when on switch etc.
    }

    private getCurrentMatchIdFromChatScreen(): string {
        const matchIdFromUrl: string | null = UrlHelper.getCurrentMatchIdFromUrl();
        if (matchIdFromUrl) {
            return matchIdFromUrl;
        } else {
            console.error(`Message List Item DOM Element not found. Please check & update the selector.`);
        }
        return '';
    }

    private _postMessageBackgroundScript(actionName: PortAction): void {
        const portMessage: PortMessage = {
            messageSender: 'CONTENT',
            action: actionName,
            payload: "",
            datingAppType: this.nameController
        };
        this.dataPort?.postMessage(portMessage);
    }

}