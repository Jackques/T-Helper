import 'regenerator-runtime/runtime'
import { SubmitAction } from "src/SubmitAction.interface";
import { FileHelper } from '../fileHelper';
import { parse } from 'tldts';
import { TinderController } from './classes/controllers/TinderController';
import { DataRecord } from './classes/data/dataRecord';
import { DataStorage } from './classes/data/dataStorage';
import { DataTable } from './classes/data/dataTable';
import { DataRecordValues } from './interfaces/data/dataRecordValues.interface';
import { PortMessage } from './interfaces/portMessage.interface';
import { AutoReminder } from './classes/serrvices/AutoReminder';
import { ReminderHttp } from './classes/data/ReminderHttp';
import { ghostMoment } from './interfaces/data/ghostMoment.interface';
import { HappnController } from './classes/controllers/HappnController';
import { Overlay } from './classes/serrvices/Overlay';
import { ConsoleColorLog } from './classes/util/ConsoleColorLog/ConsoleColorLog';
import { LogColors } from './classes/util/ConsoleColorLog/LogColors';
import { PortAction } from '../PortAction.enum';
import { DatingAppType } from '../datingAppType.enum';

export class Main {
    private datingAppController: TinderController | HappnController | undefined | null; //todo: should remove undefined/null properties in the future
    private datingAppType: DatingAppType = DatingAppType.UNKNOWN;

    private dataTable: DataTable = new DataTable();
    private dataStorage: DataStorage = new DataStorage();
    private autoReminder: AutoReminder = new AutoReminder();
    private importedFile: FileHelper | null = null;
    private backgroundChannelPort: chrome.runtime.Port | null = null;
    private keepAliveIntervalNumber: number | null = null;

    private downloadNetworkLogsActiveNo: number | null = null;

    constructor() {
        //console.log(`The main app constructor content works`);

        // POPUP
        chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
            console.log(`Content Port activated! ${port.name}`);
            this.backgroundChannelPort = chrome.runtime.connect({name: 'jack'});
            
            port.onMessage.addListener((portMessage: PortMessage) => {
                console.log(`Content Port received a message!`);
                if (portMessage.messageSender === 'POPUP' && portMessage.action === PortAction.INIT) {
                    //console.log(`I received the following message payload: `);
                    //console.dir(msg.payload);

                    //todo: Move this checking logic to popup,.. IN THE FUTURE so I don't have to press a button and find out AFTERWARDS that I shouldnt have pressed it because i wasnt on a recognized dating app
                    this.datingAppType = this.checkDatingApp();
                    if (this.datingAppType !== DatingAppType.UNKNOWN) {
                        // this.dataTable = new DataTable();

                        //for every entry i the list received in payload
                        //todo: CURRENTLY; i ASSUME the dataTable will be empty (which it most likely is), but maybe i would want to check here if prior data already exists, thus updating data rather than creating new records
                        const importedRecords = portMessage.payload as any[];
                        importedRecords.forEach((msg: DataRecordValues[], index, arr) => {
                            const newDataRecord = new DataRecord();

                            const isDataAddedSuccesfully: boolean = newDataRecord.addDataToDataFields(msg);
                            if (isDataAddedSuccesfully && this.dataTable !== null) {
                                const isImportedDataRecordAddedDataTable = this.dataTable.addNewDataRecord(newDataRecord, this.datingAppType);
                                if(!isImportedDataRecordAddedDataTable){
                                    console.warn(`${console.count('ImportedDataRecord')} | Imported data record: ${newDataRecord} was NOT added to dataTable: ${this.dataTable}`);
                                    if(index === (arr.length - 1)){
                                        console.countReset('ImportedDataRecord');
                                    }
                                }
                            } else {
                                console.error(`Error adding data from import. Please check data fields from import and error log.`);
                            }
                        });

                        //todo: maybe should seperate out the logic for init app and actually getting the imported data?
                        this.datingAppController = this.initAppController(this.datingAppType, this.dataTable, this.dataStorage);
                        this.setSendReminderButton();
                        this.setCloseButton();
                        this.setDownloadNetworkLogs();
                        this.keepAliveIntervalNumber = this.activateKeepAlive();
                    }else{
                        const errMsg = `Dating app type could not be recognized. Please check the logic for checking Dating App type & ensure you are on the correct app.`;
                        alert(errMsg);
                        throw new Error(errMsg);
                    }
                }
                if (portMessage.messageSender === 'POPUP' && portMessage.action === PortAction.FILENAME) {
                    console.log(`Received filename from popup: `);
                    console.dir(portMessage);
                    this.importedFile = new FileHelper(portMessage.payload as string);
                    this.setDownloadExportButton(this.dataTable, this.importedFile);
                }
            });

            // BACKGROUND
            this.backgroundChannelPort.onMessage.addListener((msg: PortMessage) => {
                console.log(`i received a portmessage:`);
                console.dir(msg);

                if (msg.messageSender === 'BACKGROUND' && msg.action === PortAction.SUBMIT_ACTION) {
                    console.log(`Received submit action from background script: `);
                    console.dir(msg);
                    const message = msg.payload as any[];
                    this.dataStorage.addActionToDataStore(<SubmitAction>message[0]);
                }

                if (msg.messageSender === 'BACKGROUND' && msg.action === PortAction.GET_NETWORK_LOGS) {
                    console.log(`Received download network logs: `);
                    console.table(msg.payload);

                    const element = document.createElement('a');
                    // debugger;
                    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(
                            this._convertObjectsToCSV(msg.payload as unknown as Record<string, string>[])
                    )
                    );
                    // debugger;
                    element.setAttribute('download', 'network-logs-'+new Date().toISOString()+".csv");
                    document.body.appendChild(element);
                    element.click();

                    Overlay.setLoadingOverlay('downloadNetworkLogs', false);
                    this.downloadNetworkLogsActiveNo = null;
                }
                
            });
            this.backgroundChannelPort.onDisconnect.addListener(()=>{
                if(this.datingAppType !== null){
                    const errorMessage = `The channel with the background script has been disconnected! Stop swiping immediately to prevent potential loss of data. Please check the background script extension logs.`;
                    console.error(errorMessage);
                    alert(errorMessage);

                    //todo todo todo:
                    /* might this be the problem?
                    https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
                    https://medium.com/whatfix-techblog/service-worker-in-browser-extensions-a3727cd9117a
                    e.g;
                    1. have a timer count down, is it after ~5 tries always about 5 min or 30 sec before the disconnect?
                    2. check network tab; are there any calls being made?
                    3. try the keepAlive solution with setinterval maybe?
                    4. does this event even prevent the service worker/background script from;
                        a. intercepting a request?
                        b. sending the contents of the intercepted request back to the content script?
                    */
                }

                // log below will never run since when disconnect is called from content script it's own onDisconnect listener should never be called. 
                // it is called when the backgroundscript is disconnected but i never existed the app, thus never giving the command to disconnected from here (where i made the connection), thus it should be treated as an error.
                // thus if this console.log below is ever run, something is wrong.
                console.error(`backgroundChannelPort was disconnected succesfully, but this log should never be shown. Something is wrong?`);
            });
        });
    }
    private _convertObjectsToCSV(objList: Record<string, string>[]): string {
        let result = "";
        objList.forEach((obj, index)=>{
            // debugger;
            if(index === 0){
                result = result + Object.keys(obj).join(",") + "\r\n";
            }
            result = result + Object.values(obj).join(",") +  "\r\n";
        });
        return result;
    }

    private checkDatingApp(): DatingAppType {
        switch (parse(window.location.hostname).domainWithoutSuffix) {
            case "tinder":
                console.log('You are on tinder');
                return DatingAppType.TINDER;
            case "happn":
                console.log('You are on happn');
                return DatingAppType.HAPPN;
            default:
                console.log('Did not recognize app');
                return DatingAppType.UNKNOWN;
        }
    }

    private initAppController(appType: string, dataTable: DataTable, dataStorage: DataStorage) {
        switch (appType) {
            case "tinder":
                return new TinderController('api', dataTable, dataStorage, this.backgroundChannelPort);
            case "happn":
                return new HappnController('api', dataTable, dataStorage, this.backgroundChannelPort);
                // alert('Happn is not yet supported');
                // return undefined;
            default:
                alert('Unsupported app');
                return null;

        }
    }

    public setDownloadExportButton(dataTable: DataTable, fileHelper: FileHelper): void {
        $('body').prepend(`
               <button class="downloadButton" id="downloadButton">Export JSON</button>
            `);

        $(`body`).on("click", '[id="downloadButton"]', () => {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(dataTable.getRecordValuesObject(this.datingAppType)));
            element.setAttribute('download', fileHelper.getUpdateFileName());
            document.body.appendChild(element);
            element.click();
        });
    }

    public setCloseButton(): void {
        $('body').prepend(`
            <button class="closeButton" id="closeButton">Close</button>
        `);
        let closeButtonPromptActiveNo: number | null = null;
        
        $(`body`).on("click", '[id="closeButton"]', () => {
            Overlay.setLoadingOverlay('closeAppAction', true);
            
            if(!closeButtonPromptActiveNo){
                closeButtonPromptActiveNo = setTimeout(()=>{
                    let txt = '';
                    if (confirm("Weet je zeker dat je wilt afsluiten?")) {
                        txt = "You pressed OK!";
                        this.deleteAppState();
                        this.removeButtonsFromUI();
                    } else {
                        txt = "You pressed Cancel!";
                    }
                    Overlay.setLoadingOverlay('closeAppAction', false);
                    console.log(txt);
                    closeButtonPromptActiveNo = null;
                }, 100);
            }

        });
    }

    public setSendReminderButton(): void {
        $('body').prepend(`
            <button class="reminderButton" id="reminderButton">Send auto reminders</button>
        `);

        $(`body`).on("click", '[id="reminderButton"]', () => {
            console.log("SEND REMINDER LIST");
            const dataRecordsWhoNeedAutoReminder = this.dataTable.getAllDataRecords().filter((dataRecord) => {
                return dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Needs-reminder")].getValue() === true;
            });

            const dataRecordsWhoNeedAutoReminderMap = dataRecordsWhoNeedAutoReminder.map((dataRecord) => {
                const tempId = dataRecord.getRecordPersonSystemId(this.datingAppType, true);
                return {
                    "Name": dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Name")].getValue(),
                    "System-no": dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("System-no")].getValue({appType: this.datingAppType}),
                    "tempId": tempId,
                    "tempIdisHowManyCharacters": tempId ? tempId.length : null,
                    "AcquiredNumber": dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Acquired-number")].getValue(),
                    "Needs-reminder": dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Needs-reminder")].getValue(),
                    "Messages": dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Messages")].getValue(),
                    "English-only": (function(){
                        const values: string[] = dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Details-tags")].getValue() as string[];
                        if(values.includes("is-tourist") || values.includes("is-immigrant-or-expat")){
                            return true;
                        }
                        return false;
                    }()),
                }
            });
    
            console.table(dataRecordsWhoNeedAutoReminderMap, ["Name", "System-no","tempId", "tempIdisHowManyCharacters", "Needs-reminder", "Messages", "AcquiredNumber", "English-only"]);
            console.log("SEND REMINDER LIST");
            const reminderHttpList: (ReminderHttp | null)[] = dataRecordsWhoNeedAutoReminder.map((dataRecord: DataRecord)=>{
                const tempId: string | null = dataRecord.getRecordPersonSystemId(this.datingAppType, true);
                const completeId: string | null = dataRecord.getRecordPersonSystemId(this.datingAppType, false);
                if(!tempId || !completeId){
                    console.warn(`Could not esthablish send reminders record; tempId is: ${tempId}, completeId is: ${completeId}`);
                    return null;
                }else{
                    const name: string = dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Name")].getValue() as string;
                    //todo: I should REALLY create a seperate helper util class for getting & setting special data classes e.g. Reminders-amount & How-many-ghosts
                    const englishOnly: boolean = (function(){
                            const values: string[] = dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Details-tags")].getValue() as string[];
                            if(values.includes("is-tourist") || values.includes("is-immigrant-or-expat")){
                                //todo: when a match is 'is-tourist' or 'is-immigrant' they are automatically seen as 'english'. Preferably I would like to have a 'language' dataField per profile so I can manually set it to English with Dutch being the default language
                                return true;
                            }
                            return false;
                    }());
                    const reminderTextMessageList: string[] = (function(){
                        const valuesRemindersAmount = dataRecord.usedDataFields[dataRecord.getIndexOfDataFieldByTitle("Reminders-amount")].getValue() as Record<string, number | string | boolean>[];
                        return valuesRemindersAmount.map((valueRemindersAmount)=>{
                            return valueRemindersAmount['textContentReminder'] as unknown as string;
                        });
                    }());
                    return this.autoReminder.getReminderHttpMap(tempId, completeId, name, reminderTextMessageList, englishOnly);
                }
            });

            const reminderHttpListWithoutNulls = reminderHttpList.filter(reminder => !!reminder) as ReminderHttp[]; // should filter out all the null values if any exist
            
            // Send remidners to max. 5 persons at a time
            const first5RemindersOnly: ReminderHttp[] = [];
            reminderHttpListWithoutNulls.forEach((reminderHttpWithoutNulls, index)=>{
                index <= 4 ? first5RemindersOnly.push(reminderHttpWithoutNulls) : null;
            });

            if(reminderHttpListWithoutNulls.length === 0){
                ConsoleColorLog.singleLog(`No datarecords/persons need a reminder right now.`, '', LogColors.GREEN);
            }
            debugger;

            console.log("Reminder list");
            reminderHttpList.forEach((reminderHttp, index)=>{
                console.log(index + " | TempId: " + reminderHttp?.getTempId() + " - CompleteId: "+reminderHttp?.getCompleteId() + " - MyId: "+reminderHttp?.getMyId() + " - " + reminderHttp?.getMessage());
            });
            this.datingAppController?.getReminders(first5RemindersOnly);
        });
    }

    public setDownloadNetworkLogs(): void {
        $('body').prepend(`
            <button class="downloadNetworkLogs" id="downloadNetworkLogs">Download logs</button>
        `);
        
        $(`body`).on("click", '[id="downloadNetworkLogs"]', () => {
            Overlay.setLoadingOverlay('downloadNetworkLogs', true);

            this.backgroundChannelPort?.postMessage(<PortMessage>{ 
                messageSender: 'CONTENT', 
                action: PortAction.GET_NETWORK_LOGS, 
                payload: "",
                datingAppType: this.datingAppType
            });
            
            if(!this.downloadNetworkLogsActiveNo){
                this.downloadNetworkLogsActiveNo = setTimeout(()=>{
                    if(this.downloadNetworkLogsActiveNo === null){
                        // apparantly even though the property above is set to null, this callback still fires after a certain amount of time
                        return;
                    }

                    Overlay.setLoadingOverlay('downloadNetworkLogs', false);
                    alert(`The call to get the network logs took had a timeout. Please check the console & console of the extension itself to find any errors.`);
                    this.downloadNetworkLogsActiveNo = null;
                }, 10000);
            }
        });
    }

    private deleteAppState(): void {
        if(this.keepAliveIntervalNumber != null){
            clearInterval(this.keepAliveIntervalNumber);
            this.keepAliveIntervalNumber = null;
        }

        this.dataStorage = new DataStorage();

        this.dataTable.emptyDataTable();
        this.datingAppType = DatingAppType.UNKNOWN;
        try{
            // todo: added code below in a try catch because IF backgroundscript was invalidated for some reason thus losing connection with my app (which is mostly in the content script)
            // AND if i were to close my app, thus running the code below, thus disconnecting again.. i would get a Uncaught Error: Extension context invalidated. error.
            // AND the loading spinner would yet again keep on loading forever 
            this.backgroundChannelPort?.disconnect();
        }catch(err){
            console.error(err)
        }
        const hasDatingAppControllerWatchersDisconnected = this.datingAppController?.disconnectAllUIWatchers();
        if(hasDatingAppControllerWatchersDisconnected){
            this.datingAppController = null;
        }
        this.importedFile = null;
    }

    private removeButtonsFromUI(): void {
        $(`body`).off("click", '[id="downloadButton"]');
        $(`body`).off("click", '[id="closeButton"]');
        $(`body`).off("click", '[id="reminderButton"]');
        $(`body`).off("click", '[id="downloadNetworkLogs"]');

        $('body #downloadButton').remove();
        $('body #closeButton').remove();
        $('body #reminderButton').remove();
        $('body #downloadNetworkLogs').remove();
    }

    private activateKeepAlive() {
        return setInterval(()=>{
            //console.log("sending keep alive");
            this.backgroundChannelPort?.postMessage(<PortMessage>{ 
                messageSender: 'CONTENT', 
                action: PortAction.KEEP_ALIVE, 
                payload: '',
                datingAppType: this.datingAppType
            });
        },4000)
    }
}
