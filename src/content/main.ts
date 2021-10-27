import 'regenerator-runtime/runtime'
import { RequestHandler } from './http-requests/requestHandler'
import { AuthCodes } from './interfaces/tinder_api/authCodes.interface';
import { Matches } from './interfaces/tinder_api/matches.interface'; 
import { Person } from './classes/tinder/Person'; 
import { UIController } from "./classes/tinder/UIController"

export class Main {
    private tinderXAuthToken: string | null;
    private UIController: UIController = new UIController;
    public matches: Person[] = [];

    private requestHandler: RequestHandler | undefined;

    constructor() {
        console.log(`constructor content works`);

        
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