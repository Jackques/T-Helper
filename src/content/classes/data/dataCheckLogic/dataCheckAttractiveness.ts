import { validEntrySimple } from "src/content/interfaces/data/validEntrySimple";
import { dataCheckSimple } from "./dataCheckSimple";

export class dataAttractiveness extends dataCheckSimple implements validEntrySimple {
    public isValidEntry(score: number): boolean {
        
        if(!Number.isInteger(score)){
            return false;
        }
        return score > 1 && score <= 10 ? true : false;
        //todo: test if it accepts 8.5, 7.5 etc.
    }

}