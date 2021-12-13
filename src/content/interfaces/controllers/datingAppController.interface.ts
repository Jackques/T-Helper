import { RequestHandlerTinder } from "src/content/classes/http-requests/requestHandlerTinder";
import { RequestHandler } from "../http-requests/RequestHandler.interface";

export interface datingAppController {
    listEndpoints: string[],
    getCredentials: () => boolean,
    getDataByAPI: (requestHandler: RequestHandlerTinder) => void,
    setSwipeHelperOnScreen: () => void,
}