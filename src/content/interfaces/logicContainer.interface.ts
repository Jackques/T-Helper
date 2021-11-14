/* eslint-disable @typescript-eslint/ban-types */
export interface logicContainer {
    baseType: baseTypes;
    checkMethod: Function | null; //todo: check why i should not (according to eslint) use Function here as Type and figure out what to do instead
}

export type baseTypes = 'string' | 'number' | 'boolean' | 'list';