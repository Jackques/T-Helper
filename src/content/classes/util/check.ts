export class Check {
    static isValidDate(dateString: string): boolean {
        return new Date(dateString) ? true : false;
    }
    static isPositiveNumberEntry(numberEntry: number): boolean {
        return numberEntry > 0 ? true : false;
    }
}