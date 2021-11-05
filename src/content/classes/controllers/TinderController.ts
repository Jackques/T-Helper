import { RequestHandler } from "src/content/http-requests/requestHandler";
import { datingAppController } from "src/content/interfaces/controllers/datingAppController.interface";
import { Matches } from "src/content/interfaces/tinder_api/matches.interface";
import { Person } from "../tinder/Person";
import { UIController } from "../tinder/UIController";

export class TinderController implements datingAppController {
    listEndpoints = ['a', 'b', 'c'];
    hasCredentials = false;

    private xAuthToken = '';
    private requestHandler!: RequestHandler; // 'definite assignment assertion proerty (!) added here, is this a good practice?'
    private UIController!: UIController;
    public matches: Person[] = [];
    
    constructor(){
        this.hasCredentials = this.getCredentials();
        if(this.hasCredentials){
            // Gather data chats from DOM? endpoint?
            // Load imported JSON
            // Determine in chatmode or swipemode?
            // Add UI helper?

            // TODO: 2. Gather data (by api's OR (less preferably) DOM)
            // TODO: 3. Determine if said datingapp is in 'swipe / overview potential dates' or in 'chat mode'
            //TODO: Inplement retrieve tinder data
            //TODO: Inplement add tinder UI support overlay 
            // (e.g. add icon/color to match who hasn't replied in a week)
            // export retrieved data to csv/json?
            this.requestHandler = new RequestHandler(this.xAuthToken);
            this.getImportedData();
            this.getLiveData();


            this.UIController.addUIControls(); // WORKS I can create my own UI using Jquery AND manipulate the DOM with Jquery (and possibly also the mutationObserver)
        }
    }

    public getCredentials(): boolean {
        const tinderXAuthToken:string | null = localStorage.getItem('TinderWeb/APIToken');
        if (tinderXAuthToken && tinderXAuthToken.length > 0) {
            this.xAuthToken = tinderXAuthToken;
            return true;
        }
        return false;
    }

    public getImportedData(){
        // todo: read the data from the imported .csv/.json & add it to the central Person class
    }

    public getLiveData() {
        //todo: make seperate out logic in different methods because whilst 'getData' may be generic, getting it will differ for each supported app.
        console.log(`Getting tinder data`);

        if(this.requestHandler){
            this.requestHandler.getTinderMatches()
            .then((response:Matches)=>{
                if(response.data.next_page_token && this.requestHandler){
                    //TODO: This shoudl actually become recursive, now it only preforms 2 loops max.
                    this.requestHandler.getTinderMatches(response.data.next_page_token)
                }
                // TODO: should make apiResponseInterface for match api response
                // debugger;
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

}