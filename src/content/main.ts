import 'regenerator-runtime/runtime'
import { parse } from 'tldts';
import { TinderController } from './classes/controllers/TinderController';
import { DataRecord } from './classes/data/dataRecord';

export class Main {
    private datingAppController: TinderController | undefined | null; //todo: should remove undefined/null properties in the future
    private datingAppType = '';

    public dataRecords: DataRecord[] = [];
    
    constructor(dataRecords: DataRecord[]) {
        this.dataRecords = [];
        console.log(`constructor content works`);

        chrome.runtime.onConnect.addListener(port => {
            console.log('connected ', port);
          
            if (port.name === 'hi') {
              port.onMessage.addListener(function(test){
                  console.log(test);
                  console.log('hey, i got something!');
              });
            }
          });
          
        chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
            //todo: if already active, do not activate again?
            console.log('we got a message!');
            console.log(message);
            if(message.message === 'initApp'){
                //todo: Move this checking logic to popup,.. IN THE FUTURE so I don't have to press a button and find out AFTERWARDS that I shouldnt have pressed it because i wasnt on a recognized dating app
                this.datingAppType = this.checkDatingApp();
                if(this.datingAppType.length > 0){
                    this.datingAppController = this.initAppController(this.datingAppType);
                }
                //todo: if so, init getTinderAuth
            }
            return true;
            //todo: unknown event received in content
        });

        // chrome.tabs.executeScript(null, {file:'js/jquery-2.1.1.min.js'}, function(result){
        //     chrome.tabs.executeScript(null, {file:'js/myscript.js'});
        // });

                // DOES NOT SEEM TO WORK? DESPITE JQUERY BEING LOADED..
                //Load jQuery library using plain JavaScript
                (function(){
                    const newscript = document.createElement('script');
                    newscript.type = 'text/javascript';
                    newscript.async = true;
                    //newscript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js';
                    newscript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
                    (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
                })();
        
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