import 'regenerator-runtime/runtime'
import { parse } from 'tldts';
import { TinderController } from './classes/controllers/TinderController';
import { Matches } from './interfaces/tinder_api/matches.interface'; 
import { Person } from './classes/tinder/Person'; 
import { UIController } from "./classes/tinder/UIController"

export class Main {
    private tinderXAuthToken: string | null;
    private UIController: UIController = new UIController;

    private datingAppType: string;
    public matches: Person[] = [];

    private requestHandler: RequestHandler | undefined;

    constructor() {
        console.log(`constructor content works`);

        // TODO: 0. Only activate when we've gotten signal from popup?

        // TODO: 1. Determine what datingapp we are using (tinder, happn, etc.)
        // TODO: 2. Gather data (by api's OR (less preferably) DOM)
        // TODO: 3. Determine if said datingapp is in 'swipe / overview potential dates' or in 'chat mode'

        
        this.tinderXAuthToken = localStorage.getItem('TinderWeb/APIToken');
        if (this.tinderXAuthToken) {
            const authCodes:AuthCodes = {
                tinder_xAuthToken: this.tinderXAuthToken
            };
            this.requestHandler = new RequestHandler(authCodes);
            this.getTinderData(); // WORKS but temporarily disabled to test if I can also easily test UI here
        }

        //TODO: Inplement retrieve tinder data

        //TODO: Inplement add tinder UI support overlay 
        // (e.g. add icon/color to match who hasn't replied in a week)
        // export retrieved data to csv/json?
        
        this.UIController.addUIControls(); // WORKS I can create my own UI using Jquery AND manipulate the DOM with Jquery (and possibly also the mutationObserver)
        chrome.runtime.onMessage.addListener( (message, sender, sendResponse) =>{
            if(message.type === 'Activate'){
                //todo: check amITinder? Maybe move this checking logic to popup,.. IN THE FUTURE so I don't have to press a button and find out AFTERWARDS that I shouldnt have pressed it because i wasnt on a recognized dating app
                this.datingAppType = this.checkDatingApp();
                this.initApp(this.datingAppType);
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

    private initApp(appType: string){
        switch(appType){
            case "tinder":
                console.log('you are on tinder');
                // do tinder stuff, maybe actiavte tinder own class?
                this.getTinderCredentials();
                break;
            case "happn":
                console.log('you are on happn');
                break;
            default:
                console.log('did not recognize app');
        }
    }

    private getTinderCredentials(){
        console.log('getTinderCredentials');
        //todo: check if logged in,.. by url?
    }

    private getTinderData() {
        console.log(`Getting tinder data`);

        if(this.requestHandler){
            this.requestHandler.getTinderMatches()
            .then((response:Matches)=>{
                if(response.data.next_page_token && this.requestHandler){
                    //TODO: This shoudl actually become recursive, now it only preforms 2 loops max.
                    this.requestHandler.getTinderMatches(response.data.next_page_token)
                }
                // TODO: should make apiResponseInterface for match api response
                debugger;
                console.log(`Got tinder matches`);
                response.data.matches.forEach((match: any) => {
                    this.matches.push(new Person(match));
                }, this);
            })
            .catch((err)=>{
                // TODO: Inplement nicer error response
                throw new Error(err);
            });

        }
    }

    private getMatchesMessages(){
        //TODO: Add to getTinderData method
        //TODO: Inplement method
    }

    public exportTinderDataToJson(){
        //TODO: Inplement method
    }

    public importTinderDataFromJson(){
        //TODO: Inplement, import, compare data & add where needed (e.g. when an unmatch happend, fill in the gaps or update the messages)

        //TODO: (NEW APP IDEA;) Inplement statistic methods (and easy-to-create-said-methods) to answer questions in PSYCHOLOGIE/Vragen-te-beantwoorden-met-nepprofielen
    }
}