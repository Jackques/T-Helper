class DataStore {
    constructor(){

    }
    public usedDataFields:any[] = [
        'No', 
        'Datum-liket', 
        'Datum-match', 
        'Naam', 
        'Leeftijd', 
        'Woonplaats',
        'Heeft-profieltekst', 
        'Heeft-zinnige-profieltekst', 
        'Geverifieerd', 
        new DataField('Aantrekkelijkheidsscore', '', true, false, false, false),
        'Match', 
        'ander-eerste-bericht',
        'ander-gereageerd',
        'gesprek-op-gang',
        'gevoel-van-gemak-gesprek',
        'hoe-vaak-ghost',
        'nummer-verkregen',
        'blocked',
        'geinteresseerd-sex',
        'potentiele-klik',
        'notities'
    ];

    public getUsedDataFieldByName(title: string){
        //todo: method which !!POPUP!! can use to get the correct DataField object from this internal list
    }
//todo: NOTE! attractiveness rating on photo's can be 1, 2, 3, 6.5, 6, 7,5, 8 etc. but also: NAN (no photo available when there is litterally no photo?)
}