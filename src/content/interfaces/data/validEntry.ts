import { requiredProperty } from "./requiredProperty";

export interface validEntry {
    requiredPropertiesList:requiredProperty[];
    isValidEntry(listEntry: unknown): boolean;
    propertyChecker(requiredPropertiesList:requiredProperty[], listEntry: Record<string, string>): boolean;
    argumentChecker(requiredPropertiesList:requiredProperty[], listEntry: Record<string, string>): boolean;
}