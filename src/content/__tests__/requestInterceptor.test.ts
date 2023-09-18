import { requestInterceptor } from "src/background/requestInterceptor";
import { ReminderHttp } from "../classes/data/ReminderHttp";
import { AutoReminder } from "../classes/serrvices/AutoReminder";

describe('Request Interceptor Tests', () => {
    const test = new requestInterceptor();

    const test2: chrome.webRequest.WebRequestFullDetails = {
        // documentId: "F0BD424F65A4BA4C75C64BFADCF525BC",
        // "documentLifecycle": "active",
        "frameId": 0,
        // "frameType": "outermost_frame",
        "initiator": "https://happn.app",
        "method": "POST",
        "parentFrameId": -1,
        "requestBody": {
            "raw": [
                {
                    "bytes": new ArrayBuffer(5)
                }
            ]
        },
        "requestId": "30716",
        "tabId": 641470729,
        "timeStamp": 1694984451621.378,
        "type": "xmlhttprequest",
        "url": "https://api.happn.fr/api/v1/users/me/reacted/9d83c9f2-80a7-4d1d-b21b-2a4cf3582cfb"
    }

    it('Test - opening message no reply', () => {
        test._requestInterceptorFn(test2);

        globalThis.tinderRequestInterceptorHelper.isKnownDatingAppOriginRequest(details)

        expect(reminder.getReminderAmountItems().length).toEqual(0);
        expect(reminder.getNeedsReminder(singleOpenerFromMe)).toEqual(true);
      });

});