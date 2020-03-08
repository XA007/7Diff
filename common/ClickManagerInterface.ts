import {RoomInterface} from "./RoomInterface";
import {Pixel} from "./Pixel";

export interface ClickManagerInterface {
    room: RoomInterface,
    player: string,
    pixels: Pixel[],
    clickX: number,
    clickY: number,
    objectName: string,
    objectuuid: string,
}
