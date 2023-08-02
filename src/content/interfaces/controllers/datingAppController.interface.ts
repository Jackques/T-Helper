import { RequestHandlerTinder } from "src/content/classes/http-requests/requestHandlerTinder";
import { DataFieldTypes } from "../data/dataFieldTypes.interface";
import { RequestHandler } from "../http-requests/RequestHandler.interface";

export interface datingAppController {
    setCredentials: () => boolean,
    getMatchesAndMatchMessagesByAPI: (requestHandler: RequestHandlerTinder, useMock: boolean) => void,
    setSwipeHelperOnScreen: (UIRequiredFieldsList: DataFieldTypes[]) => void,
}