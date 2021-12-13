export interface RequestHandler {
    getMatches: (auth_token: string, next_page_token_num?: string) => any;
    getMessagesFromMatch: (auth_token: string, match_id: string) => any;
}