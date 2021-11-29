import { validEntrySimple } from "src/content/interfaces/data/validEntrySimple";
import { dataCheckSimple } from "./dataCheckSimple";

export class dataConversationVibe extends dataCheckSimple implements validEntrySimple {
    public isValidEntry(score: number): boolean {
        if(!Number.isInteger(score)){
            return false;
        }
        return score > 1 && score <= 6 ? true : false;
        //todo: test if it does not accept any number with decimals, less than 1 or greater than 6.
    }

}

