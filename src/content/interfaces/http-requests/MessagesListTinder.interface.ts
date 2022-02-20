export interface ParsedResultMessages {
        "meta": {
          "status": number
        },
        "data": {
          "messages": TinderMessage[],
          "next_page_token"?: string
        }
}
export interface TinderMessage {
    "_id": string,
    "match_id": string,
    "is_liked"?: boolean,
    "sent_date": string,
    "message": string,
    "to": string,
    "from": string,
    "created_date": string,
    "timestamp": number
}