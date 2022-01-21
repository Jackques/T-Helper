import $ from "jquery";
import csv from "csvtojson";
import { DataRecord } from '../content/classes/data/dataRecord';
import { PropertiesChecker } from "../content/classes/util/PropertiesChecker";
import { PortMessage } from "src/content/interfaces/portMessage.interface";
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";

document.addEventListener('DOMContentLoaded', function () {
    const reader = new FileReader();
    const allowedFileTypes: string[] = ['.csv'];
    const propertiesChecker:PropertiesChecker = new PropertiesChecker();

    // eslint-disable-next-line @typescript-eslint/ban-types
    const dataFieldTypes:DataFieldTypes[] = new DataRecord().getDataFieldTypes();
    const requiredHeadersList: string[] = dataFieldTypes.map((header) => header.label);

    // let inputData: Record<string, string | number | boolean | null | Record<string, string | number | boolean>> = null;
    let inputDataList: DataRecordValues[][] | null = null;

    function onFileInputChange(evt:Event){
        $('#warnText').hide();
        $('#succesText').hide();

        $('#activate').prop('disabled', true);
        inputDataList = null;

        const uploadedFile: File | undefined = getTargetFile(evt);
        if(uploadedFile && isValidFileType(uploadedFile)){
            console.log('uploaded file: ');
            console.dir(uploadedFile);
            reader.readAsText(uploadedFile);
        }
    }

    function isValidFileType(file: File): boolean {
        let extension:string | undefined = file.name && file.name.split('.').length ? file.name.split('.').pop() : '';
        
        if(extension && extension.length){
            extension = extension?.padStart(extension.length+1, '.');

            const isValidExtension = allowedFileTypes.some((allowedFileType)=>{
                return allowedFileType === extension
            });

            if(isValidExtension){
                return true;
            }
        }
        $('#warnText').text(`Unrecognized or unallowed file type, try again with a different file. Allowed file types: ${allowedFileTypes.toString()}`);
        $('#warnText').removeClass('d-none');
        return false;
    }

    function getTargetFile(evt:Event):File | undefined {
        let fileUpload: HTMLInputElement | null = null;
        if(evt && evt.currentTarget){
            // cast currentTarget as a HTMLInputElement instead of EventTarget as files is a property of input element
            fileUpload = <HTMLInputElement>evt.currentTarget;

            if(fileUpload.files){
                if(fileUpload.files.length > 1){
                    $('#warnText').text('No more than 1 file upload allowed, try again');
                    $('#warnText').removeClass('d-none');
                    return;
                }
                console.log('fileUpload file: ');
                console.dir(fileUpload.files[0]);
                return fileUpload.files[0];
            }

            
        }
    }

    function sendFileDataToContent(){
        if(!inputDataList){
            console.error('inputData is not set');
            return;
        }
        console.log('Processing click');

        // eslint-disable-next-line @typescript-eslint/ban-types
        function getCurrentTabId(cb: Function) {
            const query = {active: true, currentWindow: true};
            chrome.tabs.query(query, function (tabArray: chrome.tabs.Tab[]) {
                console.log("Tab id is: " + tabArray[0].id);
                cb(tabArray[0].id); 
                //todo: temporarily solution: this should be refactored to something like a promise in the future
                //todo: the reason I set up like this is because chrome.tabs.query returns asynchronously! https://stackoverflow.com/questions/48089389/invocation-of-form-tabs-connectundefined-object-doesnt-match-definition

                //todo: also get tabid before even loading the .json/.csv
                //todo: show error in popup html is tab is not tinder/happn/opther recognized datingapp
                //todo: show error in popup html if port is disconnected (e.g. when navigating away from the tinder tab)
            });
        }
        
        function connectToCurrentTab () {
            getCurrentTabId(function(currentTabId:number) {
                const port = chrome.tabs.connect(currentTabId, <chrome.runtime.Port>{name: "knockknock"});
                port.postMessage(<PortMessage>{'messageSender': 'POPUP', 'action': 'INIT', 'payload': inputDataList});
                // port.onMessage.addListener(function(msg) {
                //     console.log('I am not expecting a message back?');
                //     console.log(msg);
                // });
            });
        }
        connectToCurrentTab();
    }

    function convertFileContentToArray(){
                const contents: string | undefined = reader.result?.toString();
                let hasCompatibleHeaders = false;
                let hasCompatibleValues = false;

                if(!contents){
                    $('#warnText').text('No empty files allowed, try again');
                    $('#warnText').removeClass('d-none');
                    return;
                }
                csv({
                    output: 'json',
                    delimiter: ',',
                    checkType: true // required to get actual numbers/booleans instead of string representations of numbers/booleans (e.g. '8'/'false')
                })
                .on('header',(headers:string[])=>{
                    console.log('headers are: ');
                    console.dir(headers);

                    const filteredHeaders: string[] = filterNestedHeaders(headers);

                    hasCompatibleHeaders = ifCompatibleHeaders(filteredHeaders, requiredHeadersList);
                    console.log(`has compatible headers: ${hasCompatibleHeaders}`);

                    const excessHeaders = getExcessHeaders(filteredHeaders, requiredHeadersList);
                    if(excessHeaders.length > 0){
                        console.warn(`File has more headers than expected: ${excessHeaders}`);
                    }
                })
                .on('data',(dataRecord:Uint8Array)=>{
                    //data is a buffer object
                    const parsedRecord:Record<string, unknown> = JSON.parse(dataRecord.toString());
                    console.log('parsedRecord: ');
                    console.dir(parsedRecord);
                    hasCompatibleValues = ifCompatibleValues(parsedRecord);
                    console.log(`has compatible label & values: ${hasCompatibleValues}`);
                })
                .on('error',(err:Error)=>{
                    $('#warnText').text(`Error in CSVTOJSON Module. Check console log and try again (with a different file).`);
                    $('#warnText').removeClass('d-none');
                    console.error(`CSVTOJSON error: ${err.name} - ${err.message}`)
                    console.error(err);
                })
                .fromString(contents)
                .then(function(result:any[]){
                    if(hasCompatibleHeaders && hasCompatibleValues){
                        console.log(`Result succes: `); 
                        console.dir(result);
                        inputDataList = mapResultsArrayToresultDataRecordValues(result);
                        $('#succesText').text('Headers, labels and values are valid.').removeClass('d-none');
                        $('#activate').attr('disabled', null);
                    }else{
                        $('#warnText').text(`Headers in file do not match required headers. Required headers are: ${requiredHeadersList.toString}`);
                        $('#warnText').removeClass('d-none');
                    }

                    //todo: EXTRA prettify code for setting the inputData
                    //todo: EXTRA Create loader overlay? (progress bar of sorts)
                    //todo: EXTRA prettify html & css
                    //todo: check if name file is what we require.. (e.g. profile_Bob_09-11-2021_THelper.csv)
                    //todo: EXTRA create general error message method, if has error turn activate button red (alert-red), on every new file upload turn button original color (but disabled) on succes turn button green AND enabled
                    //todo: EXTRA add feature to generate new empty .csv file for new profile
                    //todo: EXTRA SECURITY; titles dataField should not contain dots!
                })
    }

    function filterNestedHeaders(headers: string[]):string[]{
        const nestedHeaders:string[] = [];
        let filteredHeaders:string[] = headers.filter((header:string)=>{
            // does this header have a dot in the text?
            const indexDotInHeader:number = header.indexOf('.');
            if(indexDotInHeader !== -1){
                const baseHeader = header.substr(0,indexDotInHeader);
                // is this header already present in the array of nestedHeaders?
                if(nestedHeaders.findIndex((header)=> header === baseHeader) === -1){
                    // if not; add and return false (since we do not want to include this header in filtered headers just yet)
                    nestedHeaders.push(baseHeader);
                    return false;
                }else{
                    // if yes, skip this and return false
                    return false;
                }
            }
            return true;
            //it does not? return true.. this is a filtered header
        }, headers);
        filteredHeaders = filteredHeaders.concat(nestedHeaders);
        return filteredHeaders;
    }
    
    function getExcessHeaders(headers: string[], requiredHeadersList: string[]):string[]{
        propertiesChecker.setPropertiesList(headers);
        requiredHeadersList.forEach((requiredHeader) => {
            propertiesChecker.checkPropertyOnce(requiredHeader);
        });
        const remainingProperties: string[] = propertiesChecker.getPropertiesList();
        propertiesChecker.clearPropertiesList();
        return remainingProperties;
    }

    function ifCompatibleHeaders(headers:string[], requiredHeadersList:string[]):boolean{
        return requiredHeadersList.every((requiredHeader)=>{
            if(headers.find((header)=> header === requiredHeader)){
                return true;
            }
            return false;
        });
    }

    function ifCompatibleValues(record:Record<string, unknown>):boolean{
        let hasValidLabels = false;
        let hasValidValues = false;

        console.log(`My recordEntries are: `);
        console.dir(record);

        //check for each label if the provided value(s) are valid
        // hasValidLabels = dataFieldTypes.every((dataFieldType)=>{
        //     if(!Object.keys(record).includes(dataFieldType.label)){
        //         console.error(`A record is missing one or more labels. Missing label: ${ dataFieldType.label }, record: ${ record.toString().substr(0, 25) }`);
        //         return false;
        //     }
        //     return true;
        // });
        hasValidLabels = _hasValidLabels(record);

        if(!hasValidLabels){
            return false;
        }

        //todo: if not provide a message detailing the difference and expectation
        // hasValidValues = dataFieldTypes.every((dataFieldType)=>{
        //     const recordWithPropertyDescriptors = Object.getOwnPropertyDescriptors(record);
        //     const uncheckedListKeys = Object.keys(recordWithPropertyDescriptors);
        //     let result = false;

        //     //todo: what if value is null/undefined/empty string?
        //     result = dataFieldType.checkDataMethod(recordWithPropertyDescriptors[dataFieldType.label].value);
        //     if(result){
        //         uncheckedListKeys.filter((value) => value !== dataFieldType.label);
        //     }
            
        //     return result;
        // });
        hasValidValues = _hasValidValues(record);
        
        //todo: provide logic to give a warning if there are extra records/headers which are not accounted for
        console.log(`thus.. hasValidLabels is: ${hasValidLabels} and hasValidValues is: ${hasValidValues}`);
        return hasValidLabels && hasValidValues ? true : false;
    }

    function _hasValidLabels(record:Record<string, unknown>){
        return dataFieldTypes.every((dataFieldType)=>{
            if(!Object.keys(record).includes(dataFieldType.label)){
                console.error(`A record is missing one or more labels. Missing label: ${ dataFieldType.label }, record: ${ record.toString().substr(0, 25) }`);
                console.log(record)
                return false;
            }
            return true;
        });
    }

    function _hasValidValues(record:Record<string, unknown>){
        return dataFieldTypes.every((dataFieldType)=>{
            const recordWithPropertyDescriptors = Object.getOwnPropertyDescriptors(record);
            const uncheckedListKeys = Object.keys(recordWithPropertyDescriptors);
            let result = false;

            result = dataFieldType.checkDataMethod(recordWithPropertyDescriptors[dataFieldType.label].value);
            if(result){
                uncheckedListKeys.filter((value) => value !== dataFieldType.label);
            }
            
            return result;
        });
    }

    // todo: should probably want to refactor this since popup shouldn't be concerned with interal app data such as DataRecordValues
    function mapResultsArrayToresultDataRecordValues(resultsArray: any[]):DataRecordValues[][]{
        return resultsArray.map((result)=>{
            const newArray = [];
            for (const property in result) {
                 newArray.push({
                     'label': String(property),
                     'value': <unknown>result[property]
                    });
              }
            return newArray
        });
    }

    $('#activate').on('click', function () {
        sendFileDataToContent();
    });

    $('#inputGroupFile02').on('change', function(evt:Event){
        onFileInputChange(evt);
    });

    // this works below; you need to always have a wrapper container (<body> probably works too) in which you can reference the DOM element for e.g. a click event;
    // $(document).on("click", '#testing button', function (evt) {
    //     console.log('this works! 2');
    //     alert('this works! 2');
    //     console.dir($('#exampleFormControlInput1').val())
    // });

    reader.onload = function() {
        convertFileContentToArray();
    };

    reader.onerror = function() {
        $('#warnText').text('Reading file error, check console log. Try again or with a different file');
        $('#warnText').removeClass('d-none');
        console.error(`Render error: ${reader.error}`);
    };
});
