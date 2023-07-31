import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataField } from "./dataField";
import { DataRecord } from "./dataRecord";

export class DataTable {

    private dataRecords: DataRecord[] = [];
    private dataRecordAmount = 0;

    public getDataFieldsByRecordIndex(index: number): DataField[] {
        // fixed 'bug' that some fields were not returned for updating a record, this was due to the fact i tried to inplement a sortoff
        // update or not allowed to update system. However the logic for this is a bit fuzzy and should be for a future date.

        //todo: determine if i want to update or not certain fields, and set logic for this CORRECTLY
        return this.dataRecords[index].getDataFields();
    }

    //todo: refactor to get record directly? 
    public getRecordIndexBySystemId(systemId: string, appType: string): number {
        return this.dataRecords.findIndex((dataRecord: DataRecord) => {
            return dataRecord.getRecordPersonSystemId(appType) === systemId;
        });
    }

    public getRecordByRecordIndex(index: number): DataRecord | null {
        if (index >= 0 && index <= this.dataRecords.length) {
            return this.dataRecords[index];
        }
        console.error('Data record not found. Please use a different number');
        return null;
    }

    public addNewDataRecord(dataRecord: DataRecord, appType: string): boolean {
        const systemId = dataRecord.getRecordPersonSystemId(appType);
        if(!systemId){
            console.warn(`Could not get systemId from dataRecord. Result of systemid is: ${systemId}, dataRecord: ${dataRecord}`);
            return false;
        }
        // Update dataTable doubles; 
        // if record already exists with the same personId/matchid; 
        // choose the one with newer lastUpdated date
        const indexExistingRecord = this.getRecordIndexBySystemId(systemId, appType);
        if(indexExistingRecord !== -1){
            console.warn(`A record with the same system person id already exists in the dataTable. Record systemid: ${systemId.length > 0 ? systemId : 'EMPTY STRING'}, indexExistingRecord: ${indexExistingRecord}`);
            const existingRecordLastUpdated = this.dataRecords[indexExistingRecord].getValueLastUpdated();
            const newRecordLastUpdated = dataRecord.getValueLastUpdated();

            if(new Date(newRecordLastUpdated).getTime() > new Date(existingRecordLastUpdated).getTime()){
                // add the newer data record (simply continue with the existing process)
                // remove the old data record
                console.warn(`Inserted the newly imported dataRecord into the dataTable and removed the old one.`);
                this.dataRecords.splice(indexExistingRecord, 1);
            }else{
                console.warn(`Did not add the newly imported dataRecord into the dataTable and kept the existing record.`);
                return false;
            }
        }

        // if dataRecord has no number, assign a number by the current (incremented) count for this table & add record
        const currentRecordNo: number | null = dataRecord.getNoDataRecord();
        if (currentRecordNo === null || currentRecordNo !== (this.dataRecordAmount + 1)) {

            // if dataRecord has an invalid number, show warn
            if (currentRecordNo !== (this.dataRecordAmount + 1)) {
                console.info(`Invalid data record number: ${dataRecord.getNoDataRecord()} for record: ${dataRecord}. Data record will be provided with a new number, incremented from the current data record amount: ${this.dataRecordAmount}`);
            }

            dataRecord.setNoDataRecord(this.dataRecordAmount + 1);
            this.dataRecords.push(dataRecord);
            this.incrementRecordAmount();
            return true;
        }

        // if dataRecord has a number, number must be incrementable from start of app
        this.dataRecords.push(dataRecord);
        this.incrementRecordAmount();
        return true;
    }

    private incrementRecordAmount(): void {
        this.dataRecordAmount = this.dataRecordAmount + 1;
    }

    public updateDataRecordByIndex(index: number, dataRecord: DataRecordValues[]): void {
        this.dataRecords[index].addDataToDataFields(dataRecord);
    }

    public getAllDataRecords(): DataRecord[] {
        return this.dataRecords;
    }

    public getAllDataRecordsWhereMessageNeedTobeUpdated(): DataRecord[] {
        return this.dataRecords.filter((dataRecord) => {
            if (dataRecord.isNeedFieldMessagesBeUpdated()) {
                return dataRecord;
            }
        })
    }

    public getRecordValuesObject(appType: string): string {
       const valuesDataRecords: Record<string, string | unknown>[] = this.dataRecords.map((dataRecord: DataRecord)=>{
            return dataRecord.getRecordValueObject(appType);
       }); 
       return JSON.stringify(valuesDataRecords);
    }

    public emptyDataTable(): void {
        this.dataRecords.length = 0;
        this.dataRecordAmount = 0;
    }

}