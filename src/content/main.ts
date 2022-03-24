import 'regenerator-runtime/runtime'
import { SubmitAction } from 'src/background/requestInterceptor';
import { FileHelper } from '../fileHelper';
import { parse } from 'tldts';
import { TinderController } from './classes/controllers/TinderController';
import { DataRecord } from './classes/data/dataRecord';
import { dataStorage } from './classes/data/dataStorage';
import { DataTable } from './classes/data/dataTable';
import { RequestHandlerTinder } from './classes/http-requests/requestHandlerTinder';
import { DataRecordValues } from './interfaces/data/dataRecordValues.interface';
import { PortMessage } from './interfaces/portMessage.interface';
import { UIFieldsRenderer } from './classes/controllers/UIFieldsRenderer';

export class Main {
    private datingAppController: TinderController | undefined | null; //todo: should remove undefined/null properties in the future
    private datingAppType = '';

    private dataTable: DataTable = new DataTable();
    private dataStorage: dataStorage = new dataStorage();
    private uiRenderer: UIFieldsRenderer = new UIFieldsRenderer();
    private importedFile: FileHelper | null = null;

    constructor() {
        //console.log(`The main app constructor content works`);

        chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
            console.assert(port.name === "knockknock");
            port.onMessage.addListener((portMessage: PortMessage) => {
                if (portMessage.messageSender === 'POPUP' && portMessage.action === 'INIT') {
                    //console.log(`I received the following message payload: `);
                    //console.dir(msg.payload);

                    //todo: Move this checking logic to popup,.. IN THE FUTURE so I don't have to press a button and find out AFTERWARDS that I shouldnt have pressed it because i wasnt on a recognized dating app
                    this.datingAppType = this.checkDatingApp();
                    if (this.datingAppType.length > 0) {
                        // this.dataTable = new DataTable();

                        //for every entry i the list received in payload
                        //todo: CURRENTLY; i ASSUME the dataTable will be empty (which it most likely is), but maybe i would want to check here if prior data already exists, thus updating data rather than creating new records
                        const importedRecords = portMessage.payload as any[];
                        importedRecords.forEach((msg: DataRecordValues[]) => {
                            const newDataRecord = new DataRecord();

                            const isDataAddedSuccesfully: boolean = newDataRecord.addDataToDataFields(msg);
                            if (isDataAddedSuccesfully && this.dataTable !== null) {
                                this.dataTable.addNewDataRecord(newDataRecord, this.datingAppType);
                            } else {
                                console.error(`Error adding data from import. Please check data fields from import and error log.`);
                            }
                        });

                        //todo: maybe should seperate out the logic for init app and actually getting the imported data?
                        this.datingAppController = this.initAppController(this.datingAppType, this.dataTable, this.dataStorage);
                        this.setCloseButton();
                    }
                }
            });
            port.onMessage.addListener((msg: PortMessage) => {
                if (msg.messageSender === 'BACKGROUND' && msg.action === 'SUBMIT_ACTION') {
                    console.log(`Received submit action from background script: `);
                    console.dir(msg);
                    const message = msg.payload as any[];
                    this.dataStorage.addActionToDataStore(<SubmitAction>message[0]);
                }
            });
            port.onMessage.addListener((msg: PortMessage) => {
                if (msg.messageSender === 'POPUP' && msg.action === 'FILENAME') {
                    console.log(`Received filename from popup: `);
                    console.dir(msg);
                    this.importedFile = new FileHelper(msg.payload as string);
                    this.setDownloadExportButton(this.dataTable, this.importedFile);
                }
            })
        });
    }

    private checkDatingApp(): string {
        switch (parse(window.location.hostname).domainWithoutSuffix) {
            case "tinder":
                console.log('You are on tinder');
                return 'tinder';
            case "happn":
                console.log('You are on happn');
                return 'happn';
            default:
                console.log('Did not recognize app');
                return '';
        }
    }

    private initAppController(appType: string, dataTable: DataTable, dataStorage: dataStorage) {
        switch (appType) {
            case "tinder":
                return new TinderController('api', dataTable, dataStorage);
            case "happn":
                alert('Happn is not yet supported');
                return undefined;
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
            element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(dataTable.getRecordValuesObject()));
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
            this.uiRenderer.setLoadingOverlay('closeAppAction', true);
            
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
                    this.uiRenderer.setLoadingOverlay('closeAppAction', false);
                    console.log(txt);
                    closeButtonPromptActiveNo = null;
                }, 100);
            }

        });
    }

    private deleteAppState(): void {
        this.dataStorage = new dataStorage();

        this.dataTable.emptyDataTable();
        this.datingAppType = '';
        const hasDatingAppControllerWatchersDisconnected = this.datingAppController?.disconnectAllUIWatchers();
        if(hasDatingAppControllerWatchersDisconnected){
            this.datingAppController = null;
        }
        this.importedFile = null;
    }

    private removeButtonsFromUI(): void {
        $(`body`).off("click", '[id="downloadButton"]');
        $(`body`).off("click", '[id="closeButton"]');

        $('body #downloadButton').remove();
        $('body #closeButton').remove();
    }
}
