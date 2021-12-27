import moment from 'moment';

export class DateHelper {
    static getAgeFromBirthDate(birthdate: string): number{
        if(DateHelper.isValidDate(birthdate)){
            return moment.duration(moment(new Date).diff(birthdate)).asYears();
        }
        console.error('Invalid date string');
        return -1;
    }

    static isValidDate(dateString: string): boolean {
        return moment(dateString).isValid();
    }
}