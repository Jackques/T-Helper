export interface PostMessageSuccessHappn {
    data: {
        creation_date: string,
        id: string,
        message: string,
        previous_message_id: string,
        sender: {
            role: string,
            type: string,
            birth_date: string,
            id: string
        }
    },
    error: unknown | null,
    error_code: number,
    status: number,
    success: boolean
}