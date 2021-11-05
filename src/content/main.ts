import 'regenerator-runtime/runtime'
import { parse } from 'tldts';
import { TinderController } from './classes/controllers/TinderController';

export class Main {
    private datingAppController: TinderController | undefined | null; //todo: need work
    private datingAppType = '';
    
    constructor() {
        console.log(`constructor content works`);

        chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
            if(message.type === 'Activate'){
                //todo: check amITinder? Maybe move this checking logic to popup,.. IN THE FUTURE so I don't have to press a button and find out AFTERWARDS that I shouldnt have pressed it because i wasnt on a recognized dating app
                this.datingAppType = this.checkDatingApp();
                if(this.datingAppType.length){
                    this.datingAppController = this.initAppController(this.datingAppType);
                }
                //todo: if so, init getTinderAuth
            }
            //todo: unknown event received in content
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

    private initAppController(appType: string){
        switch(appType){
            case "tinder":
                return new TinderController();
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