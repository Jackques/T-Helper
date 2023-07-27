export interface MatchListHappnAPI {
    data: HappnConversation[],
    error: unknown,
    error_code: number,
    pagination: {
        count: number, 
        first_scroll_id: string, 
        last_scroll_id: string, 
        is_last_page: boolean, 
        total_count: number
    },
    status: number,
    success: boolean
}

export interface HappnConversation {
    creation_date: string,
    id: string,
    is_disabled: boolean,
    is_read: boolean,
    last_message: {
        id: string, 
        message: string, 
        sender: {
            id: string,
            is_moderator: boolean,
            role: string,
            type: string
        }
    }
    modification_date: string,
    participants: [
        {
            id: string,
            last_read_date_time: string,
            status: number,
            user: 
                {
                    age: number,
                    birth_date: string,
                    first_name: string,
                    gender: string,
                    id: string,
                    is_moderator: boolean,
                    modification_date: string,
                    picture: {
                        id: string, 
                        url: string, 
                        width: number, 
                        height: number, 
                        title: string, 
                    },
                    role: string,
                    type: string
            }
        },
        {
            id: string,
            last_read_date_time: string,
            status: number,
            user: 
                {
                    age: number,
                    birth_date: string,
                    first_name: string,
                    gender: string,
                    id: string,
                    is_moderator: boolean,
                    modification_date: string,
                    picture: {
                        id: string, 
                        url: string, 
                        width: number, 
                        height: number, 
                        title: string, 
                    },
                    role: string,
                    type: string
            }
        }
    ]
}