import { PersonalInt } from "./../../interfaces/tinder_api/personal.interface";
import { Profile } from "./../../interfaces/tinder_api/profile.interface";
import { Match_origin } from "./../../interfaces/tinder_api/matchOrigin.interface";
import { Messages } from "./../../interfaces/tinder_api/messages.interface";
import { ProfileName } from "./../../interfaces/tinder_api/profileName.interface";
import { PersonInt } from "./../../interfaces/tinder_api/person.interface";

export class Person implements PersonInt {
    matched_with: ProfileName;

    is_instant_match: boolean;
    is_later_match: boolean;

    has_usefull_bio: boolean;
    is_convo_going: boolean;
    
    match_created_date: string;
    match_id: string;
    last_activity_date: string;
    message_count: number;
    seen_profile: boolean;
    personal: PersonalInt;
    profile: Profile;
    match_origin: Match_origin;
    messages?: Messages;

    constructor(matchApiData: any) {
        this.matched_with = {
            Maarten: true
        };
        this.is_instant_match = false;
        this.is_later_match = false;
    
        this.has_usefull_bio = false;
        this.is_convo_going = false;

        this.match_created_date = matchApiData.created_date;
        this.match_id = matchApiData.id;
        this.last_activity_date = matchApiData.last_activity_date;
        this.message_count = matchApiData.message_count;
        this.seen_profile = matchApiData.seen.match_seen;
        this.personal = {
            birth_date: matchApiData.person.birth_date,
            gender: matchApiData.person.gender,
            name: matchApiData.person.name
        }

        this.profile = {
            bio: matchApiData.person.bio,
            id: matchApiData.person._id
        }

        this.match_origin = {
            is_boost_match: matchApiData.is_boost_match,
            is_experiences_match: matchApiData.is_experiences_match,
            is_fast_match: matchApiData.is_fast_match,
            is_opener: matchApiData.is_opener,
            is_super_boost_match: matchApiData.is_super_boost_match,
            is_super_like: matchApiData.is_super_like
        }

        this.messages = undefined;
    }
}