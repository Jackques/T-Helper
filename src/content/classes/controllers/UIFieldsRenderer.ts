import { TemplateSetting } from "src/content/interfaces/controllers/templateSetting.interface";
import { DataFieldTypes } from "src/content/interfaces/data/dataFieldTypes.interface";
import { DataRecordValues } from "src/content/interfaces/data/dataRecordValues.interface";
import { DataField, UIRequiredType } from "../data/dataField";
import { SubmitType } from "../../../SubmitType";
import { ScreenNavStateCombo } from "../tinder/screenStateCombo.enum";

export class UIFieldsRenderer {
    
    private templatesList: TemplateSetting[] = [
        {
            name: 'sliderBootstrap',
            label: UIRequiredType.SLIDER,
            getValueMethod: (htmlElement:HTMLInputElement) => {
                if(htmlElement){
                    return htmlElement.valueAsNumber;
                }
                console.error(`Event target nog set`);
            },
            template: (id:string, label:string, dataType:string) => `
                <div class="fieldContainer fieldContainer--slider">
                    <label for="${id}" class="form-label">${label}</label>
                    <input type="range" class="form-range" min="1" max="10" step="1" id="${id}" data-type="${dataType}" data-templatename="sliderBootstrap" data-recordref="${label}">
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
                </div>`,
        },
        {
            name: 'switchBootstrap',
            label: UIRequiredType.SWITCH,
            getValueMethod: (htmlElement:HTMLInputElement) => {
                if(htmlElement){
                    return htmlElement.checked ? true : false;
                }
                console.error(`Event target nog set`);
            },
            template: (id:string, label:string, dataType:string) => `
            <div class="fieldContainer fieldContainer--switch">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="${id}" data-type="${dataType}" data-templatename="switchBootstrap" data-recordref="${label}">
                    <label class="form-check-label" for="flexSwitchCheckDefault">${label}</label>
                </div>
            </div>`
        },
        {
            name: 'inputBootstrap',
            label: UIRequiredType.ALPHANUMERIC_INPUT,
            getValueMethod: (htmlElement:HTMLInputElement) => {
                if(htmlElement){
                    return htmlElement.value;
                }
                console.error(`Event target nog set`);
            },
            template: (id:string, label:string, dataType:string) => `
            <div class="fieldContainer fieldContainer--input">
                <div class="input-group mb-12">
                    <input id="${id}" data-type="${dataType}" data-templatename="inputBootstrap" type="text" class="form-control" placeholder="${label}" aria-recordref="${label}" data-recordref="${label}" aria-describedby="basic-addon1">
                </div>
            </div>`
        },
        {
            name: 'textareaBootstrap',
            label: UIRequiredType.TEXTAREA,
            getValueMethod: (htmlElement:HTMLInputElement) => {
                if(htmlElement){
                    return htmlElement.value;
                }
                console.error(`Event target nog set`);
            },
            template: (id:string, label:string, dataType:string) => `
            <div class="fieldContainer fieldContainer--textarea">
                <div class="form-floating">
                    <textarea id="${id}" data-type="${dataType}" data-templatename="textareaBootstrap" data-recordref="${label}" class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                    <label for="floatingTextarea">${label}</label>
                </div>
            </div>`
        }
    ];
    private valuesCallback: ((value: DataRecordValues) => void) | undefined;
    private submitCallback: ((submitType: SubmitType) => void) | undefined;

    constructor(){
        console.log(`UIRenderer init`);

        //todo: can this be a class method as well?
        const valuesEventHandler = (event:Event) => {
            const dataType = this._getDataType(<HTMLInputElement>event.currentTarget);
            const templateName = this._getTemplateName(<HTMLInputElement>event.currentTarget);
            const UIRecordRef = this._getUIRecordRef(<HTMLInputElement>event.currentTarget);
            if(dataType && templateName && UIRecordRef){
                const value = this._getValueByTemplateName(templateName, <HTMLInputElement>event.currentTarget); //todo: use label instead of dataType for getting the value?
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

        const submitEventHandler = (event:Event) => {
            const submitType:SubmitType | undefined = this._getSubmitType(<HTMLInputElement>event.currentTarget);
            if(this.submitCallback && submitType){
                this.submitCallback(submitType);
            }else{
                console.error(`Could not submit type. Please ensure it is set.`);
            }
        };

        $(`body`).on("blur", '#uiHelperFieldsContainer [id^="datafieldUI_"]', valuesEventHandler);
        $(`body`).on("click", '[id^="submitAction_"]', submitEventHandler);
    }
    
    private _getSubmitType(currentTarget: HTMLInputElement): SubmitType | undefined {
        switch (true) {
            case currentTarget.id.replace('submitAction_', '') === 'liked':
              return SubmitType.LIKED;
            case currentTarget.id.replace('submitAction_', '') === 'superliked':
                return SubmitType.SUPERLIKED;
            case currentTarget.id.replace('submitAction_', '') === 'passed':
                return SubmitType.PASSED;
            default:
              return undefined
          }
    }
    
    private _getValueByTemplateName(templateName: string, HTMLInputElement: HTMLInputElement): unknown | undefined {
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

    public renderFieldsContainerForScreen(screen: ScreenNavStateCombo, additionalScreenAdjustmentCommands?: () => void): void {
        if(screen === ScreenNavStateCombo.Swipe){
            $('body').prepend(`
                <div id="uiHelperFields" class="uiHelperFieldsContainer uiHelperFieldsContainer--select">
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
            `);
            this._setSubmitEventHandlers();
        }

        if(screen === ScreenNavStateCombo.Chat){
            $('body').prepend(`
            <div id="uiHelperFields" class="uiHelperFieldsContainer uiHelperFieldsContainer--chat">
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
        `);
        }

        if(additionalScreenAdjustmentCommands){
            additionalScreenAdjustmentCommands();
        }
        
    }

    private _setSubmitEventHandlers(): void {
            const submitButtonDOMType_pass = $(".recsCardboard__cards span:contains('Nee bedankt')").first();
            if(submitButtonDOMType_pass[0]){
                submitButtonDOMType_pass.parent('button').attr('id', 'submitAction_passed');
            }

            const submitButtonDOMType_superlike = $(".recsCardboard__cards span:contains('Super Like')").first();
            if(submitButtonDOMType_superlike[0]){
                submitButtonDOMType_superlike.parent('button').attr('id', 'submitAction_superliked');
            }

            const submitButtonDOMType_like = $(".recsCardboard__cards span:contains('Leuk')").first();
            if(submitButtonDOMType_like[0]){
                submitButtonDOMType_like.parent('button').attr('id', 'submitAction_liked');
            }

    }

    public renderFieldsFromDataFields(dataField: DataField[], valuesCallback: (value: DataRecordValues) => void, submitCallback: (submitType: SubmitType) => void){
        if(!$('body').find('#uiHelperFieldsContainer').first()[0]){
            console.error(`Could not place helper fields because helper container with id ${'uiHelperFieldsContainer'} does not exist.`);
        }

        if(!dataField.every(dataFieldType => dataFieldType.UISetting.UIrequiredType !== null)){
            console.error(`Provided datafields do not have a requiredFieldType: ${dataField}`);
        }

        if(!valuesCallback || !submitCallback){
            console.error(`Callback method for values or submit was not set`);
        }

        this.valuesCallback = valuesCallback;
        this.submitCallback = submitCallback;

        dataField.forEach((dataFieldType, index) => {
            const requiredTemplateIndex = this.templatesList.findIndex(template => template.label === dataFieldType.UISetting.UIrequiredType);
            $('body').find('#uiHelperFieldsContainer').first().append(this.templatesList[requiredTemplateIndex].template(`datafieldUI_${index}`, dataFieldType.title, dataFieldType.dataLogic.baseType));
        });
    }

    public removeAllUIHelpers(): void {
        this.resetExistingFields();
        this.valuesCallback = undefined;
        this.submitCallback = undefined;
        const helperFieldsContainer = $(`#uiHelperFields`);
        if(helperFieldsContainer){
            helperFieldsContainer.remove();
        }else{
            console.error(`Cannot find helper fields container to remove. Please check reference to HTMLElement.`);
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

    /**
     * Checks wether all data record values array provided in the param exist in the data record
     * @param {string} uniqueId
     * @param {boolean} visibility
     * @returns {void}
     */
    public setLoadingOverlay(uniqueId: string, visibility: boolean): void {
        if(!uniqueId || uniqueId.length === 0){
            console.error(`uniqueId is not set`);
            return;
        }
        if(visibility === undefined){
            console.error(`visibility is not provided`);
            return;
        }
        if(visibility){

            // if loadingOverlay with the same name already exists, do nothing
            if($(`#${uniqueId}`).length > 0){
                return;
            }

            $(`body`).append(`
            <div id="${uniqueId}" class="loadingOverlay">
                <div class="loadingOverlayContainer">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>`);
        }else{
            $(`body #${uniqueId}`).remove();
        }
        
    }

}