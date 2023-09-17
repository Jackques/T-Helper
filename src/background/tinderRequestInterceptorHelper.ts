import { PersonAction } from "../personAction.enum";
import { DatingAppType } from "../datingAppType.enum";
import { SwipeUrl } from "./swipeUrl";

export class DatingAppRequestInterceptorHelper {
  private requestsList: string[] = [];
  private supportedDomainList: { datingAppType: DatingAppType, domain: string }[] = [
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

  // public requestTinderSwipeUrlList = [
  //   'https://api.gotinder.com/like/',
  //   'https://api.gotinder.com/superlike/',
  //   'https://api.gotinder.com/pass/'
  // ];

  private requestSwipeUrlList: SwipeUrl[] = [
    new SwipeUrl(
      'https://api.gotinder.com/like/',
      DatingAppType.TINDER,
      [PersonAction.LIKED_PERSON],
      ((details: chrome.webRequest.WebRequestHeadersDetails) => this.getPersonIdFromUrlTinder(details.url)),
      undefined
    ),
    new SwipeUrl(
      'https://api.gotinder.com/superlike/',
      DatingAppType.TINDER,
      [PersonAction.SUPER_LIKED_PERSON],
      ((details: chrome.webRequest.WebRequestHeadersDetails) => this.getPersonIdFromUrlTinder(details.url)),
      ((requestDetails: chrome.webRequest.WebRequestBodyDetails, submitTypeList: PersonAction[])=>{ return this.getSubmitTypeTinderSuperLike(requestDetails, submitTypeList)}),
    ),
    new SwipeUrl(
      'https://api.gotinder.com/pass/',
      DatingAppType.TINDER,
      [PersonAction.PASSED_PERSON],
      ((details: chrome.webRequest.WebRequestHeadersDetails) => this.getPersonIdFromUrlTinder(details.url)),
      undefined
    ),
    new SwipeUrl(
      'https://api.happn.fr/',
      DatingAppType.HAPPN,
      [PersonAction.LIKED_PERSON, PersonAction.SUPER_LIKED_PERSON, PersonAction.PASSED_PERSON],
      ((details: chrome.webRequest.WebRequestHeadersDetails) => this.getPersonIdFromUrlHappn(details.url)),
      ((requestDetails: chrome.webRequest.WebRequestBodyDetails, submitTypeList: PersonAction[])=>{ return this.getSubmitTypeHappnSwipeRequest(requestDetails, submitTypeList)})
    ),
  ];

  public isDatingAppSwipeRequest(details: chrome.webRequest.WebRequestHeadersDetails): boolean {
    return this.requestSwipeUrlList.some((swipeUrl: SwipeUrl) => details.url.startsWith(swipeUrl.getSwipeUrl())
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
    return this.supportedDomainList.some((supportedDomain) => {
      return details.url.startsWith(supportedDomain.domain) || details.initiator === supportedDomain.domain ? true : false;
    });
  }

  public getDatingAppTypeFromRequest(details: chrome.webRequest.WebRequestBodyDetails): DatingAppType {
    const datingAppType: DatingAppType | undefined = this.supportedDomainList.find((supportedDomain) => {
      return details.url.startsWith(supportedDomain.domain) || details.initiator === supportedDomain.domain ? true : false;
    })?.datingAppType;

    return datingAppType !== undefined ? datingAppType : DatingAppType.UNKNOWN;
  }

  private getPersonIdFromUrlTinder(url: string): string {

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

  private getPersonIdFromUrlHappn(url: string): string {
    // i.e. https://api.happn.fr/api/v1/users/me/reacted/50293f29-b09f-416f-ae64-c082f83d23a8

    const splitUrl: string[] = url.split('/');

    if(splitUrl.length <= 1){
      console.error(`Could not get personId from url. Please check the settings for retrieving personId from string`);
      return url;
    }

    return splitUrl[splitUrl.length - 1]
  }

  public getSwipeUrl(requestDetails: chrome.webRequest.WebRequestBodyDetails): {
    submitType: PersonAction,
    personId: string
  } | null {
    const matchedRequestSwipeUrl: SwipeUrl | undefined = this.requestSwipeUrlList.find((requestSwipeUrl: SwipeUrl)=>{
      return requestSwipeUrl.isUrlRecognizedSwipeUrl(requestDetails);
    });
    if(!matchedRequestSwipeUrl){
      console.error(`Received request details: ${requestDetails} does not match any set SwipeUrl in requestSwipeUrlList. Please check the setting of each set SwipeUrl in the list.`);
      return null;
    }
    return matchedRequestSwipeUrl.getResultsSwipeUrl(requestDetails);
  }

  private getSubmitTypeHappnSwipeRequest(requestDetails: chrome.webRequest.WebRequestBodyDetails, submitTypeList: PersonAction[]): PersonAction | undefined {
    if(requestDetails?.requestBody?.raw?.at(0)?.bytes){
      const requestBodyContent = JSON.parse(new TextDecoder().decode(requestDetails.requestBody.raw[0].bytes));
      debugger;
    }
    console.error(`Could not retrieve raw bytes of requestBody from requestDetails for happn swipe request: ${requestDetails}. Please check the logic.`);
    return undefined;
  }

  private getSubmitTypeTinderSuperLike(requestDetails: chrome.webRequest.WebRequestBodyDetails, submitTypeList: PersonAction[]): PersonAction | undefined {
    if(requestDetails.url.startsWith('https://api.gotinder.com/superlike/') || requestDetails.url.startsWith('https://api.gotinder.com/like/') && requestDetails.url.includes('super')){
      if(submitTypeList.length === 0 || submitTypeList.length > 1){
        console.error(`submitTypeList provided for getSubmitTypeTinderSuperLike does not contain only 1 PersonAction`);
        return undefined;
      }
      return submitTypeList[0];
    }
    return undefined;
  }
}
