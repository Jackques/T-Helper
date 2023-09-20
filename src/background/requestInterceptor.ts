import { PersonAction } from "../personAction.enum";
import { DatingAppType } from "../datingAppType.enum";
import { PortMessage } from "src/content/interfaces/portMessage.interface";
import { SubmitAction } from "../SubmitAction.interface";
import { backgroundScriptErrorHelper } from "./services/ErrorHelper";
import { DatingAppRequestInterceptorHelper } from "./services/tinderRequestInterceptorHelper";
import { PortAction } from "../PortAction.enum";

export class requestInterceptor {

  constructor() {

    globalThis.onConnect = chrome.runtime.onConnect;
    globalThis.onConnect.addListener(this._onConnectListenerFn);

    globalThis.requestInterceptorFn = this._requestInterceptorFn;
    globalThis.sendMessageToContent = this._sendMessageToContent;

    globalThis.getDatingAppType = this._getDatingAppType;

    globalThis.tinderRequestInterceptorHelper = new DatingAppRequestInterceptorHelper();
  }

  private _onConnectListenerFn(port: chrome.runtime.Port): void {
    console.log(`Background Port activated! ${port.name}`);

    globalThis.port = port;
    globalThis.beforeRequestInterceptor = chrome.webRequest.onBeforeRequest;

    globalThis.beforeRequestInterceptor.addListener(globalThis.requestInterceptorFn, { 
      urls: ["https://api.gotinder.com/*", "https://api.happn.fr/*"]
    }, ['requestBody']);

    if (!globalThis.beforeRequestInterceptor.hasListeners()) {
      console.error(`beforeRequestInterceptor listener is not set. Please check the code.`);
      return;
    }


    globalThis.port.onMessage.addListener((message: PortMessage, port: chrome.runtime.Port)=>{
      // keep alive? since this service worker (previously; background script) terminates after ~5 min;
      // https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
      console.log(`Message is: ${message}, and port is: ${port.name}`);
      
      const datingAppType: DatingAppType = globalThis.getDatingAppType(message.datingAppType);
      if(datingAppType === DatingAppType.UNKNOWN){
        const options: chrome.notifications.NotificationOptions = {
          title: 'Warning',
          type: 'basic',
          message: `Received datingapp type was unknown`,
          iconUrl: 'assets/alert-warning.png'
        }
        chrome.notifications.create(`Unknown dating app type`, options);
        console.error(`Received datingapp type was unknown`);
      }

      if(message.action === PortAction.GET_NETWORK_LOGS){
        console.log("%c Going to return backupped requests,.. just wait for promise", "color: blue");
        backgroundScriptErrorHelper.getBackupRequests(datingAppType).then((result)=>{
          if(result === undefined){
            console.log("%c Got the backupped requests! BUT is undefined :(", "color: blue");
            return;
          }
          console.log("%c Got the backupped requests! sending them to content now!", "color: blue");
          const message: PortMessage = {
            messageSender: 'BACKGROUND',
            action: PortAction.GET_NETWORK_LOGS,
            payload: result,
            datingAppType: datingAppType
          };
          port.postMessage(message);
        });
      }

      if(message.action === PortAction.SWIPED_PERSON_ACTION_START){
        console.log("%c Received swiped-person-action", "color: blue");
        backgroundScriptErrorHelper.storeMessageForRequestInBackgroundBackup("swiped-person-action-start", datingAppType);
      }

      if(message.action === PortAction.SWIPED_PERSON_ACTION_PROCESS){
        console.log("%c Received swiped-person-action", "color: blue");
        backgroundScriptErrorHelper.storeMessageForRequestInBackgroundBackup("swiped-person-action-process", datingAppType);
      }

      if(message.action === PortAction.SWIPED_PERSON_ACTION_END){
        console.log("%c Received swiped-person-action", "color: blue");
        backgroundScriptErrorHelper.storeMessageForRequestInBackgroundBackup("swiped-person-action-end", datingAppType);
      }
    });


    globalThis.port.onDisconnect.addListener(() => {

      if (!globalThis.beforeRequestInterceptor) {
        console.error(`beforeRequestInterceptor was not set when the listener should be removed`);
        return;
      }

      globalThis.beforeRequestInterceptor.removeListener(globalThis.requestInterceptorFn);
      if (!globalThis.beforeRequestInterceptor.hasListeners()) {
        console.log(`All listeners for beforeRequestInterceptor have been succesfully disconnected`);
      } else {
        throw Error(`Attempt to remove listener of beforeRequestInterceptor failed.`);
      }
    });

  }

  public _requestInterceptorFn(details: chrome.webRequest.WebRequestBodyDetails): void {

    // the line below logs all tinder requests because the app only responds to tinder requests according to the settings in the manifest.json
    // console.log(`%crequestInitiator: ${details.initiator}, Requesturl: ${details.url}`, 'color: red');

    if(!globalThis.tinderRequestInterceptorHelper.isKnownDatingAppOriginRequest(details)){
      return;
    }
    
    const datingAppType: DatingAppType = globalThis.tinderRequestInterceptorHelper.getDatingAppTypeFromRequest(details);
    console.log(`what is the dating app type?: ${datingAppType}`);
    const isDatingAppSwipeRequest = globalThis.tinderRequestInterceptorHelper.isDatingAppSwipeRequest(details);
    console.log(`is this is a datingapp swipe request?: ${isDatingAppSwipeRequest}`);
    
    // Stores all requests made by the datingapp 
    // This action is preformed because of 2 reasons:
    // 1. if for whatever reason the like/pass/superlike/whatever is not being sent to the contentscript, the swiped person datarecord will contain an tempId along the lines of; 'idNotRetrievedPleaseCheckBackgroundRequestsBackupsInLocalStorage-(datetimestamp)'
      // thus I can get the id from the localStorage for future reference
    // 2. if the api for like/pass/superlike/whatever changes, i can look back at these logs and determine the new api without losing any data

    console.log("%c Going to store this request in cache: "+details.url, "color: orange");
    backgroundScriptErrorHelper.storeRequestInBackgroundBackup(details, isDatingAppSwipeRequest, datingAppType);

    // Ensure that only tinder webRequests will be processed
    if(datingAppType === DatingAppType.UNKNOWN){
      console.warn(`Received request is from known datingapp but datingAppType was unknown: ${details}`);
      return;
    }

    if (!isDatingAppSwipeRequest) {
      return;
    }

    // In order to avoid the 100+ requests per minute (for some apps), I store all requests in memory 
    // & check if the request has already been made it it has the exact same url.
    // if it has, then prevent the rest of the code from executing (checking swipe action)
    // if it has not, then continue

    // don't worry, every swipe action will always (i hope) have a unique id in the url for the person I swiped on
    if (!globalThis.tinderRequestInterceptorHelper._isDifferentRequest(details) && !isDatingAppSwipeRequest) {
      return;
    }

    const action: {
      submitType: PersonAction;
      personId: string;
    } | null = tinderRequestInterceptorHelper.getSwipeUrl(details);

    if (action) {
      globalThis.sendMessageToContent(action, globalThis.port, datingAppType);
    }
  }

  private _sendMessageToContent(submitAction: SubmitAction, port: chrome.runtime.Port, datingAppType: DatingAppType): void {
    // console.log('%cgoing to send message from background after getting tinder tab by promise', 'color: orange');

    const message: PortMessage = {
      messageSender: 'BACKGROUND',
      action: PortAction.SUBMIT_ACTION,
      payload: [submitAction],
      datingAppType: datingAppType
    };

    try {
      port.postMessage(message);
    } catch (err: unknown) {
      const customError = backgroundScriptErrorHelper.retrieveErrorFromUnknownError(err);
      backgroundScriptErrorHelper.setErrorInLocalStorage(submitAction.personId, submitAction.submitType, customError, datingAppType).finally(()=>{

        const options: chrome.notifications.NotificationOptions = {
          title: 'Warning',
          type: 'basic',
          message: `An error occured! But don't worry, your received data has been saved in your localStorage for future manual retrieval. Don't forget to inspect it when you are ready! Error: ${customError.message}. TIP: By requesting all the retrrieved user id's to the user endpoint I can still retrieve all the details of the profiles I swiped on!`,
          iconUrl: 'assets/alert-warning.png'
        }
        chrome.notifications.create(`backgroundScriptError-${new Date().toISOString()}`, options);
  
        console.error(`An error: ${err} occured while attempting to send: ${message} to the content script. The message will be stored in localStorage, so please retrieve the data at a later point manually from localStorage.`);
        console.info(`TIP: By requesting all the retrrieved user id's to the user endpoint I can still retrieve all the details of the profiles I swiped on`);
      });

    }

  }

  private _getDatingAppType(datingAppType: string): DatingAppType {
    switch (true) {
      case datingAppType === DatingAppType.TINDER:
        return DatingAppType.TINDER;
      case datingAppType === DatingAppType.HAPPN:
        return DatingAppType.HAPPN;
      case datingAppType === DatingAppType.UNKNOWN:
        return DatingAppType.UNKNOWN;
    }
    return DatingAppType.UNKNOWN;
  }
}