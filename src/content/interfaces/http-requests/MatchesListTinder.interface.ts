export interface MatchListTinderAPI {
    
        "meta": {
          "status": number;
        },
        "data": {
          "matches": Match[],
          "next_page_token": string
        }
}

export interface Match {
    "seen": {
      "match_seen": boolean
    },
    "_id": string,
    "id": string,
    "closed": boolean,
    "common_friend_count": number,
    "common_like_count": number,
    "created_date": string, // datetime string e.g: "2019-08-03T17:53:27.029Z"
    "dead": boolean,
    "last_activity_date": string,
    "message_count": number,
    "messages": [
        {
            "_id": string,
            "match_id": string,
            "sent_date": string,
            "message": string,
            "to": string,
            "from": string,
            "timestamp": number
          }?
    ],
    "participants": string[],
    "pending": boolean,
    "super_liker": string,
    "is_super_like": boolean,
    "is_boost_match": boolean,
    "is_super_boost_match": boolean,
    "is_experiences_match": boolean,
    "is_fast_match": boolean,
    "is_opener": boolean,
    "person": {
      "_id": string,
      "badges"?: Badges[],
      "bio"?: string,
      "birth_date": string, //datetime string
      "gender": number, //(1 for women, 0 for men?)
      "hide_age"?: boolean,
      "hide_distance"?: boolean,
      "name": string,
      "ping_time": string,
      "photos": [
        {
          "id": string,
          "url": string,
          "processedFiles": [
            {
              "url": string,
              "height": number,
              "width": number
            }?
          ],
          "fileName": string,
          "extension": string,
          "rank": number,
          "score": number,
          "win_count": number,
          "assets": unknown[],
          "type": string
        }?
      ]
    },
    "following": boolean,
    "following_moments": boolean,
    "readreceipt": {
      "enabled": boolean
    },
    "is_archived": boolean
  }

  export interface Badges {
    "type": string
  }

  export interface MatchApi {
    data: Match,
    meta: {
      status: number
    }
  }