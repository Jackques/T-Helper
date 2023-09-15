import { PortAction } from "src/PortAction.enum";
import { DatingAppType } from "src/datingAppType.enum";

export interface PortMessage {
    messageSender: string, // BACKGROUND CONTENT POPUP
    action: PortAction, // SUBMIT_ACTION OR INIT
    payload: string | any[], //todo: Add type my future records array
    datingAppType: DatingAppType
}