import { data } from 'jquery';
import { ParsedResultMessages, TinderMessage } from 'src/content/interfaces/http-requests/MessagesListTinder.interface';
import { Match, MatchApi, MatchListTinderAPI } from 'src/content/interfaces/http-requests/MatchesListTinder.interface';
import { RequestHandler } from 'src/content/interfaces/http-requests/RequestHandler.interface';
import { Matches } from '../../interfaces/tinder_api/matches.interface';
import { ParsedResultMatch } from 'src/content/interfaces/controllers/ParsedResultMatch.interface';
import { MatchDetailsAPI } from 'src/content/interfaces/http-requests/MatchDetailsAPI.interface';
import { ReminderHttp } from '../data/ReminderHttp';
import { MatchListHappnAPI, HappnConversation } from 'src/content/interfaces/http-requests/MatchesListHappn.interface';
import { TypeOfChat } from '../util/happn/typeOfChat';
import { MatchProfileDetailsHappn } from 'src/content/interfaces/http-requests/MatchProfileDetailsHappn.interface';
import { GenericPersonPropertiesList } from '../util/GenericPersonProperties/GenericPersonPropertiesList';
import { MessagesHappn } from 'src/content/interfaces/http-requests/MessagesHappn.interface';
import { PostMessageSuccessHappn } from 'src/content/interfaces/http-requests/PostMessageSuccessHappn.interface';

export class RequestHandlerHappn {
    private happnAccessToken: string;

    constructor(happnAccessToken: string) {
        this.happnAccessToken = happnAccessToken;
    }

    private _getRandomCoupleHunderdMS(): number {
        // for some reason,.. private classes dont work?
        return Math.floor(Math.random() * 100) + 100;
    }

    public async getMatches(typeOfChats: TypeOfChat, firstScrollId?: string): Promise<MatchListHappnAPI> {
        if (!this.happnAccessToken) {
            console.error(`Provided acess token invalid!`);
        }

        const scrollIdFrom = `&scroll_id_from=${firstScrollId}`;
        const hasScrollId = firstScrollId && firstScrollId.length > 0;

        const getMatches = new Promise<MatchListHappnAPI>((resolve, reject) => {
            setTimeout(() => {
                fetch(`https://api.happn.fr/api/users/me/conversations?fields=id%2Ccreation_date%2Cmodification_date%2Cis_read%2Cis_disabled%2Clast_message.fields%28message%2Csender.fields%28id%2Cis_moderator%29%29%2Cparticipants.fields%28id%2Cstatus%2Clast_read_date_time%2Cuser.fields%28age%2Cgender%2Cmodification_date%2Cfirst_name%2Cpicture.mode%281%29.width%28160%29.height%28160%29%2Cis_moderator%29%29&view_id=${typeOfChats}&limit=20${hasScrollId ? scrollIdFrom : ""}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'OAuth="' + this.happnAccessToken + '"'
                    }
                })
                    .then(result => {
                        return result.json()
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .then(resultJSON => {
                        resolve(resultJSON);
                    });
            }, this._getRandomCoupleHunderdMS());
        });
        return getMatches;
    }

    public getMatchesStart(): Promise<ParsedResultMatch[]> {
        return new Promise<ParsedResultMatch[]>((resolve, reject) => {
            const results: ParsedResultMatch[] = [];

            const attempt = (typeOfChat: TypeOfChat, firstScrollId?: string) => {
                firstScrollId = firstScrollId ? firstScrollId : '';

                this.getMatches(typeOfChat, firstScrollId)
                    .then((parsedResult: MatchListHappnAPI) => {
                        // debugger;
                        if (parsedResult?.data) {

                            parsedResult?.data?.forEach((match: HappnConversation) => {
                                results.push(
                                    {
                                        match: match,
                                        matchMessages: [],
                                        addedProperties: new GenericPersonPropertiesList()
                                    }
                                );
                            });
                        }

                        // debugger;

                        if (!parsedResult.pagination?.is_last_page && parsedResult.pagination?.last_scroll_id && parsedResult.pagination.last_scroll_id) {
                            attempt(typeOfChat, parsedResult.pagination.last_scroll_id);
                        } else {

                            if (typeOfChat === TypeOfChat.MATCH) {
                                attempt(TypeOfChat.MATCHANDCHAT);
                            } else {
                                console.log(`Finished getting results:`);
                                console.dir(results);
                                results.forEach((match) => {
                                    console.log(match.match.participants[1].user.first_name);
                                })
                                resolve(results);
                            }
                        }
                    })
                    .catch(function (e: Error) {
                        console.log(`Error retrieving matches:`);
                        console.dir(e);
                        const error = e;
                        reject(error);
                    });

            };

            attempt(TypeOfChat.MATCH);
        })
    }

    public getMatchProfileDetails(personProfileId: string): Promise<MatchProfileDetailsHappn> {
        return new Promise<MatchProfileDetailsHappn>((resolve, reject) => {
            setTimeout(() => {
                fetch(`https://api.happn.fr/api/users/${personProfileId}?fields=id,audios,first_name,last_name,gender,gender_alias,age,about,job,workplace,school,modification_date,is_moderator,is_admin,type,status,last_position_update,register_date,sensitive_traits_preferences,mysterious_mode_preferences,profiles.mode(1).width(1400).height(1600).fields(id,is_default,url,width,height),traits,spotify_tracks,social_synchronization.fields(facebook,vk,apple_sign_in,instagram,google_sign_in),is_charmed,is_accepted,has_charmed_me,my_relations,last_meet_position,crossing_nb_times,verification.fields(status,reason)`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'OAuth="' + this.happnAccessToken + '"'
                    }
                })
                    .then(result => {
                        return result.json()
                    })
                    .then(resultJSON => {
                        resolve(resultJSON);
                    })
                    .catch(error => {
                        reject(`oops, something went wrong!`);
                    });
            }, this._getRandomCoupleHunderdMS());
        });
    }

    public getMatchMessages(matchId: string): Promise<MessagesHappn> {
        return new Promise<MessagesHappn>((resolve, reject) => {
            setTimeout(() => {
                fetch(`https://api.happn.fr/graphql/v1`, {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            operationName: "GetConversationMessagesQuery",
                            variables: {
                                id: matchId,
                                before: ""
                            },
                            query: "fragment MessageFields on Message {\n  id\n  body\n  sender {\n    id\n    firstName\n    gender\n    isModerator\n    isSponsor\n    pictures(format: CROP_80x80) {\n      id\n      url\n      __typename\n    }\n    __typename\n  }\n  creationDate\n  __typename\n}\n\nquery GetConversationMessagesQuery($id: ID!, $before: Cursor) {\n  conversation(id: $id) {\n    id\n    messages(last: 50, before: $before) {\n      edges {\n        node {\n          ...MessageFields\n          __typename\n        }\n        cursor\n        __typename\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
                        }
                    ),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'OAuth="' + this.happnAccessToken + '"'
                    }
                })
                    .then(result => {
                        return result.json()
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .then(resultJSON => {
                        resolve(resultJSON);
                    });
            }, this._getRandomCoupleHunderdMS());
        });
    }

    public getMatchConversation(matchId: string): Promise<MessagesHappn> {
        return new Promise<MessagesHappn>((resolve, reject) => {
            setTimeout(() => {
                fetch(`https://api.happn.fr/graphql/v1`, {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            operationName: "GetConversationQuery",
                            variables: {
                                id: matchId
                            },
                            query: `fragment UserBaseFields on User {
                                id
                                gender
                                firstName
                                lastMeetPosition {
                                  lat
                                  lon
                                  __typename
                                }
                                pictures(format: CROP_80x80) {
                                  id
                                  url
                                  __typename
                                }
                                __typename
                              }
                              
                              fragment ParticipantFields on Participant {
                                reactions {
                                  reaction {
                                    id
                                    message
                                    __typename
                                  }
                                  container {
                                    type
                                    content {
                                      id
                                      url
                                      __typename
                                    }
                                    __typename
                                  }
                                  sender {
                                    ...UserBaseFields
                                    __typename
                                  }
                                  receiver {
                                    ...UserBaseFields
                                    __typename
                                  }
                                  __typename
                                }
                                user {
                                  isModerator
                                  isSponsor
                                  onlineStatus
                                  lastActivityDate
                                  ...UserBaseFields
                                  __typename
                                }
                                __typename
                              }
                              
                              query GetConversationQuery($id: ID!) {
                                conversation(id: $id) {
                                  id
                                  isBlocked
                                  creationDate
                                  modificationDate
                                  participants {
                                    target {
                                      ...ParticipantFields
                                      __typename
                                    }
                                    current {
                                      ...ParticipantFields
                                      __typename
                                    }
                                    __typename
                                  }
                                  __typename
                                }
                              }
                              `
                        }
                    ),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'OAuth="' + this.happnAccessToken + '"'
                    }
                })
                    .then(result => {
                        return result.json()
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .then(resultJSON => {
                        resolve(resultJSON);
                    });
            }, this._getRandomCoupleHunderdMS());
        });
    }



    public async postReminderList(reminderHttpList: ReminderHttp[], progressCallBack?: (Function)): Promise<ReminderHttp[]> {
        for (let i = 0; i < reminderHttpList.length; i++) {
            console.log(`%cPOSTLIST - Now sending reminder to: ${i} - ${reminderHttpList[i].getTempId()}`, `color: red`);
            const result = await this.postMessage(reminderHttpList[i].getCompleteId(), reminderHttpList[i].getMessage());
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

    public postMessage(matchId: string, message: string): Promise<PostMessageSuccessHappn> {
        return new Promise<PostMessageSuccessHappn>((resolve, reject) => {
            setTimeout(() => {
                fetch(`https://api.happn.fr/api/conversations/${matchId}/messages?fields=id,message,creation_date,sender.fields(id),previous_message_id&conversation_id=${matchId}`, {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            "message": message
                        }
                    ),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'OAuth="' + this.happnAccessToken + '"'
                    }
                })
                    .then(result => {
                        return result.json()
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .then(resultJSON => {
                        resolve(resultJSON);
                    });
            }, this._getRandomCoupleHunderdMS());
        });
    }
}