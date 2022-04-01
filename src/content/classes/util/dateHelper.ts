import moment from 'moment';
import { Message } from 'src/message.interface';

export class DateHelper {
    static isDateLaterThanDate(firstDateTime: string, secondDateTime: string): boolean {
        const differenceBetweenDates = moment(firstDateTime).diff(secondDateTime);
        return differenceBetweenDates > 0 ? true : false;
    }
    static getAgeFromBirthDate(birthdate: string): number{
        if(DateHelper.isValidDate(birthdate)){
            return moment.duration(moment(new Date).diff(birthdate)).asYears();
        }
        console.error('Invalid date string');
        return -1;
    }

    static isValidDate(dateString: string): boolean {
        // hint: e.g. "2021-04-28T20:01:16.126Z" (ISO stringdates are valid dates)
        if(moment(dateString).isValid()){
            return true;
        }else{
            console.error(`Datestring: ${dateString} is not a valid datetime string`);
            return false;
        }
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

export class DateHelperTimeStamp {
    static isDateBetweenGreaterThanAmountOfDays(dateOne: number, dateTwo: number, amountOfDays: number): boolean | null {
        if(amountOfDays <= 0){
            console.error(`The amount of days cannot be 0 or less`);
            return null;
        }

        const miliSecondsInDay = 86400000;
        const amountOfDaysInMS = amountOfDays * 86400000;

        //todo: why can't i type this shorthand without type converting it to a number?
        return this.getAmountDaysBetweenDates(dateOne, dateTwo) !== null && <number>this.getAmountDaysBetweenDates(dateOne, dateTwo) >= amountOfDays ? true : false;
    }

    static getAmountDaysBetweenDates(dateFormer: number, dateLater: number): number | null {
        if(!DateHelperTimeStamp.isValidDate(dateFormer) || !DateHelperTimeStamp.isValidDate(dateLater)){
            console.error(`Parameter dateOne: ${dateFormer} and/or dateTwo: ${dateLater} is not a valid date`);
            return null;
        }
        // return moment.duration(moment(dateLater).diff(dateFormer)).asDays();

        const miliSecondsInDay = 86400000;
        return (dateLater - dateFormer)/(miliSecondsInDay);
    }

    static isValidDate(dateTimeStampNumber: number): boolean {
        // timestamp 0 is 1-1-1970 01:00:00. Any number below that is in the future thus is invalid
        return dateTimeStampNumber > 0 ? true : false;
    }
}