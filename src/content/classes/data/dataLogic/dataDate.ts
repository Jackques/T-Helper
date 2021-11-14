export class dataDate {
    constructor(){

    }

    public static isDate(stringValue: string): boolean {
        return Date.parse(stringValue) ? true : false;
        //todo: TEMPORARY SOLUTION, refactor to use momentjs (but typescript version instead!)
    }
}