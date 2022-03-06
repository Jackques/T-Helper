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

    public addNewDataRecord(dataRecord: DataRecord): boolean {

        // if dataRecord has no number, assign a number by the current (incremented) count for this table & add record
        const currentRecordNo: number | null = dataRecord.getNoDataRecord();
        if (currentRecordNo === null) {
            dataRecord.setNoDataRecord(this.dataRecordAmount + 1);
            this.dataRecords.push(dataRecord);
            this.incrementRecordAmount();
            return true;
        }

        // if dataRecord has an invalid number, log error
        if (currentRecordNo !== (this.dataRecordAmount + 1)) {
            console.error(`Invalid data record number: ${dataRecord.getNoDataRecord()} for record: ${dataRecord}. Data record number must be incremented from the current data record amount: ${this.dataRecordAmount}`);
            return false;
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

}