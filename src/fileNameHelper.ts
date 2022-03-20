import * as moment from 'moment';
import 'moment/locale/nl';

moment.locale('nl');

export class FileHelper {
    private fileName = '';
    private allowedFileTypes: string[] = ['.csv', '.json']; // Disabled .csv as supported file format because it turns out nesting (compplex) objects in .csv is hard to read/maintain. .json is much easier to read for some quick excel editing.
    // private allowedFileTypes: string[] = ['.json'];
    private fileErrorsList: string[] = [];
    public fileType = '';

    constructor(file: File | string) {
        let fileName: string;

        if (file instanceof File) {
            if (file.size === 0) {
                this.addFileErrorToList(`File contents cannot be empty. New profiles must at least contain an empty array "[]"`);
                return;
            }
            fileName = file.name;

        } else {
            fileName = file;
        }

        if (fileName.length === 0) {
            this.addFileErrorToList(`Filename cannot be empty. Please update your filename`);
            console.error(`Filename cannot be empty. Please check the filename of the imported file.`);
            return;
        }

        this.clearFileErrorList();

        this.setFileType(fileName);
        if (this.isValidFileType() && this.isValidFileName(fileName)) {
            console.log('uploaded file: ');
            console.dir(file);

            this.fileName = fileName;
        }
    }

    private setFileType(fileName: string): void {
        const extension: string | undefined = fileName && fileName.split('.').length ? fileName.split('.').pop() : '';
        if (extension && extension.length > 0) {
            this.fileType = extension?.padStart(extension.length + 1, '.');
        }else{
            this.addFileErrorToList(`Could not get extension from uploaded file. Please check the file name & file extension.`);
            console.error(`Could not get extension from uploaded file. Please check the file name & file extension.`);
        }
    }

    public getFileName(): string {
        return this.fileName;
    }

    private isValidFileType(): boolean {
        if (this.fileType.length === 0) {
            return false;
        }

        const isValidExtension = this.allowedFileTypes.some((allowedFileType) => {
            return allowedFileType === this.fileType;
        });

        if (isValidExtension) {
            return true;
        }
        this.addFileErrorToList(`Unrecognized or unallowed file type, try again with a different file. Allowed file types: ${this.allowedFileTypes.toString()}`);
        return false;
    }

    private isValidFileName(uploadedFileName: string): boolean {

        if (!uploadedFileName.includes('_')) {
            this.addFileErrorToList(`Invalid filename. Please make sure that the uploaded filename is of the following structure: "Profile_profilename_datetime" e.g: "Profile_Jack_15-03-2022--23-59-59.json"`);
            return false;
        }

        const splitFileName: string[] = uploadedFileName.split('_');

        let hasProfilePrefix = false;
        let hasName = false;
        let datetime = false;

        if (splitFileName.length === 3) {

            const extensionDotPosition: number = splitFileName[2].lastIndexOf('.');
            splitFileName[2] = splitFileName[2].slice(0, extensionDotPosition);

            hasProfilePrefix = splitFileName[0] === 'Profile' ? true : false;
            hasName = splitFileName[1].length > 0 ? true : false;
            datetime = this.checkFileDateTimeIsValid(splitFileName[2]);
        }

        if (!hasProfilePrefix) {
            this.addFileErrorToList(`Incorrect profile prefix. The profile prefix must be "Profile"`);
        }
        if (!hasName) {
            this.addFileErrorToList(`Incorrect profile name. Please provide a name`);
        }
        if (!datetime) {
            this.addFileErrorToList(`Incorrect profile datetime. Please provide the datetime in the following format: "'DD-MM-YYY--HH-mm-ss'", e.g: "15-03-2022--23-59-59" and ensure the datetime is valid`);
        }

        return hasProfilePrefix && hasName && datetime;
    }

    private checkFileDateTimeIsValid(datetimeFromFileName: string): boolean {
        const date: string[] = datetimeFromFileName.split('--');
        date[1] = date[1].replaceAll('-', ':');

        return moment.default(date.join(' '), 'DD-MM-YYYY HH:mm:ss', true).isValid();
    }

    public getUpdateFileName(): string {
        const splitFileName: string[] = this.fileName.split('_');
        const datetimeWithExtension = splitFileName.pop();
        const currentDateTimeForFileName = moment.default().format('DD-MM-YYYY--HH-mm-ss');
        let extension: string;

        if (datetimeWithExtension) {
            const extensionDotPosition: number = datetimeWithExtension.lastIndexOf('.');
            extension = datetimeWithExtension.slice(extensionDotPosition);
            splitFileName.push(currentDateTimeForFileName);

            return splitFileName.join('_') + extension;

        } else {
            console.error(`Filename is incorrect. Please update the filename. Returning a generic filename!`);
            return `Profile_Testname_${currentDateTimeForFileName}.json`;
        }
    }

    public hasFileErrors(): boolean {
        return this.fileErrorsList.length > 0 ? true : false;
    }

    public getFileErrors(): string[] {
        return this.fileErrorsList;
    }

    private addFileErrorToList(fileErrorMessage: string): void {
        this.fileErrorsList.push(fileErrorMessage);
    }

    private clearFileErrorList(): void {
        this.fileErrorsList.length = 0;
    }

}