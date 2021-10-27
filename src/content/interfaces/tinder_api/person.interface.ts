import { PersonalInt } from "./personal.interface";
import { Profile } from "./profile.interface";
import { Match_origin } from "./matchOrigin.interface";
import { Messages } from "./messages.interface";

export interface PersonInt {
    is_instant_match?: boolean;
    is_later_match?: boolean;

    has_usefull_bio?: boolean;
    is_convo_going?: boolean;

    match_created_date: string;
    match_id: string;
    last_activity_date: string;
    message_count: number;
    seen_profile: boolean;
    personal: PersonalInt;
    profile: Profile;
    match_origin: Match_origin;
    messages?: Messages;
}