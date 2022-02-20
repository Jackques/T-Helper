export interface Message {
    author: MessageAuthorEnum;
    message: string;
    timestamp: number;
}

export enum MessageAuthorEnum { Me = "me", Match = "match" }