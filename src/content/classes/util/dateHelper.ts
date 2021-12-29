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
        // hint: e.g. "2021-04-28T20:01:16.126Z" (ISO stringdates are valid dates)
        return moment(dateString).isValid();
    }

    static isDateBetweenGreaterThanAmountOfDays(dateOne: string, dateTwo: string, amountOfDays: number): boolean | undefined {
        if(amountOfDays <= 0){
            console.error(`The amount of days cannot be 0 or less`);
            return undefined;
        }
        return this.getAmountDaysBetweenDates(dateOne, dateTwo) !== undefined && <number>this.getAmountDaysBetweenDates(dateOne, dateTwo) > amountOfDays ? true : false;
    }

    static getAmountDaysBetweenDates(dateFormer: string, dateLater: string): number | undefined {
        if(!DateHelper.isValidDate(dateFormer) || !DateHelper.isValidDate(dateLater)){
            console.error(`Parameter dateOne: ${dateFormer} and/or dateTwo: ${dateLater} is not a valid date`);
            return undefined;
        }
        return moment.duration(moment(dateLater).diff(dateFormer)).asDays();
    }

    static getAmountMilisecondesBetweenDates(dateFormer: string, dateLater: string): number | undefined {
        if(!DateHelper.isValidDate(dateFormer) || !DateHelper.isValidDate(dateLater)){
            console.error(`Parameter dateOne: ${dateFormer} and/or dateTwo: ${dateLater} is not a valid date`);
            return undefined;
        }
        return moment.duration(moment(dateLater).diff(dateFormer)).asMilliseconds();
    }
}