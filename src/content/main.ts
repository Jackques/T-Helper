import 'regenerator-runtime/runtime'
import { SubmitAction } from 'src/background/requestInterceptor';
import { parse } from 'tldts';
import { TinderController } from './classes/controllers/TinderController';
import { DataRecord } from './classes/data/dataRecord';
import { dataStorage } from './classes/data/dataStorage';
import { dataTable } from './classes/data/dataTable';
import { DataRecordValues } from './interfaces/data/dataRecordValues.interface';
import { PortMessage } from './interfaces/portMessage.interface';

export class Main {
    private datingAppController: TinderController | undefined | null; //todo: should remove undefined/null properties in the future
    private datingAppType = '';

    private dataTable: dataTable = new dataTable();
    private dataStorage = new dataStorage();
    
    constructor() {
        //console.log(`The main app constructor content works`);

        chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
            console.assert(port.name === "knockknock");
            port.onMessage.addListener((msg: portMessage) => {
            if(msg.message === 'initApp'){
                //console.log(`I received the following message payload: `);
                //console.dir(msg.payload);
                
                //todo: Move this checking logic to popup,.. IN THE FUTURE so I don't have to press a button and find out AFTERWARDS that I shouldnt have pressed it because i wasnt on a recognized dating app
                this.datingAppType = this.checkDatingApp();
                if(this.datingAppType.length > 0){

                    //for every entry i the list received in payload
                    //todo: CURRENTLY; i ASSUME the dataTable will be empty (which it most likely is), but maybe i would want to check here if prior data already exists, thus updating data rather than creating new records
                    msg.payload.forEach((msg:DataRecordValues[])=>{
                        this.dataTable.addNewDataRecord(msg);
                    });

                        this.datingAppController = this.initAppController(this.datingAppType, this.dataTable, this.dataStorage);
                }
            }
            });
            port.onMessage.addListener((msg: PortMessage) => {
                if(msg.messageSender === 'BACKGROUND' && msg.action === 'SUBMIT_ACTION'){
                    console.dir(msg);
                    console.log(`do stuff`);
                    // eslint-disable-next-line no-debugger
                    debugger;

                    this.dataStorage.addActionToDataStore(<SubmitAction>msg.payload[0]);
                }
            })
        });
    }

    private checkDatingApp():string{
        switch(parse(window.location.hostname).domainWithoutSuffix){
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

    private initAppController(appType: string, dataTable: dataTable, dataStorage: dataStorage){
        switch(appType){
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

    //TODO: import & export methods go to seperate data json class?
    public exportTinderDataToJson(){
        //TODO: Inplement method
    }

    public importTinderDataFromJson(){
        //TODO: Inplement, import, compare data & add where needed (e.g. when an unmatch happend, fill in the gaps or update the messages)

        //TODO: (NEW APP IDEA;) Inplement statistic methods (and easy-to-create-said-methods) to answer questions in PSYCHOLOGIE/Vragen-te-beantwoorden-met-nepprofielen
    }
}
