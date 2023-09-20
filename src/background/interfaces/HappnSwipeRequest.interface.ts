export interface HappnSwipeRequest {
    container: {
        content: {
            id: string //corresponds with the Happn personId (tempId)
        },
        type: string,
    },
    reaction: {
        id: string //"heart"
    },
    tracking_custom_data: {
        container_index: number //0,
        content_index: number //0,
        reaction_index: number //0
    }
}