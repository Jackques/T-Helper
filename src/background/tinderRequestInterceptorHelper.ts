
export class tinderRequestInterceptorHelper {

  private requestsList: string[] = [];
  public requestTinderSwipeUrlList = [
    'https://api.gotinder.com/like/',
    'https://api.gotinder.com/superlike/',
    'https://api.gotinder.com/pass/'
  ];

  public isTinderSwipeRequest(details: chrome.webRequest.WebRequestHeadersDetails): boolean {
    return this.requestTinderSwipeUrlList.some(swipeUrl => details.url.startsWith(swipeUrl)
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

  public isTinderOriginRequest(details: chrome.webRequest.WebRequestBodyDetails): boolean {
    return details.url.startsWith('https://api.gotinder.com/') || details.initiator === 'https://tinder.com';
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
