export interface MatchDetailsAPI {
        "status": number,
        "results": {
          "common_friends": [],
          "common_friend_count": number,
          "spotify_top_artists": [],
          "distance_mi": number,
          "connection_count": number,
          "common_connections": [],
          "bio": string,
          "birth_date": string,
          "name": string,
          "jobs": [
            {
              "title": {
                "name": string
              }
            }
          ],
          "schools": [
            {
              "name": string,
              "displayed": false
            }
          ],
          "teasers": [
            {
              "type": string,
              "string": string
            },
            {
              "type": string,
              "string": string
            }
          ],
          "gender": number,
          "show_gender_on_profile": true,
          "birth_date_info": string,
          "ping_time": string,
          "badges": [
            {
              "type": string
            }
          ],
          "photos": [
            {
              "id": string,
              "crop_info": {
                "user": {
                  "width_pct": number,
                  "x_offset_pct": number,
                  "height_pct": number,
                  "y_offset_pct": number
                },
                "algo": {
                  "width_pct": number,
                  "x_offset_pct": number,
                  "height_pct": number,
                  "y_offset_pct": number
                },
                "processed_by_bullseye": true,
                "user_customized": false,
                "faces": [
                  {
                    "algo": {
                      "width_pct": number,
                      "x_offset_pct": number,
                      "height_pct": number,
                      "y_offset_pct": number
                    },
                    "bounding_box_percentage": number
                  }
                ]
              },
              "url": string,
              "processedFiles": processedFile[],
              "processedVideos": [],
              "fileName": string,
              "extension": string,
              "assets": [],
              "media_type": string
            }
          ],
          "user_interests": {
            "selected_interests": [
              {
                "id": string,
                "name": string
              },
              {
                "id": string,
                "name": string
              },
              {
                "id": string,
                "name": string
              },
              {
                "id": string,
                "name": string
              },
              {
                "id": string,
                "name": string
              }
            ]
          },
          "common_likes": [],
          "common_like_count": number,
          "spotify_common_top_artists_count": number,
          "city": {
            "name": string
          },
          "common_interests": [],
          "selected_descriptors": [],
          "s_number": number,
          "_id": string,
          "is_tinder_u": boolean
        } 
}

export interface processedFile {
    "url": string,
    "height": number,
    "width": number
}