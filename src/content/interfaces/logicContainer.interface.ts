import { dataCheck } from "../classes/data/dataCheckLogic/dataCheck";
import { dataCheckSimple } from "../classes/data/dataCheckLogic/dataCheckSimple";

export interface logicContainer {
    baseType: baseTypes;
    customCheckClass: dataCheck | dataCheckSimple | null;
}

export type baseTypes = 'string' | 'number' | 'boolean' | 'list';