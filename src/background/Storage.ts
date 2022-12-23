export class Storage {

    private storage = chrome.storage.local;

    public getItem(key: string): Promise<string | null> {
        // this.storage.get(["key"]).then((result) => {
        //     console.log("Value currently is " + result.key);
        //   });

        return new Promise<string | null>((resolve, reject) => {
          try{
            this.storage.get((items: {[key: string]: unknown;})=>{
              const storageKeys: string[] = Object.keys(items);
              console.log("Does the provided key exist in storage? The answer is: " + storageKeys.includes(key) + "oh and the localstorage list is: "+ items);

              if(storageKeys.length === 0){
                return resolve(null);
              }else if(items[key]){
                  // return resolve(items[key] as string);
                  //todo: might want to add a check if items[key] is not a string, it will return null and throw an error or something
                  return resolve(items[key] as string);
              }
              return resolve(null);
              
              // return typeof items[key] === 'string' ? items[key] : null;
            })
          }catch(error){
            reject(null);
          }
        });
    }

    public async removeItem(key: string): Promise<boolean>{
      return new Promise<boolean>((resolve, reject) => {
        try{
          this.storage.remove(key, () => {
            return resolve(true);
          });
        }catch(error){
          return reject(false);
        }
      });
    }

    public async setItem(keyLocalStorage: string, valueLocalStorage: string): Promise<boolean | Error>{
      return new Promise<boolean>((resolve, reject) => {
        try{
          this.storage.set({[keyLocalStorage]: valueLocalStorage}, () => {
            return resolve(true);
          });
        }catch(error){
          return reject(error);
        }
      });
    }

}