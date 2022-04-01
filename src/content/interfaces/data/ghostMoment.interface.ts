import { GhostStatus } from "src/content/classes/data/dataItems/dataItemGhost";

export interface ghostMoment {
    number: number,
    timeSinceLastMessageMS: number,
    status: GhostStatus
}