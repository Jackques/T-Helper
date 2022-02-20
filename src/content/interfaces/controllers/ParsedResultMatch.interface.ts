import { Match } from "../http-requests/MatchesListTinder.interface";
import { TinderMessage } from "../http-requests/MessagesListTinder.interface";

export interface ParsedResultMatch {
    match: Match,
    matchMessages: TinderMessage[]
}

//todo: match & message interface is specific to tinder but is used here as generic!