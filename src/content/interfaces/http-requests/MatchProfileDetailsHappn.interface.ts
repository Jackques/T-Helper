export interface MatchProfileDetailsHappn {
    data: {
        about: string,
        age: number,
        audios: unknown[

        ],
        crossing_nb_times: number,
        first_name: string,
        gender: string,
        gender_alias: null,
        has_charmed_me: boolean,
        id: string,
        is_accepted: boolean,
        is_admin: boolean,
        is_charmed: boolean,
        is_moderator: boolean,
        job: string,
        last_meet_position: {
            lat: number,
            lon: number,
            creation_date: string,
        },
        last_name: string,
        last_position_update: unknown,
        modification_date: string,
        my_relations: {
            mutual: string
        },
        mysterious_mode_preferences: unknown,
        nb_photos: number,
        profiles: [
            {
                id: string,
                is_default: boolean
            }
        ],
        register_date: unknown,
        role: string,
        school: string,
        social_synchronization: unknown,
        spotify_tracks: unknown,
        status: unknown,
        traits: [
            {
                id: string,
                default_emoji: string
            }
        ],
        type: string,
        verification: {
            status: string
        },
        workplace: unknown
    },
    error: unknown,
    error_code: number,
    status: number,
    success: boolean
}