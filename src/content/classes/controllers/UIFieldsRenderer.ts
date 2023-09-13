import { TemplateSetting } from "src/content/interfaces/controllers/templateSetting.interface";
import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataField, UIRequiredType } from "../data/dataField";
import { SubmitType } from "../../../SubmitType";
import { ScreenNavStateComboTinder } from "../util/Screen/screenStateComboTinder.enum";
import { DOMHelper } from "../util/DOMHelper";
import { DOMRefs } from "src/content/interfaces/data/domReferences.interface";
import { ScreenController } from "../util/Screen/ScreenList";
import { ConsoleColorLog } from "../util/ConsoleColorLog/ConsoleColorLog";
import { LogColors } from "../util/ConsoleColorLog/LogColors";

export class UIFieldsRenderer {
    private decoratedSubmitEventsDOMElementsList: HTMLElement[] = [];
    private templatesList: TemplateSetting[] = [
        {
            name: 'sliderBootstrap',
            label: UIRequiredType.SLIDER,
            getValueMethod: (htmlElement: HTMLInputElement | HTMLSelectElement): number => {
                if(htmlElement && htmlElement.tagName === 'INPUT'){
                    htmlElement = htmlElement as HTMLInputElement;
                    return htmlElement.valueAsNumber;
                }
                console.error(`Event target nog set`);
                return NaN;
            },
            template: (id:string, label:string, dataType:string, defaultValue: string | number | boolean | null): string => {
                defaultValue = defaultValue === null || defaultValue === undefined ? '' : defaultValue;
                return `
                <div class="fieldContainer fieldContainer--slider">
                    <label for="${id}" class="form-label">${label}</label>
                    <input type="range" class="form-range" min="1" max="10" step="1" id="${id}" value="${defaultValue}" data-type="${dataType}" data-templatename="sliderBootstrap" data-recordref="${label}">
                    <div class="rangeNumberDisplayContainer">
                        <div class="rangeNumberDisplay">1</div>
                        <div class="rangeNumberDisplay">2</div>
                        <div class="rangeNumberDisplay">3</div>
                        <div class="rangeNumberDisplay">4</div>
                        <div class="rangeNumberDisplay">5</div>
                        <div class="rangeNumberDisplay">6</div>
                        <div class="rangeNumberDisplay">7</div>
                        <div class="rangeNumberDisplay">8</div>
                        <div class="rangeNumberDisplay">9</div>
                        <div class="rangeNumberDisplay">10</div>
                    </div>
                </div>`
            },
        },
        {
            name: 'switchBootstrap',
            label: UIRequiredType.SWITCH,
            getValueMethod: (htmlElement: HTMLInputElement | HTMLSelectElement): boolean => {
                if(htmlElement && htmlElement.tagName === 'INPUT'){
                    htmlElement = htmlElement as HTMLInputElement;
                    return htmlElement.checked ? true : false;
                }
                console.error(`Event target not (correctly) set`);
                return false;
            },
            template: (id:string, label:string, dataType:string, defaultValue: string | number | boolean | null):string => { 
                defaultValue = defaultValue === null || defaultValue === undefined ? false : defaultValue;
                return `
                <div class="fieldContainer fieldContainer--switch">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="${id}" ${defaultValue ? 'checked' : ''} data-type="${dataType}" data-templatename="switchBootstrap" data-recordref="${label}">
                        <label class="form-check-label" for="flexSwitchCheckDefault">${label}</label>
                    </div>
                </div>`}
        },
        {
            name: 'inputBootstrap',
            label: UIRequiredType.ALPHANUMERIC_INPUT,
            getValueMethod: (htmlElement:HTMLInputElement | HTMLSelectElement): string => {
                if(htmlElement && htmlElement.tagName === 'INPUT'){
                    htmlElement = htmlElement as HTMLInputElement;
                    return htmlElement.value;
                }
                console.error(`Event target not set`);
                return '';
            },
            template: (id:string, label:string, dataType:string, defaultValue: string | number | boolean | null):string => {
                defaultValue = defaultValue === null || defaultValue === undefined ? '' : defaultValue; 
                return `
                <div class="fieldContainer fieldContainer--input">
                    <div class="input-group mb-12">
                        <input id="${id}" value="${defaultValue}" data-type="${dataType}" data-templatename="inputBootstrap" type="text" class="form-control" placeholder="${label}" aria-recordref="${label}" data-recordref="${label}" aria-describedby="basic-addon1">
                    </div>
                </div>`}
        },
        {
            name: 'inputBootstrapNumeric',
            label: UIRequiredType.NUMERIC_INPUT,
            getValueMethod: (htmlElement:HTMLInputElement | HTMLSelectElement): number => {
                if(htmlElement && htmlElement.tagName === 'INPUT'){
                    htmlElement = htmlElement as HTMLInputElement;
                    if(isNaN(parseInt(htmlElement.value))){
                        console.error(`Inserted value: ${htmlElement.value} cannot be converted to a number. please check the input.`);
                    }
                    return htmlElement.valueAsNumber;
                }
                console.error(`Event target not set`);
                return NaN;
            },
            template: (id:string, label:string, dataType:string, defaultValue: string | number | boolean | null):string => {
                defaultValue = defaultValue === null || defaultValue === undefined ? '' : defaultValue;
                return `
                <div class="fieldContainer fieldContainer--input">
                    <div class="input-group mb-12">
                        <input id="${id}" value="${defaultValue}" data-type="${dataType}" data-templatename="inputBootstrapNumeric" type="number" class="form-control" placeholder="${label}" aria-recordref="${label}" data-recordref="${label}" aria-describedby="basic-addon1">
                    </div>
                </div>`}
        },
        {
            name: 'multiselectBootstrap',
            label: UIRequiredType.MULTISELECT,
            getValueMethod: (htmlElement: HTMLInputElement | HTMLSelectElement): string[] => {
                if(htmlElement && htmlElement.tagName === 'SELECT'){
                    htmlElement = htmlElement as HTMLSelectElement;
                    
                    const selectedOptionsList = $(htmlElement).select2('data') as Record<string, string>[];
                    const currentSelectedOptions = selectedOptionsList.map((data)=>{
                        return data.text;
                    });
                    console.log(`My current selected options are: ${currentSelectedOptions.join(', ')}`);
                    return currentSelectedOptions;
                }
                console.error(`Event target (HTML Select Element) nog set`);
                return [];
            },
            template: (id:string, label:string, dataType:string, selectedValues: string | number | boolean | string[] | null, values: string[] | undefined):string => {
                if(!Array.isArray(selectedValues)){
                    console.error(`Incorrect data value provided. Provided selectedValues is not an array`);
                    return ``;
                }
                
                values = values && values.length > 0 ? values : [];
                let multiSelectOptionsHTML = '';
                values.forEach((value) => {
                    multiSelectOptionsHTML += `<option value="${value}" ${selectedValues.includes(value) ? `selected` : ``}>${value}</option>`
                });

                return `
                <div class="fieldContainer fieldContainer--multiselect">
                    <label class="form-label select-label">${label}</label> 
                    <br/>       
                    <select id="${id}" data-type="${dataType}" data-templatename="multiselectBootstrap" data-recordref="${label}" class="select2" multiple="multiple">
                                ${multiSelectOptionsHTML}
                    </select>
                </div>`}
        },
        {
            name: 'textareaBootstrap',
            label: UIRequiredType.TEXTAREA,
            getValueMethod: (htmlElement: HTMLInputElement | HTMLSelectElement): string => {
                if(htmlElement && htmlElement.tagName === 'TEXTAREA'){
                    htmlElement = htmlElement as HTMLInputElement;
                    return htmlElement.value;
                }
                console.error(`Event target nog set`);
                return '';
            },
            template: (id:string, label:string, dataType:string, defaultValue: string | number | boolean | null): string => { 
                defaultValue = defaultValue === null || defaultValue === undefined ? '' : defaultValue; 
                return `
                <div class="fieldContainer fieldContainer--textarea">
                    <div class="form-floating">
                        <textarea id="${id}" data-type="${dataType}" data-templatename="textareaBootstrap" data-recordref="${label}" class="form-control" placeholder="Leave a comment here" id="floatingTextarea">${defaultValue}</textarea>
                        <label for="floatingTextarea">${label}</label>
                    </div>
                </div>`}
        }
    ];

    private dataFields: DataField[] = [];
    private valuesCallback: ((value: DataRecordValues) => void) | undefined;
    private preSubmitCallback: ((submitType: SubmitType) => void) | undefined;
    private submitCallback: ((submitType: SubmitType) => void) | undefined;

    private _collectProfileDataFromDOMCallback: (() => void) | undefined;

    private valuesEventHandler = (event:Event) => {
        const dataType = this._getDataType(<HTMLInputElement>event.currentTarget);
        const templateName = this._getTemplateName(<HTMLInputElement>event.currentTarget);
        const UIRecordRef = this._getUIRecordRef(<HTMLInputElement>event.currentTarget);
        if(dataType && templateName && UIRecordRef){
            const value = this._getValueByTemplateName(templateName, event.currentTarget as HTMLInputElement | HTMLSelectElement); //todo: use label instead of dataType for getting the value?
            const newDataRecordValue: DataRecordValues = {
                'label': UIRecordRef,
                'value': value
            }
            if(this.valuesCallback){
                this.valuesCallback(newDataRecordValue);
            }else{
                console.error(`Callback method was not set`);
            }
            
        }else{
            console.error(`Could not get data type. Please ensure it is set.`);
        }
    };

    private submitEventHandler = (event:Event) => {
        const submitType:SubmitType | undefined = this._getSubmitType(<HTMLInputElement>event.currentTarget);
        
        if(this.preSubmitCallback && this.submitCallback && submitType){

            if(event.type === "mousedown" && this.preSubmitCallback){
                this.preSubmitCallback(submitType);
                return;
            }
        
            this.submitCallback(submitType);
        }else{
            console.error(`Could not submit type. Please ensure it is set.`);
        }
    };

    private screenList: ScreenController;

    constructor(screenList: ScreenController){
        this.screenList = screenList;
        console.log(`UIRenderer init`);
    }
    
    private _getSubmitType(currentTarget: HTMLInputElement): SubmitType | undefined {
        switch (true) {
            case currentTarget.id.replace('submitAction_', '') === 'liked':
              return SubmitType.LIKED;
            case currentTarget.id.replace('submitAction_', '') === 'superliked':
                return SubmitType.SUPERLIKED;
            case currentTarget.id.replace('submitAction_', '') === 'passed':
                return SubmitType.PASSED;
            case currentTarget.id.replace('submitAction_', '') === 'sendMessage':
                return SubmitType.SENDMESSAGE;
            default:
              return undefined
          }
    }
    
    private _getValueByTemplateName(templateName: string, HTMLInputElement: HTMLInputElement | HTMLSelectElement): unknown | undefined {
        const indexTemplateByDataType = this.templatesList.findIndex( template => template.name === templateName);
        if(indexTemplateByDataType !== -1){
            return this.templatesList[indexTemplateByDataType].getValueMethod(HTMLInputElement);
        }
        console.error(`Could not get value of template with label: ${templateName}`);
        return undefined;
    }

    private _getTemplateName(currentTarget: HTMLInputElement): string | undefined {
        if(!currentTarget){
            console.error(`Event target was not set for getting data type`);
            return undefined;
        }
        return currentTarget && Object.prototype.hasOwnProperty.call(currentTarget.dataset, "templatename") ? currentTarget.dataset.templatename : undefined;
    }

    private _getUIRecordRef(currentTarget: HTMLInputElement): string | undefined {
        if(!currentTarget){
            console.error(`Event target was not set for getting data type`);
            return undefined;
        }
        return currentTarget && Object.prototype.hasOwnProperty.call(currentTarget.dataset, "recordref") ? currentTarget.dataset.recordref : undefined;
    }

    private _getDataType(currentTarget: HTMLInputElement | null): string | undefined {
        if(!currentTarget){
            console.error(`Event target was not set for getting data type`);
            return undefined;
        }
        return currentTarget && Object.prototype.hasOwnProperty.call(currentTarget.dataset, "type") ? currentTarget.dataset.type : undefined;
    }

    public renderFieldsContainerForScreen(screenController: ScreenController, additionalScreenAdjustments?: () => void, collectProfileDataFromDOMCallback?: () => void): void {
        this._collectProfileDataFromDOMCallback = collectProfileDataFromDOMCallback;
        if(screenController.isSwipeScreen()){
            $('body').prepend(`
                <div id="uiHelperFields" class="uiHelperFieldsContainer uiHelperFieldsContainer--select">
                <div id="uiHelperFieldsCollectData">
                    <button id="uiHelperFieldsCollectDataButton">Collect Data</button>
                </div>
                <div id="uiHelperFieldsHide">
                        <button id="uiHelperFieldsHideButton">Hide</button>
                    </div>
                    <form id="uiHelperFieldsForm">
                        <div class="container">
                            <div class="row">
                                <div id="uiHelperFieldsContainer" class="col-12">
                                    <p class="h5">T-Helper fields</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div id="uiHelperFieldsShow">
                    <button id="uiHelperFieldsShowButton">show</button>
                </div>
            `);
        }

        if(screenController.isChatScreen()){
            $('body').prepend(`
            <div id="uiHelperFields" class="uiHelperFieldsContainer uiHelperFieldsContainer--chat">
                <div id="uiHelperFieldsHide">
                    <button id="uiHelperFieldsHideButton">Hide</button>
                </div>
                <form id="uiHelperFieldsForm">
                    <div class="container">
                        <div class="row">
                            <div id="uiHelperFieldsContainer" class="col-12">
                                <p class="h5">T-Helper fields</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="uiHelperFieldsShow">
                <button id="uiHelperFieldsShowButton">show</button>
            </div>
        `);
        }

        if($(`#uiHelperFields`).length === 0){
            const errUiHelperFields = `Container with id uiHelperFields was not set. Please check the logic for rendering the fields container`;
            ConsoleColorLog.singleLog(errUiHelperFields, null, LogColors.RED);
            throw new Error(errUiHelperFields);
        }

        this._setSubmitEventHandlers(screenController);

        if(additionalScreenAdjustments){
            additionalScreenAdjustments();
        }

        $(`body`).on("blur", '#uiHelperFieldsContainer [id^="datafieldUI_"]', this.valuesEventHandler);
        $(`body`).on("change", '#uiHelperFieldsContainer .select2', this.valuesEventHandler);
        $(`body`).on("mouseup", '[id^="submitAction_"]', this.submitEventHandler);
        $(`body`).on("mousedown", '[id^="submitAction_"]', this.submitEventHandler);
        // NOTE: Due to my mouse or otherwise; the mouseup/mousedown fires 5-6 times in short succession

        $(`body`).on("click", '[id="uiHelperFieldsCollectDataButton"]', ()=>{
            if(this._collectProfileDataFromDOMCallback){
                this._collectProfileDataFromDOMCallback();
            }else{
                alert(`Whoops! Seems like `);
            }
        });

        $(`body`).on("click", '[id="uiHelperFieldsShowButton"]', ()=>{
            $(`#uiHelperFields`).show();
            $(`#uiHelperFieldsShowButton`).hide();
        });
        $(`body`).on("click", '[id="uiHelperFieldsHideButton"]', ()=>{
            $(`#uiHelperFields`).hide();
            $(`#uiHelperFieldsShowButton`).show();
        });

        
    }

    private _setSubmitEventHandlers(screenController: ScreenController): void {


        if(screenController.isSwipeScreen()){
            // const submitButtonDOMType_pass = $(".recsCardboard__cards div[class*=c-pink] button").first();
            const submitButtonDOMType_pass = DOMHelper.getFirstDOMNodeByJquerySelector(
                screenController.getCurrentScreen().getScreenActionActionDOMRefByActionName('pass')
            );

            if(submitButtonDOMType_pass !== null){
                $(submitButtonDOMType_pass).attr('id', 'submitAction_passed');
                this.decoratedSubmitEventsDOMElementsList.push(submitButtonDOMType_pass);
            }else{
                console.error(`submitAction_passed could not be set! submit button not found. Please update the selector.`);
            }

            const submitButtonDOMType_superlike = DOMHelper.getFirstDOMNodeByJquerySelector(
                // this.screenList.getActionDOMRef(ScreenNavStateComboTinder.Swipe, 'superlike')
                screenController.getCurrentScreen().getScreenActionActionDOMRefByActionName('superlike')
                );
            if(submitButtonDOMType_superlike !== null){
                $(submitButtonDOMType_superlike).attr('id', 'submitAction_superliked');
                this.decoratedSubmitEventsDOMElementsList.push(submitButtonDOMType_superlike);
            }else{
                console.error(`submitAction_superliked could not be set! submit button not found. Please update the selector.`);
            }

            const submitButtonDOMType_like = DOMHelper.getFirstDOMNodeByJquerySelector(
                // this.screenList.getActionDOMRef(ScreenNavStateComboTinder.Swipe, 'like')
                screenController.getCurrentScreen().getScreenActionActionDOMRefByActionName('like')
                );
            if(submitButtonDOMType_like !== null){
                $(submitButtonDOMType_like).attr('id', 'submitAction_liked');
                this.decoratedSubmitEventsDOMElementsList.push(submitButtonDOMType_like);
            }else{
                console.error(`submitAction_pass could not be set! submit button not found. Please update the selector.`);
            }
        }

        if(screenController.getCurrentScreen().getScreenIsChatScreen()){
            // const submitButtonDOMType_sendMessage = $("div.BdT > form > button[type='submit']").first();
            const submitButtonDOMType_sendMessage = DOMHelper.getFirstDOMNodeByJquerySelector(
                screenController.getCurrentScreen().getScreenActionActionDOMRefByActionName('sendMessage')
                );
            if(submitButtonDOMType_sendMessage !== null){
                $(submitButtonDOMType_sendMessage).attr('id', 'submitAction_sendMessage');
                this.decoratedSubmitEventsDOMElementsList.push(submitButtonDOMType_sendMessage);
            }else{
                console.error(`submitAction_sendMessage could not be set! submit button not found. Please update the selector.`);
            }
        }
    }

    public renderFieldsFromDataFields(
        dataFields: DataField[], 
        valuesCallback: (value: DataRecordValues) => void, 
        preSubmitCallback: (submitType: SubmitType) => void, 
        submitCallback: (submitType: SubmitType) => void): void {

        this.dataFields = this.dataFields.concat(dataFields);

        if(!$('body').find('#uiHelperFieldsContainer').first()[0]){
            console.error(`Could not place helper fields because helper container with id ${'uiHelperFieldsContainer'} does not exist.`);
        }

        if(!dataFields.every(dataFieldType => dataFieldType.UISetting.UIrequiredType !== null)){
            console.error(`Provided datafields do not have a requiredFieldType: ${dataFields}`);
        }

        if(!valuesCallback || !submitCallback || ! preSubmitCallback){
            console.error(`Callback method for values or (pre-)submit was not set`);
        }

        this.valuesCallback = valuesCallback;
        this.preSubmitCallback = preSubmitCallback;
        this.submitCallback = submitCallback;

        this.updateDataFieldValues();
    }

    public updateDataFieldValues(): void {
        $('body').find('#uiHelperFieldsContainer').empty();
        $('body').find('#uiHelperFieldsContainer').append('<p class="h5">T-Helper fields</p>');


        this.dataFields.forEach((dataField, index) => {
            const requiredTemplateIndex = this.templatesList.findIndex(template => template.label === dataField.UISetting.UIrequiredType);
            const dataFieldValue: string | number | boolean | null = dataField.getValue();
            // console.log(`RENDERING UI FIELD. DEFAULT VALUE FOR ${dataField.title} SHOULD BE: ${dataField.getValue()}`);
            
            $('body').find('#uiHelperFieldsContainer').first().append(this.templatesList[requiredTemplateIndex].template(`datafieldUI_${index}`, dataField.title, dataField.dataLogic.baseType, dataFieldValue, dataField.options));
        });

        this.activateMultiSelectDropdown();
    }

    private activateMultiSelectDropdown(): void {
        $(".select2").select2({
            placeholder: 'Select an option',
            closeOnSelect: false,
            width: '100%'
        });
    }

    public removeAllUIHelpers(): void {
        this.resetExistingFields();

        $(`body`).off("blur", '#uiHelperFieldsContainer [id^="datafieldUI_"]');
        // $(`body`).off("click", '[id^="submitAction_"]');

        $(`body`).off("mouseup", '[id^="submitAction_"]');
        $(`body`).off("mousedown", '[id^="submitAction_"]');

        $(`body`).off("click", '[id="uiHelperFieldsCollectDataButton"]');

        $(`body`).off("click", '[id="uiHelperFieldsShowButton"]');
        $(`body`).off("click", '[id="uiHelperFieldsHideButton"]');

        for(let i=0; i <= (this.decoratedSubmitEventsDOMElementsList.length - 1); i = i+1){
            $(this.decoratedSubmitEventsDOMElementsList[i]).removeAttr('id');
        }

        this.valuesCallback = undefined;
        this.preSubmitCallback = undefined;
        this.submitCallback = undefined;
        this._collectProfileDataFromDOMCallback = undefined;
        this.dataFields = [];

        const helperFieldsContainer = $(`#uiHelperFields`);
        if(helperFieldsContainer.length > 0){
            helperFieldsContainer.toArray().forEach((element: HTMLElement) => {
                $(element).remove();
            });
        }
    }

    public resetExistingFields(): void {
        const HTMLFormElement = $(`#uiHelperFieldsForm`).first();
        if(HTMLFormElement.length > 0 && HTMLFormElement[0].tagName === 'FORM'){
            //todo: there must be a better way to do this?
            HTMLFormElement.trigger("reset");

            //todo: also; this is done to exclusively set the value of all textarea's to empty? There must be a better way?
            HTMLFormElement.find('textarea').each(function(){
                this.value = '';
            });
        }
    }
}