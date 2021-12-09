import { resolve } from "path";
import { datingAppController } from "src/content/interfaces/controllers/datingAppController.interface";
import { RequestHandler } from "src/content/interfaces/http-requests/RequestHandler.interface";
import { Matches } from "src/content/interfaces/tinder_api/matches.interface";
import { RequestHandlerTinder } from "../http-requests/requestHandlerTinder";
import { Person } from "../tinder/Person";
import { UIController } from "../tinder/UIController";

export class TinderController implements datingAppController {
    private nameController = 'TinderController';
    listEndpoints = ['a', 'b', 'c'];
    hasCredentials = false;
    private dataRetrievalMethod: 'api' | 'dom' | null = null;

    private xAuthToken = '';
    private requestHandler!: RequestHandlerTinder; // 'definite assignment assertion proerty (!) added here, is this a good practice?'
    private UIController!: UIController;
    public matches: Person[] = [];

    constructor(dataRetrievalMethod: 'api' | 'dom' | null) {

        this.dataRetrievalMethod = dataRetrievalMethod;
        if (this.dataRetrievalMethod === 'api' || this.dataRetrievalMethod === 'dom') {
            if (this.dataRetrievalMethod === 'api') {
                this.hasCredentials = this.getCredentials();
                if (this.hasCredentials) {

                    //todo: test to see if auth token works by using a simple request first?
                    this.requestHandler = new RequestHandlerTinder(this.xAuthToken);

                    // TODO: 2. Gather data (by api's OR (less preferably) DOM)
                    this.getDataByAPI(this.requestHandler);

                    //TODO: Inplement add tinder UI support overlay 
                    // (e.g. add icon/color to match who hasn't replied in a week)
                    // export retrieved data to csv/json?
                    
                    
                    // Determine in chatmode or swipemode?
                    // Add UI helper?
                    this.setSwipeHelperOnScreen();
                    
                } else {
                    console.error(`Could not get credentials for tinder`);
                }
            }
            if (this.dataRetrievalMethod === 'dom') {
                console.error(`Data retrieveMethod DOM is not yet supported`);
            }
        }else{
            console.error(`Unknown data retrievelMethod for ${this.nameController}`);
        }

        this.UIController = new UIController();
        this.UIController.addUIControls(); // WORKS I can create my own UI using Jquery AND manipulate the DOM with Jquery (and possibly also the mutationObserver)

    }

    public getCredentials(): boolean {
        const tinderXAuthToken: string | null = localStorage.getItem('TinderWeb/APIToken');
        if (tinderXAuthToken && tinderXAuthToken.length > 0) {
            this.xAuthToken = tinderXAuthToken;
            return true;
        }
        return false;
    }

    public setSwipeHelperOnScreen() {
        // debugger;
        const html = `<form>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>`;
        $('.App__body').prepend('<button type="button" id="testingbutton" class="btn btn-success">Success</button>');
        $('.App__body').prepend(html);

        $(document).on("click", '.App__body #testingbutton', function (evt) {
            console.log('this works! 2');
            alert('this works! 2');
            console.dir($('#exampleInputEmail1').val())
        });
    }

    public getDataByAPI(requestHandler: RequestHandler):void {
        //todo: make seperate out logic in different methods because whilst 'getData' may be generic, getting it will differ for each supported app.
        console.log(`Getting tinder data`);

        if (requestHandler) {

            /*
            ATTEMPT recursive
            */

            // eslint-disable-next-line @typescript-eslint/ban-types
            const jack = function(fn:Function, times:number) {
                console.log(`De functie die ik mee krijg om uit te voeren is: ${fn}`);

                return new Promise(function(resolve, reject){
                    let error:Error;
                    const results:any[] = [];

                    const attempt = function(next_page_token?:string) {
                        next_page_token = next_page_token ? next_page_token : '';

                        console.log(`Dit is poging: ${times}`);
                        if (times === 0) {
                            reject(error);
                        } else {
                            fn(next_page_token).then((result: any)=>{
                                //todo: if result contains property to recur
                                console.log(`Resultaat jack (en next page token: ${next_page_token}) is:`);
                                console.dir(result);


                                results.push(result);
                                if(result.data.next_page_token){
                                    // eslint-disable-next-line no-debugger
                                    debugger;
                                    attempt(result.data.next_page_token);
                                    times = times-1;
                                }else{
                                    // eslint-disable-next-line no-debugger
                                    debugger;
                                    resolve(results);
                                }

                            })
                            .catch(function(e:Error){
                                    //times--;
                                    console.log(`Error jack is:`);
                                    console.dir(e);
                                    const error = e;
                                    reject(error);
                                    //setTimeout(function(){attempt()}, delay);
                                });
                        }
                    };
                    attempt();
                }).then((resultaten)=>{
                    // eslint-disable-next-line no-debugger
                    debugger;
                    console.dir(resultaten);
                    });
            };
            const test:string|null = localStorage.getItem('TinderWeb/APIToken') ? localStorage.getItem('TinderWeb/APIToken') : '';
            const ding = new RequestHandlerTinder(<string>test);
            jack(ding.getTinderMatches, 5);
            
            //note: track outgoing calls by this structure:
            // https://api.gotinder.com/{like|pass}/{_id}

            //note: track webRequests; (don't forget to enable this in permissions!)
            //https://developer.chrome.com/docs/extensions/reference/webRequest/

            //otherwise use this:
            // https://gist.github.com/benjamingr/0433b52559ad61f6746be786525e97e8

            // determine if the rerquest is sent by xmlhttp or ajax. if ajax, you can also use this;
            // https://www.npmjs.com/package/jquery-ajax-tracking?activeTab=readme

            // options;
            // https://stackoverflow.com/questions/43813770/how-to-intercept-all-http-requests-including-form-submits/43815800

            // mocht al het bovenstaande niet werken; 
            /*
            1. track current viewing person name, age evt. photo url
            2. get currentMatchesList
            3. track the button-click event waarbij de person wordt geliked
            4. on trigger; get matches, remove old currentMatches from new Matches list; only 1 match should remain, check if true otherwise throw big error & retry after 1 sec?
            5. check if match difference (which should be 1 match; our newest match); matches the name & age & evt. photo url
            6. get person info (tinder id etc.) on the match
            */

        }else{
            console.error(`The requestHandler was not set`);
            return;
        }
    }

    private getMatchesMessages() {
        //TODO: Add to getTinderData method
        //TODO: Inplement method
    }

}