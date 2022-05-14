/* eslint-disable no-var */

import { SubmitAction, tinderRequestInterceptorHelper, backgroundScriptErrorHelper } from "src/background/requestInterceptor";

declare global {
    var example: string;
    function sum(a: number, b: number): number;
    var requestInterceptorFn: (details: chrome.webRequest.WebRequestBodyDetails) => void;
    var port: chrome.runtime.Port;
    var onConnect: chrome.runtime.ExtensionConnectEvent;
    var beforeRequestInterceptor: chrome.webRequest.WebRequestBodyEvent;
    var sendMessageToContent: (action: SubmitAction, port: chrome.runtime.Port) => void;
    var tinderRequestInterceptorHelper: tinderRequestInterceptorHelper;
    var backgroundScriptErrorHelper: backgroundScriptErrorHelper;
  }
  
  export {};