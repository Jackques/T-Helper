export class dataConversationVibe {
    public static isValidEntry(score: number): boolean {
        if(!Number.isInteger(score)){
            return false;
        }
        return score > 1 && score >= 6 ? true : false;
        //todo: test if it does not accept any number with decimals, less than 1 or greater than 6.
    }

}