import { validEntrySimple } from "src/content/interfaces/data/validEntrySimple";

export abstract class dataCheckSimple implements validEntrySimple {
    isValidEntry(listEntry: unknown):boolean {
        console.warn('No validators set for ???');
        return true;
    }
}