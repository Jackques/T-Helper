export class RandomNumber {
    public static getRandomNumber(min = 0, max = 100): number {
        return this.generateRandomNumber(min,(max+1));
                //todo: BUG; will never return the max possible random value. E.g; (1,2) // this will never return a random number 2
                // when I insert (1,3) it will randomly return 1 or 2
                // hence why the (max+1)
    }

    public static getRandomBoolean(): boolean {
        return this.generateRandomNumber(1,3) > 1 ? true : false;
    }

    private static generateRandomNumber(min = 0, max = 100){        
        // find diff
        const difference = max - min;
    
        // generate random number 
        let rand = Math.random();
    
        // multiply with difference 
        rand = Math.floor( rand * difference);
    
        // add with min value 
        rand = rand + min;
    
        return rand;
    }
}