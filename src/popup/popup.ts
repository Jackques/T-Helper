import $ from "jquery";
import { Tooltip as Tooltip, Toast as Toast, Popover as Popover } from 'bootstrap';
import csv from "csvtojson";

document.addEventListener('DOMContentLoaded', function () {
    const reader = new FileReader();
    const allowedFileTypes = ['.csv'];
    const requiredHeaders = ['Name','Job Title','Address','State','City', 'someNumber', 'AddedDateTime'];
    const requiredHeaders2 = [{'Name': 'string'}, {'Job Title': 'string'}, {'Address': 'string'}, {'State': 'string'}, {'City': 'string'}, {'someNumber': 'number'}, {'AddedDateTime': 'datetime'}, {'yesorno': 'boolean'}]
    //todo: Use requiredHeaders2 to refactor header & value checker functions (perhaps combine into 1 function?) & create CENTRAL logic/config for requiredDataFields (e.g. yesorno string to boolean, someNumber string to number, City string to city etc.) Maybe use seperate class for this?

    function onFileInputChange(evt:Event){
        if(!$('#warnText').hasClass('d-none')){
            $('#warnText').addClass('d-none');
        }
        const uploadedFile: File | undefined = getTargetFile(evt);
        //todo: check if name file is what we require.. (e.g. profile_Bob_09-11-2021_THelper.csv)
        if(uploadedFile && isValidFileType(uploadedFile)){
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
                return fileUpload.files[0];
            }

            
        }
    }

    function sendFileDataToContent(){
        console.log('Processing click');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs:chrome.tabs.Tab[]) {
            if(tabs.length > 0 && tabs[0].id){
                console.log('Sending message to content');
                chrome.tabs.sendMessage(tabs[0].id, {type:"Activate"}, function(response){
                    console.log('Do i need a callback?');
                });
            }
            
        });
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
                    delimiter: ','
                })
                .on('header',(headers:string[])=>{
                    hasCompatibleHeaders = ifCompatibleHeaders(headers);
                })
                .on('data',(data)=>{
                    //data is a buffer object
                    const jsonStr= data.toString('utf8');
                    hasCompatibleValues = ifCompatibleValues();
                    console.log('data ..something');
                    console.dir(jsonStr);

                    const test = JSON.parse(data);
                    //todo: also add; checker method to see if structure in file (headers & contents) matches MY DESIRED structure? if so, enable activate button!
                })
                .on('error',(err:Error)=>{
                    $('#warnText').text(`Error in CSVTOJSON Module. Check console log and try again (with a different file).`);
                    $('#warnText').removeClass('d-none');
                    console.error(`CSVTOJSON error: ${err.name} - ${err.message}`)
                    console.error(err);
                })

                //TODO: TRY TO FINISH THIS ANDDDDD SHOW HTML ELEMENTS WITH BOOTSTRAP ON SCREEN WITH CONTENT. IF THIS IS SUCCESFULL, YIPPIE! CAN EASILY FINISH THE REST (LATER THIS WEEK..)
                //TODO: DONT FORGET TOO COMMIT & PUSH & DOWNLOAD CODEBASE ON LAPTOP FOR WORKING IN TRAIN!
                .fromString(contents)
                .then(function(result){
                    if(!hasCompatibleHeaders && !hasCompatibleValues){
                        $('#warnText').text(`Headers in file do not match required headers. Required headers are: ${requiredHeaders.toString}`);
                        $('#warnText').removeClass('d-none');
                    }
                    console.log(result); //SUCCES! Send to content?
                    //todo: Create loader overlay?
                    //todo: prettify html & css
                })
    }
    //todo: create general error message method, if has error turn activate button red (alert-red), on every new file upload turn button original color (but disabled) on succes turn button green AND enabled

    function ifCompatibleHeaders(headers:string[]):boolean{
        return headers.every(header => requiredHeaders.find(requiredHeader => requiredHeader === header));
    }
    function ifCompatibleValues():boolean{
        //todo: need work, but refactor data structure logic first, check requiredHeaders2 comment.
        return true;
    }

    $('#activate').on('click', function () {
        sendFileDataToContent();
    });

    $('#inputGroupFile02').on('change', function(evt:Event){
        onFileInputChange(evt);
    });

    reader.onload = function() {
        convertFileContentToArray();
    };

    reader.onerror = function() {
        $('#warnText').text('Reading file error, check console log. Try again or with a different file');
        $('#warnText').removeClass('d-none');
        console.error(`Render error: ${reader.error}`);
    };
});
