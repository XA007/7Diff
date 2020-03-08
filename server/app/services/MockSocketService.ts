import { injectable } from "inversify";
import "reflect-metadata";
import {RoomInterface} from "../../../common/RoomInterface";

const MAX_PLAYERS: number = 2;

@injectable()
export class MockSocketService {
    private _rooms: RoomInterface[];

    public constructor() {
        this._rooms = [];
    }

    public roomAlreadyExists(name: string, isSimpleGame: boolean): boolean {
        let exists: boolean = false;
        for (const room of this._rooms) {
            if (room.name === name && room.isSimpleGame === isSimpleGame) {
                exists = true;
            }
        }

        return exists;
    }

    public createRoom(name: string, isSimpleGame: boolean): void {
        const roomExists: boolean = this.roomAlreadyExists(name, isSimpleGame);
        const room: RoomInterface = {
            players: [],
            name: name,
            gameName: "",
            isSimpleGame: isSimpleGame,
        };
        if (!roomExists) {
            this._rooms.push(room);
        }
    }

    public checkIfRoomIsFull(roomSelected: RoomInterface): boolean {
        let isFull: boolean = false;
        for (const room of this._rooms) {
            if (room.name === roomSelected.name) {
                if (room.players.length === MAX_PLAYERS) {
                    isFull = true;
                }
            }
        }

        return isFull;
    }

    public socketJoinRoom(selectedRoom: RoomInterface, userName: string): void {
        if (!this.checkIfRoomIsFull(selectedRoom)) {
            for (const room of this._rooms) {
                if (room.name === selectedRoom.name) {
                    let isExist: boolean = false;
                    for (const user of room.players) {
                        if (user === userName) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        room.players.push(userName);
                    }
                }
            }
        }
    }

    public getRooms(): RoomInterface[] {
        return this._rooms;
    }
}
