export class requestInterceptor {
  private activeTabId: number | undefined;
  public xAuthToken: string | undefined;

  //TODO: Refactor this so contentscript asks bg script for this info instead of other way around.
  private isMessageSent = false;

  constructor() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
      (details: chrome.webRequest.WebRequestHeadersDetails) => {
        // (details:any) => {
        if (!this.isMainRequest(details)) {
          return;
        }

        if (this.isMessageSent) {
          return;
        }

        this.xAuthToken = details.requestHeaders ? this.getXAUthTokenFromRequestHeadersList(details.requestHeaders) : undefined;

        this.sendMessageToContent();
      },
      { urls: ["https://api.gotinder.com/*"] },
      ["requestHeaders"]
    );

    // chrome.webRequest.onAuthRequired.addListener((watisthis)=>{
    //   debugger
    // });
    // chrome.webRequest.onCompleted.addListener((test)=>{
    //   debugger;
    // });

    chrome.tabs.onActivated.addListener((activeInfo) => {
      console.dir(`Got the activeTabId! It is: ${activeInfo.tabId}`);
      this.activeTabId = this.getTinderTabId(activeInfo.tabId) ? activeInfo.tabId : undefined;
    });

  }

  //TODO: Should be refactored to use interface RequestHeader, but error; 'should be HTTPHeader' prevents this
  private getXAUthTokenFromRequestHeadersList(requestHeaders: any[]): string {
    const xAuthHeader: RequestHeader = requestHeaders.find((requestHeader: RequestHeader) => {
      if (requestHeader.name === "X-Auth-Token" && requestHeader.value) {
        return requestHeader.value;
      }
    });
    console.dir(`Got the xAuthToken! It is: ${xAuthHeader.value}`);
    return xAuthHeader.value;
  }

  private sendMessageToContent(): void {
    if (this.xAuthToken && this.activeTabId) {
      chrome.tabs.sendMessage(this.activeTabId, this.xAuthToken, {}, () => {
        console.log(`XAuthToken retrieved & sent! xAuthToken: ${this.xAuthToken} & activeTabId: ${this.activeTabId}`);
        this.isMessageSent = true;
      });
    }
  }

  private isMainRequest(details: chrome.webRequest.WebRequestHeadersDetails): boolean {
    return details.method === "POST" && details.initiator && details.initiator === "https://tinder.com" ? true : false
  }
  private getTinderTabId(tabId:number):number | undefined{
    let tinderTab:chrome.tabs.Tab | undefined;
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs: chrome.tabs.Tab[]) {
      tinderTab = arrayOfTabs.find((tab: chrome.tabs.Tab) => {
        return tab.title && tab.title.includes('Tinder');
      });
    });
    if(tinderTab && tinderTab.id){
      console.dir(`Found the tinder tab id! It is: ${tinderTab.id}`);
      return tinderTab.id
    }
    return undefined;
  }

};

interface RequestHeader {
  name: string;
  value: string;
}
