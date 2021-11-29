import { validEntrySimple } from "src/content/interfaces/data/validEntrySimple";
import { dataCheckSimple } from "./dataCheckSimple";

export class dataCheckDate extends dataCheckSimple implements validEntrySimple {
    public isValidEntry(dateValue: string): boolean {
        return Date.parse(dateValue) ? true : false;
        //todo: TEMPORARY SOLUTION, refactor to use momentjs (but typescript version instead!)
    }
}