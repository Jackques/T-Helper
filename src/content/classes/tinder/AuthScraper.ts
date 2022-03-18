export class AuthScraper {
    //todo: this may no longer be needed as we can easily get the xAuthToken from localStorage?
    public xAuthToken: string | undefined;
    public callback: Function | undefined;
    constructor(){
        
        chrome.runtime.onMessage.addListener((token:string) => {
            // This data came from background.js
            // debugger;
            this.xAuthToken = token;

            if(this.callback){
                this.callback(this.xAuthToken);
            }
        });
    }
}