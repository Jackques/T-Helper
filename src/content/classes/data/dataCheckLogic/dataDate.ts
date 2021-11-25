export class dataDate {
    public static isDate(dateValue: string): boolean {
        return Date.parse(dateValue) ? true : false;
        //todo: TEMPORARY SOLUTION, refactor to use momentjs (but typescript version instead!)
    }
}