import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { portMessage } from "src/content/interfaces/portMessage.interface";

export class requestInterceptor {
  public activeTabId: number | undefined;
  public xAuthToken: string | undefined;

  //TODO: Refactor this so contentscript asks bg script for this info instead of other way around.
  private isMessageSent = false;

  private lastAction: RequestStoredValues = {
    likedPerson: null,
    superLikedPerson: null,
    passedPerson: null
  };

  constructor() {
    chrome.webRequest.onBeforeRequest.addListener(
      (details: chrome.webRequest.WebRequestFullDetails) => {

        if (!this.isTinderRequest(details)) {
          return;
        }

        let action: 'likedPersonId' | 'superLikedPerson' | 'passedPersonId' | undefined;
        let dataField:DataRecordValues | undefined;

        switch (true) {
          case details.url.startsWith('https://api.gotinder.com/like/'):
            action = 'likedPersonId';
            dataField = this._getDataRecordValueNewPerson(details.url);
            this.lastAction.likedPerson = dataField;
            break;
          case details.url.startsWith('https://api.gotinder.com/superlike/'): //todo: check if this is correct
            action = 'superLikedPerson';
            dataField = this._getDataRecordValueNewPerson(details.url);
            this.lastAction.superLikedPerson = dataField;
            break;
          case details.url.startsWith('https://api.gotinder.com/pass/'):
            action = 'passedPersonId';
            dataField = this._getDataRecordValueNewPerson(details.url);
            this.lastAction.passedPerson = dataField;
            break;
          default:
            break;
        }

        // if(action && dataField){
        //   this.sendMessageToContent(action, dataField);
        // }

      },
      { urls: ["https://api.gotinder.com/*"] },
      ['requestBody']
    );

    // chrome.webRequest.onAuthRequired.addListener((watisthis)=>{
    //   debugger
    // });
    // chrome.webRequest.onCompleted.addListener((test)=>{
    //   debugger;
    // });

    chrome.tabs.onActivated.addListener((activeTabInfo:chrome.tabs.TabActiveInfo) => {
      console.dir(`Activetab changed! The id is now: ${activeTabInfo.tabId}`);
      this.setTinderTabId();
    });

  }
  private _getDataRecordValueNewPerson(url: string): DataRecordValues {
    return {
      'label': 'System-no', 
      'value': {
        'appType': 'tinder', 
        'id': this._getPersonIdFromUrl(url)
      }
    };
  }
  private _getPersonIdFromUrl(url: string): string {
    const urlStrippedStart: string = url.replace('https://api.gotinder.com/like/', '');
    return urlStrippedStart.slice(0, urlStrippedStart.indexOf('?'));
  }

  private sendMessageToContent(action: string, dataField: DataRecordValues): void {
    console.log('going to send message before if');
    console.dir(`active tab is: ${this.activeTabId}`);
    if (this.activeTabId) {
      console.log('going to send message after if');
      const port = chrome.tabs.connect(this.activeTabId, <chrome.runtime.Port>{name: "knockknock"});
      
      port.postMessage(<portMessage>{
        'message': 'background', 
        'action': action,
        'payload': [
          dataField
        ]
      });
      console.log(`message sent from background!`);
    }
  }

  private isTinderRequest(details: chrome.webRequest.WebRequestHeadersDetails): boolean {
    return details.initiator && details.initiator === "https://tinder.com" ? true : false;
  }

  private setTinderTabId():void {
    let tinderTab:chrome.tabs.Tab | undefined;
    chrome.tabs.query({ active: true, currentWindow: true }, (arrayOfTabs: chrome.tabs.Tab[]) => {
      tinderTab = arrayOfTabs.find((tab: chrome.tabs.Tab) => {
        return tab.title && tab.title.includes('Tinder');
      });
      if(tinderTab && tinderTab.id){
        console.dir(`Found the tinder tab id! It is: ${tinderTab.id}`);
        this.activeTabId = tinderTab.id;
      }
    });
  }
}

interface RequestHeader {
  name: string;
  value: string;
}
interface RequestStoredValues {
  likedPerson: DataRecordValues | null,
  superLikedPerson: DataRecordValues | null,
  passedPerson: DataRecordValues | null
}