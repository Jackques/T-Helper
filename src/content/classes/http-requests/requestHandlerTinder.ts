import { data } from 'jquery';
import { ParsedResultMessages, TinderMessage } from 'src/content/interfaces/http-requests/MessagesListTinder.interface';
import { Match, MatchApi, MatchListTinderAPI } from 'src/content/interfaces/http-requests/MatchesListTinder.interface';
import { RequestHandler } from 'src/content/interfaces/http-requests/RequestHandler.interface';
import { Matches } from '../../interfaces/tinder_api/matches.interface';
import { ParsedResultMatch } from 'src/content/interfaces/controllers/ParsedResultMatch.interface';
import { MatchDetailsAPI } from 'src/content/interfaces/http-requests/MatchDetailsAPI.interface';
import { ReminderHttp } from '../data/ReminderHttp';

export class RequestHandlerTinder implements RequestHandler {

    private xAuthToken: string;

    constructor(xAuthToken: string) {
        this.xAuthToken = xAuthToken;
    }

    private getRandomCoupleHunderdMS(): number {
        // for some reason,.. private classes dont work?
        return Math.floor(Math.random() * 100) + 100;
    }

    public async getMatches(auth_token: string, next_page_token_num?: string): Promise<MatchListTinderAPI> {
        console.dir(`ik ga tindermatches ophalen, oh en de nextpagetokenis: ${next_page_token_num}`);
        const next_page_token = next_page_token_num ? '&page_token=' + next_page_token_num : '';

        if (!auth_token) {
            console.error(`Provided auth_token invalid!`);
        }

        //todo: inplement check to see if matches data structure? something like a throw catch to check if the value can be reached and if not.. throw a nice error

        const getMatches = new Promise<MatchListTinderAPI>((resolve, reject) => {
            // NOTE: Tinder gives you the 'next page of results' by providing the "next_page_token" provided with the previous request response if present
            // note 2: "message=0" if no messages have been exchanged yet, "message=1" if messages have been exchanged yet
            const ms = Math.floor(Math.random() * 100) + 100;
            setTimeout(() => {
                // console.log(`I delayed at: ${ms}`); //todo: figure out why i cannot call the this.getRandomCoupleHunderdMS method here
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
    public getMessagesFromMatch(auth_token: string, match_id: string, next_page_token_num?: string): Promise<ParsedResultMessages> {
        const next_page_token = next_page_token_num ? '&page_token=' + next_page_token_num : '';
        console.log('2a')

        // const getMatchMessages = new Promise<ParsedResultMessages>((resolve, reject) => {
        const getMatchMessages = new Promise<ParsedResultMessages>((resolve, reject) => {
            const ms = Math.floor(Math.random() * 100) + 100;
            setTimeout(() => {
                // console.log(`I delayed at: ${ms}`); //todo: figure out why i cannot call the this.getRandomCoupleHunderdMS method here
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

    //todo: code below gets the conversation with one of my old matches i had of which deleted me as a match, but apparantly the conversation is still there!
    // this means that the conversation still exists even if a match is no longer valid, thus i really need to check the data retrieved by my api's to ensure no false positives (like a 'ongoing'-conversation with a non-existing match)


    // NOTE like/not like user:
    // https://api.gotinder.com/like/61aa9d0aa4ea490100ca143a?locale=nl
    // this sends a like to the user by that id

    // private getMatchesStart = (fn:(Function)):Promise<ParsedResultMatch[]> => {
    public getMatchesStart(): Promise<ParsedResultMatch[]> {

        return new Promise<ParsedResultMatch[]>((resolve, reject) => {
            const results: ParsedResultMatch[] = [];

            const attempt = (next_page_token?: string) => {
                next_page_token = next_page_token ? next_page_token : '';

                this.getMatches(this.xAuthToken, next_page_token)
                    .then((parsedResult: MatchListTinderAPI) => {
                        if (parsedResult?.data?.matches) {

                            parsedResult?.data?.matches.forEach((match: Match) => {
                                results.push(
                                    {
                                        match: match,
                                        matchMessages: []
                                    }
                                );
                            });
                        }

                        if (parsedResult.data.next_page_token) {
                            attempt(parsedResult.data.next_page_token);
                        } else {
                            console.log(`Finished getting results:`);
                            console.dir(results);
                            resolve(results);
                        }
                    })
                    .catch(function (e: Error) {
                        console.log(`Error retrieving matches:`);
                        console.dir(e);
                        const error = e;
                        reject(error);
                    });

            };
            attempt();
        })
    }

    public getMatchesMessagesStart(id: string): Promise<TinderMessage[]> {

        console.log(`STARTED - GETTING MESSAGES FOR: ${id}`);

        return new Promise<TinderMessage[]>((resolve, reject) => {
            console.log(2);
            let resultsMessages: TinderMessage[] = [];
            const attempt = async (next_page_token?: string) => {
                next_page_token = next_page_token ? next_page_token : '';

                await this.getMessagesFromMatch(this.xAuthToken, id, next_page_token)
                    .then(async (messages: ParsedResultMessages) => {
                        console.log(3);
                        resultsMessages = [...resultsMessages, ...messages.data.messages]
                        if (messages.data.next_page_token && messages.data.next_page_token?.length > 0) {
                            console.log(`START CONTINUE: Got a page token so need to get more messages for ${id}`);
                            await attempt(messages.data.next_page_token);
                        } else {
                            console.log(`ENDED - Getting MESSAGES FOR: ${id} && i got a next_page_token: ${next_page_token}`);
                            return resolve(resultsMessages);
                        }
                    })
                    .catch((e: Error) => {
                        console.log(4);
                        console.log(`ENDED (ERROR) - Getting MESSAGES FOR: ${id}`);
                        return reject([]);
                        console.log(`Error retrieving match messages:`);
                        console.dir(e);
                        const error = e;
                        reject(error);
                    })
            };
            attempt();
        });

    }

    public async getProfileDetailsStart(personId: string): Promise<MatchDetailsAPI> {
        return new Promise<MatchDetailsAPI>((resolve, reject) => {
            const attempt = async () => {
                await this.getProfileDetails(this.xAuthToken, personId)
                    .then(async (profileData: MatchDetailsAPI) => {
                        // console.log(profileData);
                        resolve(profileData);
                    })
                    .catch((e: Error) => {
                        // console.log(e);
                        reject(e);
                    })
            };
            attempt();
        });
    }

    public getProfileDetails(xAuthToken: string, id: string): Promise<MatchDetailsAPI> {
        return new Promise<MatchDetailsAPI>((resolve, reject) => {
            const ms = Math.floor(Math.random() * 100) + 100;
            setTimeout(() => {
                fetch(`https://api.gotinder.com/user/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': xAuthToken
                    }
                })
                    .then((result: Response) => {
                        if (!result.ok && result.status === 404) {
                            console.info(`Match with id: ${id} returned a 404. Likely match has removed profile and as a result the match along with it.`);
                            return resolve(result.json())
                        }
                        if (result.ok && result.status === 200) {
                            return resolve(result.json())
                        }
                        console.error(`Unknown response for ${id}. Please check the network logs.`);
                        return reject();
                    })
                    .catch(error => {
                        return reject(error);
                    })
            }, ms);
        });
    }

    public getMatchDetails(xAuthToken: string, systemId: string): Promise<MatchApi> {
        return new Promise<MatchApi>((resolve, reject) => {
            const ms = Math.floor(Math.random() * 100) + 100;
            setTimeout(() => {
                fetch(`https://api.gotinder.com/v2/matches/${systemId}?locale=nl`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': xAuthToken
                    }
                })
                    .then(result => {
                        // debugger; 
                        return resolve(result.json())

                        // if(!result.ok && result.status === 404){ 
                        //     return resolve(404) 
                        // } 
                        // if(result.ok && result.status === 200){ 
                        //     return resolve(result.json()) 
                        // } 
                        // return reject(); 
                    })
                    .catch(error => {
                        return reject(error);
                    })
            }, ms);
        });
    }

    public async getMatchDetailsStart(systemId: string): Promise<Match | 404 | 500> {
        return new Promise<Match | 404 | 500>((resolve, reject) => {
            const attempt = async () => {
                await this.getMatchDetails(this.xAuthToken, systemId)
                    .then(async (matchData: MatchApi) => {
                        // console.log(profileData);
                        // debugger;
                        if (matchData.meta.status === 200 && matchData.data) {
                            return resolve(matchData.data);
                        } else if (matchData.meta.status === 404) {
                            return resolve(404);
                        }
                        console.log(`Unexpected response in getMatchDetailsStart: ${matchData}`);
                        return resolve(500);
                    })
                    .catch((e: Error) => {
                        // console.log(e);
                        return reject(e);
                    })
            };
            attempt();
        });
    }

    public async postReminderList(reminderHttpList: ReminderHttp[], progressCallBack?: Function): Promise<ReminderHttp[]> {
        for (let i = 0; i < reminderHttpList.length; i++) {
            console.log(`%cPOSTLIST - Now sending reminder to: ${i} - ${reminderHttpList[i].getId()}`, `color: red`);
            let result = await this.postReminderWithTimeout(reminderHttpList[i]);
            if(!result){
                const errorText = "";
                reminderHttpList[i].setReminderSentError(errorText);
            }
            reminderHttpList[i].setReminderSent();
            if(progressCallBack){
                progressCallBack(i, reminderHttpList.length, `Sent reminder to ${reminderHttpList[i].getName()}`);
            }
            console.log(`%cPOSTLIST - Reminder has been sent, going to send a new one now!`, `color: red`);
        }
        console.log(`%cPOSTLIST - this probably returns earlier than the reminders are actually sent`, `color: red; background: white`);
        return reminderHttpList;
    }

    private async postReminderWithTimeout(reminderHttp: ReminderHttp): Promise<boolean | Error> {
        // debugger;
        return new Promise<boolean | Error>((resolve, reject) => {
            console.log(`POSTTIMEOUT - Going to send reminder with a delay for: ${reminderHttp.getId()}! Brace yourselves!`);
            const ms = Math.floor(Math.random() * 100) + 100;
            setTimeout(() => {
                this.postReminder(reminderHttp)
                .then(result => {
                    // if(){
                    //     //todo todo todo: some logi her to check if result.json() really is what we want
                    // }
                    return resolve(true);
                })
                .catch(error => {
                    reminderHttp.setReminderSentError(error);
                    return reject(error);
                });
                console.log(`POSTTIMEOUT - Reminder with delay sent!`);
            }, ms);
        });
    }

    private async postReminder(reminderHttp: ReminderHttp): Promise<unknown | Error> {
        console.log(`POSTFETCH - Actually sending reminder now!`);
        // debugger;
            try {
                // const result_2 = await fetch(`https://api.gotinder.com/user/matches/${reminderHttp.getId()}?locale=nl`, {
                const result_2 = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': this.xAuthToken
                },
                body: JSON.stringify({
                    'message': reminderHttp.getMessage()
                })
            });
            console.dir(result_2.json());
            console.log(`POSTFETCH - Reminder for: ${reminderHttp.getId()} has been sent succesfully!`);
            // debugger;
            return true;
        } catch (error) {
            console.log(`POSTFETCH - Reminder for: ${reminderHttp.getId()} got error!`);
            debugger;
            return error;
        }
    }
}