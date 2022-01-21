import { PersonAction } from "../peronAction.enum";
import { PortMessage } from "src/content/interfaces/portMessage.interface";

export class requestInterceptor {
  public activeTabId: number | undefined;
  public xAuthToken: string | undefined;

  constructor() {
    chrome.webRequest.onBeforeRequest.addListener(
      (details: chrome.webRequest.WebRequestFullDetails) => {

        if (!this.isTinderRequest(details)) {
          return;
        }

        // todo: refactor this to interface in own file?
        let action: SubmitAction | undefined = undefined;

        switch (true) {
          case details.url.startsWith('https://api.gotinder.com/like/'):
            action = {
              'submitType': PersonAction.LIKED_PERSON,
              'personId': this._getPersonIdFromUrl(details.url)
            };
            break;
          case details.url.startsWith('https://api.gotinder.com/superlike/') && details.url.includes('super'):
            // superlike example: https://api.gotinder.com/like/57f2a33a6dda1f6b095088af/super?locale=nl
            action = {
              'submitType': PersonAction.SUPER_LIKED_PERSON,
              'personId': this._getPersonIdFromUrl(details.url)
            };
            break;
          case details.url.startsWith('https://api.gotinder.com/pass/'):
            action = {
              'submitType': PersonAction.PASSED_PERSON,
              'personId': this._getPersonIdFromUrl(details.url)
            };
            break;
          default:
            break;
        }

        if(action){
          this.sendMessageToContent(action);
        }

      },
      { urls: ["https://api.gotinder.com/*"] },
      ['requestBody']
    );

    chrome.tabs.onActivated.addListener((activeTabInfo:chrome.tabs.TabActiveInfo) => {
      console.dir(`Activetab changed! The id is now: ${activeTabInfo.tabId}`);
      this.setTinderTabId();
    });

  }

  private _getPersonIdFromUrl(url: string): string {
    const urlStrippedStart: string = url.replace('https://api.gotinder.com/like/', '');
    return urlStrippedStart.slice(0, urlStrippedStart.indexOf('?'));
  }

  private sendMessageToContent(submitAction: SubmitAction): void {
    console.log('going to send message before if');
    console.dir(`active tab is: ${this.activeTabId}`);
    if (this.activeTabId) {
      console.log('going to send message after if');
      const port = chrome.tabs.connect(this.activeTabId, <chrome.runtime.Port>{name: "knockknock"});
      const portMessage: PortMessage = {
        'messageSender': 'BACKGROUND', 
        'action': 'SUBMIT_ACTION',
        'payload': [submitAction]
      }; 
      port.postMessage(portMessage);
      console.log(`message sent from background!`);
    }
  }

  private isTinderRequest(details: chrome.webRequest.WebRequestHeadersDetails): boolean {
    return details.initiator && details.initiator === "https://tinder.com" || details.initiator === "https://api.gotinder.com" ? true : false;
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

export interface SubmitAction {
  submitType: PersonAction | undefined,
  personId: string
}
