import { DatingAppType } from "../../datingAppType.enum";
import { PersonAction } from "../../personAction.enum";

export class SwipeUrl {
    private swipeUrl: string;
    private datingAppType: DatingAppType;
    private submitType: PersonAction[];
    private getPersonIdMethod: undefined | ((requestDetails: chrome.webRequest.WebRequestBodyDetails) => string | undefined);
    private swipeUrlCheckMethod: undefined | ((requestDetails: chrome.webRequest.WebRequestBodyDetails, submitTypeList: PersonAction[]) => PersonAction | undefined);
    
    constructor(
            swipeUrl: string, 
            datingAppType: DatingAppType, 
            submitType: PersonAction[], 
            getPersonIdMethod: (requestDetails: chrome.webRequest.WebRequestBodyDetails) => string | undefined,
            swipeUrlCheckMethod?: (requestDetails: chrome.webRequest.WebRequestBodyDetails, submitTypeList: PersonAction[]) => PersonAction | undefined
        ){
        this.swipeUrl = swipeUrl;
        this.datingAppType = datingAppType;
        this.submitType = submitType;
        this.getPersonIdMethod = getPersonIdMethod;
        this.swipeUrlCheckMethod = swipeUrlCheckMethod ? swipeUrlCheckMethod : undefined;

        this.isSetDataValid();
    }

    public getSwipeUrl(): string {
        return this.swipeUrl;
    }

    public isUrlRecognizedSwipeUrl(requestDetails: chrome.webRequest.WebRequestBodyDetails): boolean {

        if(this.swipeUrlCheckMethod){
            return this.swipeUrlCheckMethod(requestDetails, this.submitType) ? true : false;
        }

        return requestDetails.url.startsWith(this.swipeUrl);
    }

    public getResultsSwipeUrl(requestDetails: chrome.webRequest.WebRequestBodyDetails): {
        'submitType': PersonAction,
        'personId': string
    } | null {
        const swipeAction = this.getSwipeAction(requestDetails);
        const personId = this.getPersonId(requestDetails);

        if(!swipeAction || !personId){
            return null;
        }

        const result = {
            'submitType': swipeAction,
            'personId': personId
        };

        return result;
    }

    private getSwipeAction(requestDetails: chrome.webRequest.WebRequestBodyDetails): PersonAction | null {
        let personActionFromSwipeUrlCheckMethod: PersonAction | undefined = undefined;
        if(this.swipeUrlCheckMethod){
            personActionFromSwipeUrlCheckMethod = this.swipeUrlCheckMethod(requestDetails, this.submitType);
            if(personActionFromSwipeUrlCheckMethod){
                return personActionFromSwipeUrlCheckMethod;
            }
            // throw new Error(`Could not retrieve PersonAction from set swipeUrlCheckMethod. Please check the logic of the swipeUrlCheckMethod.`);
            console.error(`Could not retrieve PersonAction from set swipeUrlCheckMethod. Please check the logic of the swipeUrlCheckMethod.`);
            return null;
        }

        if(!this.submitType || this.submitType.length === 0 || this.submitType.length > 1){
            // throw new Error(`SwipeUrlCheckMethod must be set with multiple submitTypes in an array in order to determine the correct PersonAction to return.`);
            console.error(`SwipeUrlCheckMethod must be set with multiple submitTypes in an array in order to determine the correct PersonAction to return.`);
            return null;
        }else{
            return this.submitType[0];
        }
    }

    private getPersonId(requestDetails: chrome.webRequest.WebRequestBodyDetails): string | null {
        if(this.getPersonIdMethod){
            const personId = this.getPersonIdMethod(requestDetails);
            if(personId){
                return personId;
            }
            // throw new Error(`Could not get personId from set getPersonIdMethod in swipeUrl: ${this.swipeUrl}`);
            console.error(`Could not get personId from set getPersonIdMethod in swipeUrl: ${this.swipeUrl}`);
            return null;
        }
        // throw new Error(`Set getPersonIdMethod for swipeUrl: ${this.swipeUrl} cannot be falsy/unknown`);
        console.error(`Set getPersonIdMethod for swipeUrl: ${this.swipeUrl} cannot be falsy/unknown`);
        return null;
    }

    private isSetDataValid(): void {
        if(!this.swipeUrl || this.swipeUrl.length === 0){
            throw new Error(`Set SwipeUrl cannot be falsy or empty string`);
        }

        if(this.datingAppType === DatingAppType.UNKNOWN){
            throw new Error(`Set DatingAppType for swipeUrl: ${this.swipeUrl} cannot be falsy/unknown`);
        }

        if(!this.submitType || this.submitType.length === 0){
            throw new Error(`Set SubmitType list cannot be falsy/empty`);
        }

        if(this.submitType.length > 1 && !this.swipeUrlCheckMethod){
            throw new Error(`If multiple submitType are provided a swipeUrlCheckMethod must also be provided for choosing the correct submitType to return based on the swipeUrlCheckMethod`);
        }

        if(!this.getPersonIdMethod){
            throw new Error(`Set getPersonIdMethod for swipeUrl: ${this.swipeUrl} cannot be falsy/unknown`);
        }
    }
}