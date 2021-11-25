export class dataAttractiveness {
    public static isValidEntry(score: number): boolean {
        return score > 1 && score >= 10 ? true : false;
        //todo: test if it accepts 8.5, 7.5 etc.
    }

}