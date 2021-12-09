import { RequestHandler } from 'src/content/interfaces/http-requests/RequestHandler.interface';
import { Matches } from  '../../interfaces/tinder_api/matches.interface';

export class RequestHandlerTinder implements RequestHandler {
    apiList: string[] = [];
    private xhr:XMLHttpRequest = new XMLHttpRequest();
    private authCode: string;

    constructor(authCode:string){
        this.authCode = authCode;
    }
    public async getMatches():Promise<Matches> {
        //todo: inplement recursive capabilities since a profile probably has over 100 matches and i need to get more than just the first 100
        //todo: inplement check to see if matches data structure? something like a throw catch to check if the value can be reached and if not.. throw a nice error
        // return await (await this.getTinderMatches()).data.matches;

        const test = await this.getTinderMatches().then((test)=>{
            // eslint-disable-next-line no-debugger
            debugger;
            return test as Matches;
        });
        // debugger;
        return test;
        // test.then((test: string)=>{
        //     // eslint-disable-next-line no-debugger
        //     debugger;
        //     return resolve(test);
        // })
        //PRODUCES ERROR
    }

    // public async getTinderMatches(next_page_token_num?:number):Promise<unknown>{
    //     console.dir(`ik ga tindermatches ophalen, oh en de nextpagetokenis: ${next_page_token_num}`);
    //     const next_page_token = next_page_token_num ? '&page_token='+next_page_token_num : 0;

    //     return await fetch(`https://api.gotinder.com/v2/matches?locale=nl&count=100&message=0&is_tinder_u=false${next_page_token}`, {
    //         method: 'GET',    
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-Auth-Token': <string>localStorage.getItem('TinderWeb/APIToken') //todo: for some reason, apitoken was not set!
    //             }
    //     })
    //     .then(result => {
    //         // eslint-disable-next-line no-debugger
    //         debugger;
    //         console.log(`tindermatchesophalen succes, result is: ${result}`);
    //         // resolve(result.json())
    //         return result.json() // the result of the fetch is a promise, but calling .json on this result also returns a promise!
    //     }) // the first .then return the json representation of the result, which is also a promise..
    //     .catch(error => {
    //         console.log(`tindermatches error! Error is:`);
    //         console.dir(error);
    //     })
    //     .then(resultJSON => {
    //         // eslint-disable-next-line no-debugger
    //         debugger;
    //         console.log(`tindermatches JSON result is: ${resultJSON}`);
    //         // return resolve(resultJSON)
    //         resolve(resultJSON);
    //         return;
    //         // return resultJSON // ..which is resolved here, therefore this result (the actual matches) are returned to getMatches() in the form of a promise!
    //     });
    // }
    public async getTinderMatches(next_page_token_num?:number, ):Promise<unknown>{
        console.dir(`ik ga tindermatches ophalen, oh en de nextpagetokenis: ${next_page_token_num}`);
        const next_page_token = next_page_token_num ? '&page_token='+next_page_token_num : 0;

        const getMatches = new Promise<any>((resolve, reject) => {
            // NOTE: Tinder gives you the 'next page of results' by providing the "next_page_token" provided with the previous request response if present
            // note 2: "message=0" if no messages have been exchanged yet, "message=1" if messages have been exchanged yet
            fetch(`https://api.gotinder.com/v2/matches?locale=nl&count=25&message=0&is_tinder_u=false${next_page_token}`, {
                method: 'GET',    
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': <string>localStorage.getItem('TinderWeb/APIToken') //todo: for some reason, apitoken was not set!
                    }
            })
            .then(result => {
                // eslint-disable-next-line no-debugger
                // debugger;
                console.log(`tindermatchesophalen succes, result is: ${result}`);
                // resolve(result.json())
                return result.json() // the result of the fetch is a promise, but calling .json on this result also returns a promise!
            }) // the first .then return the json representation of the result, which is also a promise..
            .catch(error => {
                console.log(`tindermatches error! Error is:`);
                console.dir(error);
            })
            .then(resultJSON => {
                // eslint-disable-next-line no-debugger
                // debugger;
                console.log(`tindermatches JSON result is: ${resultJSON}`);
                // return resolve(resultJSON)
                resolve(resultJSON);
                return;
                // return resultJSON // ..which is resolved here, therefore this result (the actual matches) are returned to getMatches() in the form of a promise!
            });
        });
        return getMatches;
        
    }

    public getMessagesFromMatch(){
        console.log(`needs to be inplemented`);

        //https://api.gotinder.com/v2/matches/528ce2770640a14b0f00007c601a943026064201006f6133/messages?locale=nl&count=100&page_token=MjAyMS0wNi0wNlQxOTo0Nzo0Ni4xMzJa
        // example response (note: messages are from most recent to first, so the first few messageobjects in array are the most recent ones!):
        // data: {
        //     messages: [{
        //     created_date: "2021-06-06T19:47:36.682Z"
        //     from: "528ce2770640a14b0f00007c"
        //     match_id: "528ce2770640a14b0f00007c601a943026064201006f6133"
        //     message: "I added your number but i do not see support for whatsapp"
        //     sent_date: "2021-06-06T19:47:36.682Z"
        //     timestamp: 1623008856682
        //     to: "601a943026064201006f6133"
        //     _id: "60bd2658b38e7e0100ec2f0f"
        // }],
        //     next_page_token: "MjAyMS0wNi0wMlQwNTo1Mjo0My4wNjha"
        // }
    }

    //todo: code below gets the conversation with one of my old matches i had of which deleted me as a match, but apparantly the conversation is still there!
    // this means that the conversation still exists even if a match is no longer valid, thus i really need to check the data retrieved by my api's to ensure no false positives (like a 'ongoing'-conversation with a non-existing match)

    /*
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.gotinder.com/v2/matches/528ce2770640a14b0f00007c5831fcfe4da7d8b50efda2fe/messages?locale=nl&count=100&page_token=MjAyMS0wNS0yM1QxODoyNjozNi41MTBa");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("User-agent", "Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)");

    const test = localStorage.getItem('TinderWeb/APIToken');
    // debugger;
    xhr.setRequestHeader('X-Auth-Token', test);
    // get auto by intercepting http request headers OR manually by checking network tab to get  x-auth-token 
    TODO: Learn how to track http requests (and their headers) here: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests
    // WORKSSSS! F*CKINGGG WORKSSSSSS!!!! all because i needed to get & set the access token here!
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            debugger; // WORKS, but no body
            var body = xhr.responseText;
            // call some function to do something with the html body

        }
    }
    xhr.send(JSON.stringify(
        // {'facebook_token': INSERT_HERE, 'facebook_id': INSERT_HERE}
    ));
    */
}