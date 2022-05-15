import { PersonAction } from "../peronAction.enum";
import { PortMessage } from "src/content/interfaces/portMessage.interface";

export class backgroundScriptErrorHelper {

  public static setErrorInLocalStorage(personId: string, submitType: PersonAction | undefined, error: Error): void {
    let dataArrayToStore = [{
      dateTimeISO: new Date().toISOString(),
      personId: personId,
      submitType: submitType,
      errorMessage: error.message,
      errorStack: error.stack ? error.stack : ''
    }];

    if (this.hasLocalStorageBackgroundScriptErrorSet()) {

      const previousErrorsArray = JSON.parse(this.getPreviousErrorInLocalStorage());
      dataArrayToStore = dataArrayToStore.concat(previousErrorsArray);
    }

    localStorage.removeItem(`backgroundScriptError`);
    try {
      localStorage.setItem(`backgroundScriptError`, JSON.stringify(dataArrayToStore));
    } catch (err: unknown) {
      const customError = this.retrieveErrorFromUnknownError(err);
      const options: chrome.notifications.NotificationOptions = {
        title: 'Error',
        type: 'basic',
        message: `Could not write to localStorage! Stop using the app immediatly to prevent further loss of data. Check console log of backgroundscript immediatly.`,
        iconUrl: 'assets/alert-error.png'
      }
      chrome.notifications.create(`backgroundScriptError-${new Date().toISOString()}`, options);
      console.error(`backgroundScriptError-${new Date().toISOString()}; ${customError.message}, ${customError}`);
    }
  }

  public static retrieveErrorFromUnknownError(err: unknown): Error {
    let customError;
    if (err instanceof Error) {
      customError = err as Error;
    } else if (typeof err === 'object') {
      customError = new Error(JSON.stringify(err));
    } else {
      const errorMessage = String(err);
      customError = new Error(errorMessage);
    }
    return customError;
  }

  private static getPreviousErrorInLocalStorage(): string {
    const localStorageBackgroundScriptError: string | null = localStorage.getItem(`backgroundScriptError`);
    if (localStorageBackgroundScriptError === null) {
      return '';
    } else {
      return localStorageBackgroundScriptError;
    }
  }

  private static hasLocalStorageBackgroundScriptErrorSet(): boolean {
    return localStorage.getItem(`backgroundScriptError`) === null ? false : true;
  }
}

export class tinderRequestInterceptorHelper {

  private requestsList: string[] = [];
  public requestTinderSwipeUrlList = [
    'https://api.gotinder.com/like/',
    'https://api.gotinder.com/superlike/',
    'https://api.gotinder.com/pass/'
  ];

  public isTinderSwipeRequest(details: chrome.webRequest.WebRequestHeadersDetails): boolean {
    return this.requestTinderSwipeUrlList.some(swipeUrl =>
      details.url.startsWith(swipeUrl)
    );
  }

  public _isDifferentRequest(details: chrome.webRequest.WebRequestBodyDetails): boolean {
    // console.log(`oke, we gaan eens checken of dit ontvangen request (${details.url}) al eens eerder is voorgekomen: ${this.requestsList}`);
    if (!this.requestsList.includes(details.url)) {
      this.requestsList.push(details.url);
      // console.log(`Ik zal eens het ontvangen request (${details.url}) toevoegen: ${this.requestsList}`);
      return true;
    }
    // console.log(`Hey! Ik heb dus alweer hetzelfde request ontvangen: ${details.url}. Deze zit toch al in mijn ${this.requestsList}`);
    return false;
  }

  public _getPersonIdFromUrl(url: string): string {

    let longestStringInArray = "";

    // the personId string even without the '?locale=nl' part is always the longest with 24 characters
    url.split('/').forEach((urlPart) => {
      if (longestStringInArray.length < urlPart.length) {
        longestStringInArray = urlPart;
      }
    });

    if (longestStringInArray.length > 0) {
      longestStringInArray = longestStringInArray.indexOf('?') !== -1 ? longestStringInArray.substring(0, longestStringInArray.indexOf('?')) : longestStringInArray;
      longestStringInArray = longestStringInArray.indexOf('&') !== -1 ? longestStringInArray.substring(0, longestStringInArray.indexOf('&')) : longestStringInArray;
      return longestStringInArray;
    }
    console.error(`Could not get personId from url. Please check the settings for retrieving personId from string`);
    return url;
  }

}




export class requestInterceptor {

  constructor() {

    globalThis.onConnect = chrome.runtime.onConnect;
    globalThis.onConnect.addListener(this._onConnectListenerFn);

    globalThis.requestInterceptorFn = this._requestInterceptorFn;
    globalThis.sendMessageToContent = this._sendMessageToContent;

    globalThis.tinderRequestInterceptorHelper = new tinderRequestInterceptorHelper();
    globalThis.backgroundScriptErrorHelper = new backgroundScriptErrorHelper();

  }

  private _onConnectListenerFn(port: chrome.runtime.Port): void {
    console.log(`Background Port activated! ${port.name}`);

    globalThis.port = port;
    globalThis.beforeRequestInterceptor = chrome.webRequest.onBeforeRequest;

    globalThis.beforeRequestInterceptor.addListener(globalThis.requestInterceptorFn, { urls: ["https://api.gotinder.com/*"] }, ['requestBody']);

    if (!globalThis.beforeRequestInterceptor.hasListeners()) {
      console.error(`beforeRequestInterceptor listener is not set. Please check the code.`);
      return;
    }

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

  private _requestInterceptorFn(details: chrome.webRequest.WebRequestBodyDetails): void {

    // the line below logs all tinder requests because the app only responds to tinder requests according to the settings in the manifest.json
    // console.log(`%crequestInitiator: ${details.initiator}, Requesturl: ${details.url}`, 'color: red');

    if (!globalThis.tinderRequestInterceptorHelper.isTinderSwipeRequest(details)) {
      return;
    }

    if (!globalThis.tinderRequestInterceptorHelper._isDifferentRequest(details)) {
      return;
    }

    // todo: refactor this to interface in own file?
    let action: SubmitAction | undefined = undefined;

    switch (true) {
      case details.url.startsWith(globalThis.tinderRequestInterceptorHelper.requestTinderSwipeUrlList[0]) || details.url.startsWith(globalThis.tinderRequestInterceptorHelper.requestTinderSwipeUrlList[1]) && details.url.includes('super'):
        // superlike example: https://api.gotinder.com/like/57f2a33a6dda1f6b095088af/super?locale=nl
        action = {
          'submitType': PersonAction.SUPER_LIKED_PERSON,
          'personId': globalThis.tinderRequestInterceptorHelper._getPersonIdFromUrl(details.url)
        };
        break;
      case details.url.startsWith(globalThis.tinderRequestInterceptorHelper.requestTinderSwipeUrlList[0]):
        // like url example: https://api.gotinder.com/like/61ed3245cf08560100178715?locale=nl
        // https://api.gotinder.com/like/5fccbf17a0848701001bb1f5?locale=nl
        action = {
          'submitType': PersonAction.LIKED_PERSON,
          'personId': globalThis.tinderRequestInterceptorHelper._getPersonIdFromUrl(details.url)
        };
        break;
      case details.url.startsWith(globalThis.tinderRequestInterceptorHelper.requestTinderSwipeUrlList[2]):
        // pass url example: https://api.gotinder.com/pass/61d9f860039cc801009182a1?locale=nl&s_number=8699887070750215
        action = {
          'submitType': PersonAction.PASSED_PERSON,
          'personId': globalThis.tinderRequestInterceptorHelper._getPersonIdFromUrl(details.url)
        };
        break;
      default:
        break;
    }

    if (action) {
      globalThis.sendMessageToContent(action, globalThis.port);
    }

  }

  private _sendMessageToContent(submitAction: SubmitAction, port: chrome.runtime.Port): void {
    // console.log('%cgoing to send message from background after getting tinder tab by promise', 'color: orange');

    const message: PortMessage = {
      messageSender: 'BACKGROUND',
      action: 'SUBMIT_ACTION',
      payload: [submitAction]
    };

    try {
      port.postMessage(message);
    } catch (err: unknown) {
      const customError = backgroundScriptErrorHelper.retrieveErrorFromUnknownError(err);
      backgroundScriptErrorHelper.setErrorInLocalStorage(submitAction.personId, submitAction.submitType, customError);

      const options: chrome.notifications.NotificationOptions = {
        title: 'Warning',
        type: 'basic',
        message: `An error occured! But don't worry, your received data has been saved in your localStorage for future manual retrieval. Don't forget to inspect it when you are ready! Error: ${customError.message}. TIP: By requesting all the retrrieved user id's to the user endpoint I can still retrieve all the details of the profiles I swiped on!`,
        iconUrl: 'assets/alert-warning.png'
      }
      chrome.notifications.create(`backgroundScriptError-${new Date().toISOString()}`, options);

      console.error(`An error: ${err} occured while attempting to send: ${message} to the content script. The message will be stored in localStorage, so please retrieve the data at a later point manually from localStorage.`);
      console.info(`TIP: By requesting all the retrrieved user id's to the user endpoint I can still retrieve all the details of the profiles I swiped on`);
    }

  }

}

export interface SubmitAction {
  submitType: PersonAction | undefined,
  personId: string
}
