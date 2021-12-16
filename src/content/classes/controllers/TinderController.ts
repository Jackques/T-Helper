import { resolve } from "path";
import { datingAppController } from "src/content/interfaces/controllers/datingAppController.interface";
import { ParsedResultMatch } from "src/content/interfaces/controllers/ParsedResultMatch.interface";
import { Message, ParsedResultMessages } from "src/content/interfaces/http-requests/MessagesListTinder.interface";
import { Match, MatchListTinderAPI } from "src/content/interfaces/http-requests/MatchesListTinder.interface";
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
                    this.requestHandler = new RequestHandlerTinder();

                    // TODO: 2. Gather data (by api's OR (less preferably) DOM)
                    this.getDataByAPI(this.requestHandler);

                    //TODO: 3. Extract data & add it to dataRecords

                    //TODO: 4 Inplement add tinder UI support overlay 
                    // (e.g. add icon/color to match who hasn't replied in a week)
                    // export retrieved data to csv/json?
                    
                    
                    // Determine in chatmode or swipemode?
                    // Add UI helper?
                    this.setSwipeHelperOnScreen();

                    // HINT: In order to scroll to the very bottom of the messageList in tinder;
                    /*
                    Use 
                    $0.children[$0.children.length-1].scrollIntoView()
                    and a few ms after use;
                    $0.scrollIntoView()
                    .. and repeat again, again and again untill you have the full list
                    */
                    
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

    public getDataByAPI(requestHandler: RequestHandlerTinder):void {
        //todo: make seperate out logic in different methods because whilst 'getData' may be generic, getting it will differ for each supported app.
        console.log(`Getting tinder data`);

        if (requestHandler) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            const getMatches = (fn:Function) => {

                return new Promise<ParsedResultMatch[]>((resolve, reject) =>{
                    const results:ParsedResultMatch[] = [];

                    const attempt = (next_page_token?:string) => {
                        next_page_token = next_page_token ? next_page_token : '';

                            fn(this.xAuthToken, next_page_token)
                            .then((parsedResult: MatchListTinderAPI)=>{
                                if(parsedResult?.data?.matches){
                                    // results = [...results, ...parsedResult.data.matches];

                                    parsedResult?.data?.matches.forEach((match: Match)=>{
                                        results.push(
                                            {
                                            match: match,
                                            matchMessages: []
                                        }
                                        );
                                    });
                                }
                                
                                if(parsedResult.data.next_page_token){
                                    attempt(parsedResult.data.next_page_token);
                                }else{
                                    resolve(results);
                                }
                            })
                            .catch(function(e:Error){
                                    console.log(`Error retrieving matches:`);
                                    console.dir(e);
                                    const error = e;
                                    reject(error);
                                });
                        
                    };
                    attempt();
                })
            };
            getMatches(requestHandler.getMatches).then((matchList:ParsedResultMatch[])=>{

                // const test: any[] = [];

                // matchList.forEach((resultMatch, index, matchList)=>{
                //     // console.log(`Match name: ${match.person.name} en match id: ${match.id}`);
                //     if(index === 172){
                //         // TEMP: only set above check to 172 because i don't want to get messages for every match just yet!
                //         // console.log(`oh and the matchList is:`);
                //         console.dir(matchList);

                //         requestHandler.getMessagesFromMatch(this.xAuthToken, resultMatch.match.id)
                //         .then((messages:ParsedResultMessages)=>{
                //             // debugger;
                //             matchList[index].matchMessages = messages.data.messages;
                //             // debugger;
                //             console.log(`No 172 matchMessages are: `);
                //             console.dir(matchList[index].matchMessages);

                //             //TODO: Make recursive getting the messages
                //         });
                //     }

                //     if(index < 10){
                //         test.push(requestHandler.getMessagesFromMatch(this.xAuthToken, resultMatch.match.id));
                //         Promise.allSettled(test).then((retrievedValues:PromiseSettledResult<ParsedResultMessages>[])=>{
                //             console.log(`this only fires once right? Value of retrievedValues below`);
                //             retrievedValues.forEach((retrievedValue)=>{
                //                 console.log(retrievedValue.status)
                //             })
                //             console.log(`this only fired once right?`);
                //         });
                //     }
                // });


                const getMatchesMessages = async (fn:Function, id:string) => {
                    console.log('START');
                    console.log(1);


                    return await new Promise<Message[]>((resolve, reject) =>{
                        console.log(2);
                        let resultsMessages:Message[] = [];
                        const attempt = async (next_page_token?:string) => {
                            next_page_token = next_page_token ? next_page_token : '';
                            
                            await fn(this.xAuthToken, id, next_page_token)
                            .then(async (messages: ParsedResultMessages)=>{
                                console.log(3);
                                console.log('END');
                                //todo: add messages to the matchMessages for this person
                                // return resolve('duck');

                                resultsMessages = [...resultsMessages, ...messages.data.messages]
                                if(messages.data.next_page_token){
                                    await attempt(messages.data.next_page_token);
                                }else{
                                    return resolve(resultsMessages);
                                }
                            })
                            .catch((e: Error)=>{
                                console.log(4);
                                console.log('END');
                                return resolve([]);
                                console.log(`Error retrieving match messages:`);
                                console.dir(e);
                                const error = e;
                                reject(error);
                            })
                        };
                        attempt();
                    });

                

                };
                async function test(){
                    for (let i = 0; i < matchList.length; i++) {
                        matchList[i].matchMessages = await getMatchesMessages(requestHandler.getMessagesFromMatch, matchList[i].match.id)
                        if(i > 25){
                            console.log('CONGRATZ you reached the end!');
                            // eslint-disable-next-line no-debugger
                            debugger;
                        }
                    }
                }
                test();

                // async function getMatchMessages(matchList: ParsedResultMatch[]){
                //     for (let i=0; i < matchList.length; i++) {
                //         matchList[i].matchMessages = await matchList[i].matchMessages();
                //         console.log('succes!');
                //         console.dir(matchList[i].matchMessages);
                //         console.log('--------------------------------------------------');
                //     }
                // }
                // getMatchMessages(matchList);
                

            });
            
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

            // NOTE: Tinder workings;
            /* 
            There is a https://api.gotinder.com/v2/recs/core?locale=nl request which gives you 25 profile recommendations at a time, which contains for each user the user object which contains the id's, name, age, birthdate, picture etc.
            maybe this info would be handy to log/record as well?
            e.g.how many user recommendations i get which;
            1. have profile text
            2. are verified
            3. more???
            4. also contains pics,.. so in theory could build my own tinder app UI
            */

        }else{
            console.error(`The requestHandler was not set`);
            return;
        }
    }

}