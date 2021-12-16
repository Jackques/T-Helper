import { data } from 'jquery';
import { ParsedResultMessages } from 'src/content/interfaces/http-requests/MessagesListTinder.interface';
import { MatchListTinderAPI } from 'src/content/interfaces/http-requests/MatchesListTinder.interface';
import { RequestHandler } from 'src/content/interfaces/http-requests/RequestHandler.interface';
import { Matches } from  '../../interfaces/tinder_api/matches.interface';

export class RequestHandlerTinder implements RequestHandler {

    private getRandomCoupleHunderdMS():number{
        // for some reason,.. private classes dont work?
        return Math.floor(Math.random() * 100)+100;
    }

    public async getMatches(auth_token: string, next_page_token_num?:string):Promise<MatchListTinderAPI>{
        console.dir(`ik ga tindermatches ophalen, oh en de nextpagetokenis: ${next_page_token_num}`);
        const next_page_token = next_page_token_num ? '&page_token='+next_page_token_num : '';
        
        if(!auth_token){
            console.error(`Provided auth_token invalid!`);
        }

        //todo: inplement check to see if matches data structure? something like a throw catch to check if the value can be reached and if not.. throw a nice error

        const getMatches = new Promise<MatchListTinderAPI>((resolve, reject) => {
            // NOTE: Tinder gives you the 'next page of results' by providing the "next_page_token" provided with the previous request response if present
            // note 2: "message=0" if no messages have been exchanged yet, "message=1" if messages have been exchanged yet
            const ms = Math.floor(Math.random() * 100)+100;
            setTimeout(() => {
                console.log(`I delayed at: ${ms}`);
                fetch(`https://api.gotinder.com/v2/matches?locale=nl&count=100${next_page_token}`, {
                    method: 'GET',    
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': auth_token
                        }
                })
                .then(result => {
                    return result.json() 
                    // the result of the fetch is a promise, but calling .json on this result also returns a promise!
                    // the first .then return the json representation of the result, which is also a promise..
                }) 
                .catch(error => {
                    console.log(`tindermatches error! Error is:`);
                    console.dir(error);
                    reject(error);
                })
                .then(resultJSON => {
                    // console.log(`tindermatches JSON result is: ${resultJSON}`);
                    resolve(resultJSON);
                });
            }, ms);
        });
        return getMatches;
    }

    // public getMessagesFromMatch(auth_token: string, match_id: string, next_page_token_num?:string):Promise<ParsedResultMessages>{
    public getMessagesFromMatch(auth_token: string, match_id: string, next_page_token_num?:string):Promise<string>{
        const next_page_token = next_page_token_num ? '&page_token='+next_page_token_num : '';
        console.log('2a')

        // const getMatchMessages = new Promise<ParsedResultMessages>((resolve, reject) => {
        const getMatchMessages = new Promise<string>((resolve, reject) => {
            const ms = Math.floor(Math.random() * 100)+100;
            setTimeout(() => {
                console.log(`I delayed at: ${ms}`);
                //https://api.gotinder.com/v2/matches/528ce2770640a14b0f00007c601a943026064201006f6133/messages?locale=nl&count=100&page_token=MjAyMS0wNi0wNlQxOTo0Nzo0Ni4xMzJa
                fetch(`https://api.gotinder.com/v2/matches/${match_id}/messages?locale=nl&count=100${next_page_token}`, {
                    method: 'GET',    
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': auth_token
                        }
                })
                .then(result => {
                    console.log('2b');
                    return result.json() 
                })
                .catch(error => {
                    console.log(`tindermatchmessage error! Error is:`);
                    console.dir(error);
                    reject(error);
                })
                .then(resultJSON => {
                    console.log('2c');
                    console.log(`tindermatch message JSON result is:`);
                    console.dir(resultJSON);
                    resolve(resultJSON);
                });
            }, ms);
        });
        return getMatchMessages;

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

    // NOTE like/not like user:
    // https://api.gotinder.com/like/61aa9d0aa4ea490100ca143a?locale=nl
    // this sends a like to the user by that id

    //todo: code below gets the conversation with one of my old matches i had of which deleted me as a match, but apparantly the conversation is still there!
    // this means that the conversation still exists even if a match is no longer valid, thus i really need to check the data retrieved by my api's to ensure no false positives (like a 'ongoing'-conversation with a non-existing match)
}