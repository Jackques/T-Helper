import { DatingAppType } from "../datingAppType.enum";

export class DatingAppRequestInterceptorHelper {

  private requestsList: string[] = [];
  private supportedDomainList: {datingAppType: DatingAppType, domain: string}[] = [
    {
      datingAppType: DatingAppType.TINDER,
      domain: 'https://api.gotinder.com/'
    },
    {
      datingAppType: DatingAppType.TINDER,
      domain: 'https://tinder.com'
    },
    {
      datingAppType: DatingAppType.HAPPN,
      domain: 'https://happn.app'
    },
    {
      datingAppType: DatingAppType.HAPPN,
      domain: 'https://happn.app.fr'
    },
    {
      datingAppType: DatingAppType.HAPPN,
      domain: 'https://api.happn.fr'
    }
  ];

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

  public isKnownDatingAppOriginRequest(details: chrome.webRequest.WebRequestBodyDetails): boolean {
    return this.supportedDomainList.some((supportedDomain)=>{
      return details.url.startsWith(supportedDomain.domain) || details.initiator === supportedDomain.domain ? true : false;
    });
  }

  public getDatingAppTypeFromRequest(details: chrome.webRequest.WebRequestBodyDetails): DatingAppType {
    const datingAppType: DatingAppType | undefined = this.supportedDomainList.find((supportedDomain)=>{
      return details.url.startsWith(supportedDomain.domain) || details.initiator === supportedDomain.domain ? true : false;
    })?.datingAppType;

    return datingAppType !== undefined ? datingAppType : DatingAppType.UNKNOWN;
  }

  public getPersonIdFromUrlTinder(url: string): string {

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
