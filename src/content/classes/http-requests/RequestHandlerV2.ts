export class RequestHandlerV2 {
    // todo:
    // update name to factory? change name to factory? because I want it to PRODUCE requesthandlerV2Objects, which by calling a simple async method fetch their data
    // waarom factory pattern?
        // 1. want ik wil optioneel auth token meegeven of standaard auth token gebruiken
        // 2. want ik genereer objects op basis van verkregen config en al die logica wil ik apart kunnen beleggen in een aparte klasse
        // 3. in dezelfde klase (2) is het gemakkelijker om dan ook een getOneRequestObj en een getManyRequestObjList te maken
            // > waarom zou ik niet altijd voor die getmanyRequestObjList gaan?
        // 4. Provide genericlist object i.e.: Array<TinderMatchDataResult> in which the results can be stored as well as request data (used url, http method). This object is then filled with the results and returned!
            // want dan zit ik niet met een enorme lijst aan properties (url, params, body etc. meegeven.. dit wordt opgesteld in de factory method)
            // dan blijft deze data ook bewaard
            // abstraheert weer een beetje de laag tussen requests logic & getting and setting the right data
            // > WANT kan ook makkelijk logica opnemen die error opgooit als bepaalde properties plots ontbreken uit respons (warning geven bij uitblijven minder belangrijke properties of juist als er properties bij zijn gekomen om te benutten,.. of zelfs alternatieve logica in dat geval uitvoeren)
            // > WANT kan ook makkelijk logica opnemen die OPNIEUW hetzelfde request uitvoert als er een bepaalde property in het respons zit (zoals bijv. bij tinder een gevulde next_page_token)

    // Params:
    // provide url, http method, params, body etc?
        // also provide amount of auto retries (after xx seconds, ALSO provide offset for seconds retry)
    // provide OPTIONAL auth token (if supplied use that, otherwise use default which is set when initiating class)
    // provide settings on how I want the error to be handled;
        // stopExecutionThread on error
        // show alert with error


    // Features:
    // generic class for firing requests
    // wraps promise (so implementation dev can easily use "async requesthandlerV2WhichReturnsPromise()")
    // implements try.. catch() IF user setting says it can, because sometimes i may NOT want the thread to stop
    // implements retries
    // implements callback on success (useless i think because this is automatically solved by using a on return promise?)
    // return promise with .next(// my provided interface) & .catch(// my provided error interface)
    // add in option to send multiple DIFFERENT http request at once, at different times (that list idea) and only async return once all requests have been fulfilled
        // (i.e. I use this in my get deleted matches request for example in Happn)


}