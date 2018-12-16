import { EventEmitter } from "events";

export const cmdEvent = new EventEmitter();

export enum CmdTypes {
    GOTO = 'goto'
}