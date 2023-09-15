import { PersonAction } from "../../personAction.enum";
import { DateHelper } from "../../content/classes/util/dateHelper";
import { LocalStorageFacade } from "./Storage";
import { DatingAppType } from "src/datingAppType.enum";


export class backgroundScriptErrorHelper {
  public static async storeMessageForRequestInBackgroundBackup(message: string, datingAppType: DatingAppType): Promise<void> {
    //TODO TODO TODO: since i literally copied this code from storeRequestInBackgroundBackup i might want to refactor all of this some time
    const maximumDaysBackupRequests = 3;
    let listOfRequests: { timestamp: string; url: string; httpMethod: string; isKnownSwipeRequest: boolean, datingAppType: string }[] = [];

    const localStorageCurrentItem = await this.localStorage.getItem('requests-backup-'+datingAppType.toString());
    if (localStorageCurrentItem !== null) {
      // console.log("%c Requests-backup exist already", "color: red");
      // for simplicity sake, i know for a fact that it will always return an array with objects with string key, values inside
      listOfRequests = JSON.parse(localStorageCurrentItem) as { timestamp: string; url: string; httpMethod: string; isKnownSwipeRequest: boolean; datingAppType: string }[];

      //TODO: Should create check which filters out urls with the same text content (and only keep the most recent one). This will greatly help reduce the amount of data being stored as it may get big really soon!
      listOfRequests = listOfRequests.filter((requestItem) => {
        return DateHelper.isDateBetweenGreaterThanAmountOfDays(requestItem.timestamp, new Date().toISOString(), maximumDaysBackupRequests) ? false : true;
      });

      this.localStorage.removeItem('requests-backup-'+datingAppType.toString()).catch(() => {
        console.warn(`Could not remove item from localStorage, please check the localStorage: ${listOfRequests}`);
      });
    }
    // console.log("%c Requests-backup can be added", "color: red");
    listOfRequests.push({ timestamp: new Date().toISOString(), url: message, httpMethod: 'NA', isKnownSwipeRequest: true, datingAppType: datingAppType.toString()});
    this.localStorage.setItem('requests-backup-'+datingAppType.toString(), JSON.stringify(listOfRequests)).then(()=>{
      // console.log("%c Requests-backup updated/added", "color: red");
    }).catch(() => {
      console.warn(`Could not set item from localStorage, please check the localStorage: ${listOfRequests}`);
    });
  }

  private static localStorage = new LocalStorageFacade();

  public static async storeRequestInBackgroundBackup(details: chrome.webRequest.WebRequestBodyDetails, isTinderSwipeRequest: boolean, datingAppType: DatingAppType): Promise<void> {
    const maximumDaysBackupRequests = 3;
    let listOfRequests: { timestamp: string; url: string; httpMethod: string; isKnownSwipeRequest: boolean; datingAppType: string }[] = [];

    const localStorageCurrentItem = await this.localStorage.getItem('requests-backup-'+datingAppType.toString());
    if (localStorageCurrentItem !== null) {
      // console.log("%crequests-backup exist already", "color: red");
      // for simplicity sake, i know for a fact that it will always return an array with objects with string key, values inside
      listOfRequests = JSON.parse(localStorageCurrentItem) as { timestamp: string; url: string; httpMethod: string; isKnownSwipeRequest: boolean; datingAppType: string }[];

      //TODO: Should create check which filters out urls with the same text content (and only keep the most recent one). This will greatly help reduce the amount of data being stored as it may get big really soon!
      listOfRequests = listOfRequests.filter((requestItem) => {
        return DateHelper.isDateBetweenGreaterThanAmountOfDays(requestItem.timestamp, new Date().toISOString(), maximumDaysBackupRequests) ? false : true;
      });

      this.localStorage.removeItem('requests-backup-'+datingAppType.toString()).catch(() => {
        console.warn(`Could not remove item from localStorage, please check the localStorage: ${listOfRequests}`);
      });
    }
    // console.log("%c Requests-backup can be added", "color: red");
    listOfRequests.push({ timestamp: new Date().toISOString(), url: details.url, httpMethod: details.method, isKnownSwipeRequest: isTinderSwipeRequest, datingAppType: datingAppType.toString() });
    this.localStorage.setItem('requests-backup-'+datingAppType.toString(), JSON.stringify(listOfRequests)).then(()=>{
      // console.log("%c Requests-backup updated/added", "color: red");
    }).catch(() => {
      console.warn(`Could not set item from localStorage, please check the localStorage: ${listOfRequests}`);
    });
  }

  public static async getBackupRequests(datingAppType: DatingAppType):Promise<{ timestamp: string; url: string; httpMethod: string; isKnownSwipeRequest: boolean; datingAppType: DatingAppType }[] | undefined> {
    return this.localStorage.getItem('requests-backup-'+datingAppType.toString()).then((result)=>{
      if(result === null){
        console.log("%c RESULT APPEARED TO BE NULL!?!?!?", "color: red");
        return undefined;
      }
      const parsedResult = JSON.parse(result) as { timestamp: string; url: string; httpMethod: string; isKnownSwipeRequest: boolean; datingAppType: DatingAppType }[];
      // console.log(`I got the requests-backup 2: `);
      console.table(parsedResult);
      // console.log(`I got the requests-backup 2: `);
      return parsedResult;
    });
  }


  public static async setErrorInLocalStorage(personId: string, submitType: PersonAction | undefined, error: Error, datingAppType: DatingAppType): Promise<void> {
    let dataArrayToStore = [{
      dateTimeISO: new Date().toISOString(),
      personId: personId,
      submitType: submitType,
      errorMessage: error.message,
      errorStack: error.stack ? error.stack : '',
      datingAppType: datingAppType.toString()
    }];

    if (await this.hasLocalStorageBackgroundScriptErrorSet()) {

      const previousErrorsArray = JSON.parse(await this.getPreviousErrorInLocalStorage());
      dataArrayToStore = dataArrayToStore.concat(previousErrorsArray);
    }

    this.localStorage.removeItem(`backgroundScriptError`).catch(() => {
      console.warn(`Could not remove item from localStorage: ${`backgroundScriptError`}, please check the localStorage`);
    });

    this.localStorage.setItem('backgroundScriptError', JSON.stringify(dataArrayToStore)).catch((err) => {
      const customError = this.retrieveErrorFromUnknownError(err);
      const options: chrome.notifications.NotificationOptions = {
        title: 'Error',
        type: 'basic',
        message: `Could not write to localStorage! Stop using the app immediately to prevent further loss of data. Check console log of backgroundscript immediatly.`,
        iconUrl: 'assets/alert-error.png'
      };
      chrome.notifications.create(`backgroundScriptError-${new Date().toISOString()}`, options);
      console.error(`backgroundScriptError-${new Date().toISOString()}; ${customError.message}, ${customError}`);
    });
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

  private static async getPreviousErrorInLocalStorage(): Promise<string> {
    const localStorageBackgroundScriptError: string | null = await this.localStorage.getItem(`backgroundScriptError`);
    if (localStorageBackgroundScriptError === null) {
      return '';
    } else {
      return localStorageBackgroundScriptError;
    }
  }

  private static async hasLocalStorageBackgroundScriptErrorSet(): Promise<boolean> {
    return await this.localStorage.getItem(`backgroundScriptError`) === null ? false : true;
  }
}
