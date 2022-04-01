export interface Message {
    author: MessageAuthorEnum;
    message: string;
    datetime: string;
}

export enum MessageAuthorEnum { Me = "me", Match = "match" }