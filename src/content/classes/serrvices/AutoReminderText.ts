import { RandomNumber } from "../util/randomNumber";

export class AutoReminderText {
    private textMessage = "";

    constructor(textMessage: string) {
        this.textMessage = textMessage;
    }

    public getTextMessage(): string {
        return this.addRandomCharacters(this.textMessage);
    }

    private addRandomCharacters(textMessage: string): string {
        const minAmountWhitespaces = 2;

        // capitalize a random letter once
        if (RandomNumber.getRandomBoolean()) {
            const textMessageWordsList = textMessage.split(" ");
            const randomWordListNo = RandomNumber.getRandomNumber(0, textMessageWordsList.length - 1);
            textMessageWordsList[randomWordListNo] = textMessageWordsList[randomWordListNo].replace(/\b\w/g, text => text.toUpperCase());
            textMessage = textMessageWordsList.join(" ");
        }

        // few extra dots at the end is always appliable? ..
        if (RandomNumber.getRandomBoolean()) {
            textMessage = textMessage + ".";
            if (RandomNumber.getRandomBoolean()) {
                textMessage = textMessage + ".";
            }
        }
        // add some extra whitespace at the beginning and/or end? 
        if (RandomNumber.getRandomBoolean()) {
            textMessage = " " + textMessage + " ";
        }
        // add (1-2) extra whitespace in between random words
        if (RandomNumber.getRandomBoolean()) {
            const textMessageWordsList = textMessage.split(" ");
            const randomNumberOne = RandomNumber.getRandomNumber(0, textMessageWordsList.length - 1);
            textMessageWordsList[randomNumberOne] = textMessageWordsList[randomNumberOne] + " ";

            if (textMessageWordsList.length - 1 <= minAmountWhitespaces) {
                const randomNumberTwo = RandomNumber.getRandomNumber(0, textMessageWordsList.length - 1);
                textMessageWordsList[randomNumberTwo] = textMessageWordsList[randomNumberTwo] + " ";
            }
            textMessage = textMessageWordsList.join(" ");
        }

        // remove a random whitespace somewhere?
        return textMessage;
    }
}
