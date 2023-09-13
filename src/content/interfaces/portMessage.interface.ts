import { PortAction } from "src/PortAction.enum";

export interface PortMessage {
    messageSender: string, // BACKGROUND CONTENT POPUP
    action: PortAction, // SUBMIT_ACTION OR INIT
    payload: string | any[] //todo: Add type my future records array
}