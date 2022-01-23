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
            return dataRecord.getRecordPersonSystemId(appType) === systemId;
        });
    }

    public addNewDataRecord(dataRecord: DataRecord): boolean {

        // if dataRecord has no (valid) number, assign a number by the current count for this table
        if(!dataRecord.getNoDataRecord()){
            dataRecord.setNoDataRecord(this.dataRecordAmount+1);
            this.incrementRecordAmount();
        }else{
            if(<number>dataRecord.getNoDataRecord() !== (this.dataRecordAmount+1)){
                console.error(`Invalid data record number: ${dataRecord.getNoDataRecord()} for record: ${dataRecord}. Data record number must be incremented from the current data record amount: ${this.dataRecordAmount}`);
                return false;
            }
            // if dataRecord has a number, number must be incrementable from start of app
        }
        
        this.dataRecords.push(dataRecord);
        return true;
    }

    private incrementRecordAmount(): void {
        this.dataRecordAmount = this.dataRecordAmount + 1;
    }

    public updateDataRecordByIndex(index:number, dataRecord: DataRecordValues[]):void {
        this.dataRecords[index].addDataToDataFields(dataRecord);
    }
}