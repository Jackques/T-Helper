import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataRecord } from "./dataRecord";

export class dataTable {
    
    private dataRecords: DataRecord[] = [];

    public getRecordIndexBySystemId(systemId: string, appType: string):number {
        return this.dataRecords.findIndex((dataRecord: DataRecord)=>{
            //todo:  CONTINUE INPLEMENTING HERE
            // console.log('DATA RECORD: ');
            // console.log(dataRecord.getRecordPersonSystemId(appType));

            return dataRecord.getRecordPersonSystemId(appType) === systemId
        });
    }

    public addNewDataRecord(dataRecord: DataRecordValues[]): boolean {
        const newDataRecord = new DataRecord();
        const isNewDataRecordValid = newDataRecord.addDataToDataFields(dataRecord);

        if(isNewDataRecordValid){
            this.dataRecords.push(newDataRecord);
            return true;
        }

        console.error('Failed to add data');
        return false;
    }

    public updateDataRecordByIndex(index:number, dataRecord: DataRecordValues[]){
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
