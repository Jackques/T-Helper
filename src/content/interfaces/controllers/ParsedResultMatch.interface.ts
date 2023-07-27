import { GenericPersonPropertiesList } from "src/content/classes/util/GenericPersonPropertiesList";
import { HappnConversation } from "../http-requests/MatchesListHappn.interface";
import { Match } from "../http-requests/MatchesListTinder.interface";
import { TinderMessage } from "../http-requests/MessagesListTinder.interface";
import { HappnMessage } from "../http-requests/MessagesHappn.interface";
import { Message } from "src/message.interface";

export interface ParsedResultMatch {
    match: Match | HappnConversation,
    matchMessages: TinderMessage[],
    addedProperties: GenericPersonPropertiesList;
}
//todo: match & message interface is specific to tinder but is used here as generic!