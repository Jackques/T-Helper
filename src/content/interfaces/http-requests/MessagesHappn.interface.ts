export interface MessagesHappn {
    data: {
        conversation: {
            creationDate: string,
            modificationDate: string,
            isBlocked: boolean,
            id: string,
                messages: {
                edges: [
                    {
                        node: {
                            id: string,
                            body: string,
                            sender: {
                                id: string,
                                firstName: string,
                                gender: string,
                                isModerator: boolean,
                                isSponsor: boolean,
                                pictures: [
                                    {
                                        id: string,
                                        url: string,
                                        __typename: string
                                    }
                                ],
                                __typename: string
                            },
                            creationDate: string,
                            __typename: string
                        },
                        cursor: string,
                        __typename: string
                    }
                ],
                    pageInfo: {
                    hasPreviousPage: boolean,
                        hasNextPage: boolean,
                            endCursor: string,
                                startCursor: string,
                                    __typename: string
                },
                __typename: string
            },
            __typename: string
        }
    }
}