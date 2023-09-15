/* eslint-disable no-var */

import { DatingAppRequestInterceptorHelper } from "src/background/tinderRequestInterceptorHelper";
import { backgroundScriptErrorHelper } from "src/background/services/ErrorHelper";
import { SubmitAction } from "src/SubmitAction.interface";
import { DatingAppType } from "src/datingAppType.enum";

declare global {
    var example: string;
    function sum(a: number, b: number): number;
    var requestInterceptorFn: (details: chrome.webRequest.WebRequestBodyDetails) => void;
    var port: chrome.runtime.Port;
    var onConnect: chrome.runtime.ExtensionConnectEvent;
    var beforeRequestInterceptor: chrome.webRequest.WebRequestBodyEvent;
    var sendMessageToContent: (action: SubmitAction, port: chrome.runtime.Port, datingAppType: DatingAppType) => void;
    var tinderRequestInterceptorHelper: DatingAppRequestInterceptorHelper;
    var backgroundScriptErrorHelper: backgroundScriptErrorHelper;
    var getDatingAppType: (datingAppType: DatingAppType) => DatingAppType;
  }
  
  export {};