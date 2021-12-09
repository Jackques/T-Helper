export interface Matches {
    data: {
        matches: [ ],
        next_page_token?: string;
    }
}

//todo: use interface below & refactor actual data into primitive types
/*
export interface Matches {
    data: {
        matches: [
            {
                "seen": {
                    "match_seen": true
                },
                "_id": "528ce2770640a14b0f00007c598f76c4234772c54bbe6390",
                "id": "528ce2770640a14b0f00007c598f76c4234772c54bbe6390",
                "closed": false,
                "common_friend_count": 0,
                "common_like_count": 0,
                "created_date": "2021-12-01T10:21:16.305Z",
                "dead": false,
                "last_activity_date": "2021-12-01T10:21:16.305Z",
                "message_count": 0,
                "messages": [],
                "participants": [
                    "598f76c4234772c54bbe6390"
                ],
                "pending": false,
                "is_super_like": false,
                "is_boost_match": false,
                "is_super_boost_match": false,
                "is_experiences_match": false,
                "is_fast_match": false,
                "is_opener": false,
                "person": {
                    "_id": "598f76c4234772c54bbe6390",
                    "birth_date": "1989-12-08T23:19:31.656Z",
                    "gender": 1,
                    "name": "Sanne",
                    "ping_time": "2014-12-09T00:00:00.000Z",
                    "photos": [
                        {
                            "id": "8c34cc51-ddf0-4f58-87ad-0d612452fee2",
                            "crop_info": {
                                "user": {
                                    "width_pct": 1,
                                    "x_offset_pct": 0,
                                    "height_pct": 1,
                                    "y_offset_pct": 0
                                },
                                "algo": {
                                    "width_pct": 0.2854234256315976,
                                    "x_offset_pct": 0.2122428419534117,
                                    "height_pct": 0.3650050013326109,
                                    "y_offset_pct": 0.2964119060896337
                                },
                                "processed_by_bullseye": true,
                                "user_customized": false,
                                "faces": [
                                    {
                                        "algo": {
                                            "width_pct": 0.2854234256315976,
                                            "x_offset_pct": 0.2122428419534117,
                                            "height_pct": 0.3650050013326109,
                                            "y_offset_pct": 0.2964119060896337
                                        },
                                        "bounding_box_percentage": 10.42
                                    }
                                ]
                            },
                            "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/1080x1080_8c34cc51-ddf0-4f58-87ad-0d612452fee2.jpg",
                            "processedFiles": [
                                {
                                    "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/640x640_8c34cc51-ddf0-4f58-87ad-0d612452fee2.jpg",
                                    "height": 640,
                                    "width": 640
                                }
                            ],
                            "fileName": "8c34cc51-ddf0-4f58-87ad-0d612452fee2.jpg",
                            "extension": "jpg",
                            "shape": "center_square",
                            "assets": [],
                            "type": "image"
                        },
                        {
                            "id": "10f6876c-4b46-47ac-8912-344c9703793b",
                            "crop_info": {
                                "processed_by_bullseye": true,
                                "user_customized": false
                            },
                            "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/1080x1080_10f6876c-4b46-47ac-8912-344c9703793b.jpg",
                            "processedFiles": [
                                {
                                    "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/640x640_10f6876c-4b46-47ac-8912-344c9703793b.jpg",
                                    "height": 640,
                                    "width": 640
                                }
                            ],
                            "fileName": "10f6876c-4b46-47ac-8912-344c9703793b.jpg",
                            "extension": "jpg",
                            "assets": [],
                            "type": "image"
                        },
                        {
                            "id": "694f96c8-b66b-458b-9323-2bf4ea1a5afd",
                            "crop_info": {
                                "user": {
                                    "width_pct": 1,
                                    "x_offset_pct": 0,
                                    "height_pct": 0.8,
                                    "y_offset_pct": 0
                                },
                                "algo": {
                                    "width_pct": 0.10589731484651566,
                                    "x_offset_pct": 0.3307865262031555,
                                    "height_pct": 0.10183899104595184,
                                    "y_offset_pct": 0.20730432868003845
                                },
                                "processed_by_bullseye": true,
                                "user_customized": false
                            },
                            "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/1080x1350_694f96c8-b66b-458b-9323-2bf4ea1a5afd.jpg",
                            "processedFiles": [
                                {
                                    "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/640x800_694f96c8-b66b-458b-9323-2bf4ea1a5afd.jpg",
                                    "height": 800,
                                    "width": 640
                                }
                            ],
                            "fileName": "694f96c8-b66b-458b-9323-2bf4ea1a5afd.jpg",
                            "extension": "jpg",
                            "assets": [],
                            "type": "image"
                        },
                        {
                            "id": "841d4cc6-6e31-4a7d-8f31-3c92f1bf9efb",
                            "crop_info": {
                                "user": {
                                    "width_pct": 1,
                                    "x_offset_pct": 0,
                                    "height_pct": 0.8,
                                    "y_offset_pct": 0
                                },
                                "algo": {
                                    "width_pct": 0.31442489777691657,
                                    "x_offset_pct": 0.31151187866926194,
                                    "height_pct": 0.14893899355083706,
                                    "y_offset_pct": 0.23181992083787917
                                },
                                "processed_by_bullseye": true,
                                "user_customized": false,
                                "faces": [
                                    {
                                        "algo": {
                                            "width_pct": 0.0823923006653785,
                                            "x_offset_pct": 0.5435444757808,
                                            "height_pct": 0.11652876863256101,
                                            "y_offset_pct": 0.23181992083787917
                                        },
                                        "bounding_box_percentage": 0.96
                                    }
                                ]
                            },
                            "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/original_841d4cc6-6e31-4a7d-8f31-3c92f1bf9efb.jpeg",
                            "processedFiles": [
                                {
                                    "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/640x800_841d4cc6-6e31-4a7d-8f31-3c92f1bf9efb.jpg",
                                    "height": 800,
                                    "width": 640
                                }
                            ],
                            "fileName": "841d4cc6-6e31-4a7d-8f31-3c92f1bf9efb.jpg",
                            "extension": "jpg,webp",
                            "webp_qf": [
                                75
                            ],
                            "assets": [
                                {
                                    "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/enhanced_6WRBgZjBgZPqSxsWXF4kwn_841d4cc6-6e31-4a7d-8f31-3c92f1bf9efb.jpg",
                                    "format": "jpeg",
                                    "type": "image",
                                    "created_at": "2021-11-17T19:38:39.127Z",
                                    "width": 640,
                                    "height": 800,
                                    "qf": 85,
                                    "enhancements": [
                                        "smart_crop"
                                    ],
                                    "face_ratio": 0.15,
                                    "requested_face_ratio": -1
                                }
                            ],
                            "type": "image"
                        }
                    ]
                },
                "following": true,
                "following_moments": true,
                "readreceipt": {
                    "enabled": false
                },
                "liked_content": {
                    "by_closer": {
                        "user_id": "528ce2770640a14b0f00007c",
                        "type": "photo",
                        "photo": {
                            "id": "8c34cc51-ddf0-4f58-87ad-0d612452fee2",
                            "crop_info": {
                                "user": {
                                    "width_pct": 1,
                                    "x_offset_pct": 0,
                                    "height_pct": 1,
                                    "y_offset_pct": 0
                                },
                                "algo": {
                                    "width_pct": 0.2854234256315976,
                                    "x_offset_pct": 0.2122428419534117,
                                    "height_pct": 0.3650050013326109,
                                    "y_offset_pct": 0.2964119060896337
                                },
                                "processed_by_bullseye": true,
                                "user_customized": false,
                                "faces": [
                                    {
                                        "algo": {
                                            "width_pct": 0.2854234256315976,
                                            "x_offset_pct": 0.2122428419534117,
                                            "height_pct": 0.3650050013326109,
                                            "y_offset_pct": 0.2964119060896337
                                        },
                                        "bounding_box_percentage": 10.42
                                    }
                                ]
                            },
                            "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/1080x1080_8c34cc51-ddf0-4f58-87ad-0d612452fee2.jpg",
                            "processedFiles": [
                                {
                                    "url": "https://images-ssl.gotinder.com/598f76c4234772c54bbe6390/640x640_8c34cc51-ddf0-4f58-87ad-0d612452fee2.jpg",
                                    "height": 640,
                                    "width": 640
                                }
                            ],
                            "fileName": "8c34cc51-ddf0-4f58-87ad-0d612452fee2.jpg",
                            "extension": "jpg",
                            "shape": "center_square",
                            "assets": [],
                            "type": "image"
                        },
                        "is_swipe_note": false
                    }
                }
            }
        ],
        next_page_token?: string;
    }
}
*/