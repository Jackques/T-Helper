export interface PortMessage {
    messageSender: string, // BACKGROUND CONTENT POPUP
    action: string, // SUBMIT_ACTION OR INIT
    payload: any[] //todo: Add type my future records array
}