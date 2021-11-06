import { Matches } from  '../../interfaces/tinder_api/matches.interface';

export class RequestHandler {
    xhr:XMLHttpRequest = new XMLHttpRequest();
    private authCode: string;

    constructor(authCode:string){
        this.authCode = authCode;
    }

    public async getTinderMatches(next_page_token?:string): Promise<Matches>{
        next_page_token = next_page_token ? '&page_token='+next_page_token : undefined;
        //let data;
        // let url = new RequestInfo();
        const response = await fetch(`https://api.gotinder.com/v2/matches?locale=nl&count=100&message=0&is_tinder_u=false${next_page_token}`, {
            method: 'GET',    
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': this.authCode
                }
        });
        return await response.json();
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