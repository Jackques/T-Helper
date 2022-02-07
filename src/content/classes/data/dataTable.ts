import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataField } from "./dataField";
import { DataRecord } from "./dataRecord";

export class dataTable {

    private dataRecords: DataRecord[] = [];
    private dataRecordAmount = 0;

    public getDataFieldsByRecordIndex(index: number): DataField[] {
        return this.dataRecords[index].getDataFields(true);
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
}