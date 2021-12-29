import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataRecord } from "./dataRecord";

export class dataTable {
    
    private dataRecords: DataRecord[] = [];
    private dataRecordAmount = 0;

    public getAllowedFieldsByRecordIndex(index: number): DataFieldTypes[] {
        return this.dataRecords[index].getDataFieldTypes(true);
    }

    public getRecordIndexBySystemId(systemId: string, appType: string):number {
        return this.dataRecords.findIndex((dataRecord: DataRecord)=>{
            // console.log('DATA RECORD: ');
            // console.log(dataRecord.getRecordPersonSystemId(appType));

            return dataRecord.getRecordPersonSystemId(appType) === systemId;
        });
    }

    public addNewDataRecord(dataRecord: DataRecordValues[]): boolean {
        const newDataRecord = new DataRecord();
        const isNewDataRecordValid = newDataRecord.addDataToDataFields(dataRecord);

        const newDataRecordNumberValue: DataRecordValues | undefined = dataRecord.find((dataRecord)=>{
            return dataRecord.label === 'No'
        });

        if(newDataRecordNumberValue?.value){
            // data record no is truthy, thus needs to be checked if the number does not already exist
            // if so, throw error
            if(<number>newDataRecordNumberValue?.value <= this.dataRecordAmount){
                console.error(`Data record with no: ${newDataRecordNumberValue?.value} already exists. New record not added.`);
                return false;
            }
            // if not, replace the current number with the number provided by this new row.
            this.dataRecordAmount = <number>newDataRecordNumberValue?.value
            
        }else{
            // if provided number is falsy, update auto incremented number from this.dataRecordAmount
            this.dataRecordAmount = this.dataRecordAmount+1;
            newDataRecord.addDataToDataFields([{
                label: 'No',
                value: this.dataRecordAmount
            }]);
        }

        if(isNewDataRecordValid){
            this.dataRecords.push(newDataRecord);
            return true;
        }

        console.error('Failed to add data');
        return false;
    }

    public updateDataRecordByIndex(index:number, dataRecord: DataRecordValues[]):void {
        this.dataRecords[index].addDataToDataFields(dataRecord);
    }
}

/* 
{
    "No": 1,
    "Date-liked": "09-04-2021",
    "Name": "Testname",
    "Age": 32,
    "Has-profiletext": true,
    "Has-usefull-profiletext": true,
    "Is-verified": true,
    "Attractiveness-score": 8,
    "Is-match": true,
    "Date-match": "09-04-2021",
    "Match-sent-first-message": false,
    "Match-responded": true,
    "Conversation-exists": true,
    "Vibe-conversation": 3,
    "How-many-ghosts": [
        {
            "number": 0,
            "timeSinceLastMessageMS": 600,
            "status": "ongoing"
        },
        {
            "number": 1,
            "timeSinceLastMessageMS": 700,
            "status": "replied"
        },
        {
            "number": 2,
            "timeSinceLastMessageMS": 800,
            "status": "block"
        }
    ],
    "Acquired-number": true,
    "Response-speed": [
        {
            "datetimeMyLastMessage": "09-10-21",
            "datetimeTheirResponse": "10-10-21"
        },
        {
            "datetimeMyLastMessage": "09-10-20",
            "datetimeTheirResponse": "10-10-20"
        }
    ],
    "Reminders-amount": [
        {
            "datetimeMyLastMessage": "25-11-21",
            "datetimeReminderSent": "28-11-21",
            "textContentReminder": "Leef je nog?",
            "hasGottenReply": false
        }
    ],
    "Blocked-or-no-contact": false,
    "Interested-in-sex": false,
    "Potential-click": true,
    "Notes": "any notes go here"
}
*/
