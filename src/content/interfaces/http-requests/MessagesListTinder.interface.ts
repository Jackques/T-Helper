export interface ParsedResultMessages {
        "meta": {
          "status": number
        },
        "data": {
          "messages": Message[],
          "next_page_token": string
        }
}
export interface Message {
    "_id": string,
    "match_id": string,
    "sent_date": string,
    "message": string,
    "to": string,
    "from": string,
    "created_date": string,
    "timestamp": number
}