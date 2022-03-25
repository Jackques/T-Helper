import * as moment from 'moment';
import 'moment/locale/nl';

moment.locale('nl');

export class Check {
    static isValidDate(dateString: string): boolean {
        return moment.default(dateString, true).isValid() ? true : false;
    }
    static isPositiveNumberEntry(numberEntry: number): boolean {
        return numberEntry >= 0 ? true : false;
    }
}