export class Overlay {
    /**
     * Checks wether all data record values array provided in the param exist in the data record
     * @param {string} uniqueId
     * @param {boolean} visibility
     * @returns {void}
     */
    public static setLoadingOverlay(uniqueId: string, visibility: boolean): void {
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

    public static setLoadingOverlayProgress(uniqueId: string, currentNumber: number, totalNumber: number, statusText: string){
        if(!uniqueId || uniqueId.length === 0){
            console.error(`uniqueId is not set`);
            return;
        }

        if($(`#${uniqueId}`).length === 0){
            // if loader is not found, do nothing
            return;
        }

        if(currentNumber < 0 || totalNumber < 0){
            console.error(`CurrentNumber or totalNumber input may not be less than 0`);
            return;
        }

        if(totalNumber < currentNumber){
            console.error(`TotalNumber ${totalNumber} cannot be less than currentNumber: ${currentNumber}`);
        }

        if($(`#${uniqueId} .loadingOverlayContainer .progress`).length === 0){
            $(`body #${uniqueId} .loadingOverlayContainer`).append(`
                <div class="status-container">
                    <div class="status-text-container">
                        <p class="status-text">${statusText}</p>
                    </div>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped" role="progressbar" style="width: ${this.getPercentageOfTotal(currentNumber, totalNumber)}%" aria-valuenow="${this.getPercentageOfTotal(currentNumber, totalNumber)}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            `);
        }else{
            $(`#${uniqueId} .loadingOverlayContainer .status-text`).text(statusText);
            $(`#${uniqueId} .loadingOverlayContainer .progress-bar`).css( "width", `${this.getPercentageOfTotal(currentNumber, totalNumber)}%`);
        }
    }

    private static getPercentageOfTotal(currentValue: number, totalValue: number): number {
        // return totalValue / 100 * currentValue;
        return currentValue / totalValue * 100;
    }
}