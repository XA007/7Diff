import * as http from "http";
import {injectable} from "inversify";
import "reflect-metadata";
import * as socketIO from "socket.io";
import * as THREE from "three";
import {ClickEvent} from "../../../common/ClickEvent";
import {ClickManagerInterface} from "../../../common/ClickManagerInterface";
import {Pixel} from "../../../common/Pixel";
import {RoomInterface} from "../../../common/RoomInterface";
import * as events from "../../../common/SocketEvents";
import {FreeViewDifference} from "./freeViewDifferenceService";
import {GameService} from "./gameService";

const MAX_PLAYERS: number = 2;
const emptyRoom: RoomInterface = {
    players: [],
    name: "",
    gameName: "",
    isSimpleGame: true,
};

@injectable()
export class SocketService {
    private ioSocketServer: SocketIO.Server;
    private _rooms: RoomInterface[];
    public roomIndex: number;

    public constructor() {
        this._rooms = [];
        this.roomIndex = 0;
    }

    public get rooms(): RoomInterface[] {
        return this._rooms;
    }

    public isRoomFull(room: RoomInterface): boolean {
        return room.players.length === MAX_PLAYERS;
    }

    public listen(server: http.Server): void {
        this.ioSocketServer = socketIO(server);
        this.ioSocketServer.on(events.CONNECT, (socket: SocketIO.Socket) => {
            socket.on(events.MESSAGE, (msg: string) => { this.differenceFound(msg); });
            socket.on(events.CANCEL_ROOM, (gameName: string) => { this.cancelRoom(gameName, socket); });
            socket.on(events.GAME_LIST_RELOAD, () => { this.sendWaitingGames(); });
            socket.on(events.WAITING_OPPONENT, (gameName: string, username: string, isSimpleGame: boolean) => {
                this.waitingOpponent(gameName, username, isSimpleGame);
            });
            socket.on(events.CREATE_ROOM, (gameName: string, username: string, isSimpleGame: boolean) => {
                this.createRoom(gameName, username, isSimpleGame);
            });
            socket.on(events.SIMPLE_VIEW_CLICK_ENTERED, (gameName: string, userName: string, click: ClickEvent) => {
                this.manageSimpleViewClick(gameName, userName, click);
            });
            socket.on(events.FREE_VIEW_CLICK_ENTERED, (gameName: string, userName: string, object: THREE.Object3D, click: ClickEvent) => {
                this.manageFreeViewClick(gameName, userName, object, click);
            });
            socket.on(events.SEND_MESSAGE_TO_ROOM, (roomName: string, message: string) => {
                this.sendMessageToRoom(roomName, message, socket);
            });
            socket.on(events.GAME_STARTED, (gameName: string, player: string) => {
                this.joinRoom(gameName, player, socket);
            });
            socket.on(events.GAME_ENDED, (gameName: string, player: string) => {
                this.deleteRoom(gameName, player, socket);
            });
        });
    }

    public differenceFound(m: string): void {
        this.ioSocketServer.emit(events.MESSAGE, m);
    }

    public sendMessageToRoom(roomName: string, m: string, socket: SocketIO.Socket): void {
        socket.broadcast.to(roomName).emit(events.MESSAGE, m);
    }

    public roomAlreadyExists(gameName: string): boolean {
        let exists: boolean = false;
        for (const room of this._rooms) {
            if (room.gameName === gameName) {
                exists = true;
            }
        }

        return exists;
    }

    public createRoom(gameName: string, username: string, isSimpleGame: boolean): void {
        const room: RoomInterface = {
            players: [username],
            name: "",
            gameName: gameName,
            isSimpleGame: isSimpleGame,
        };
        if (this.roomAlreadyExists(gameName)) {
            this.roomIndex++;
            room.name = gameName + this.roomIndex;
            this._rooms.push(room);
            this.ioSocketServer.emit(events.WAITING, room);
        } else {
            room.name = gameName + this.roomIndex;
            this._rooms.push(room);
            this.ioSocketServer.emit(events.WAITING, room);
        }
    }

    public waitingOpponent(gameName: string, username: string, isSimpleGame: boolean): void {
        for (const room of this._rooms) {
            if (room.gameName === gameName && room.players.length < MAX_PLAYERS && room.isSimpleGame === isSimpleGame) {
                room.players.push(username);
                this.ioSocketServer.emit(events.ROOM_IS_FULL, room);
            }
        }
    }

    public cancelRoom(gameName: string, socket: SocketIO.Socket): void {
        let index: number = 0;
        for (const room of this._rooms) {
            if (room.gameName === gameName && room.players.length === 1) {
                socket.leave(room.name);
                this._rooms.splice(index, 1);
                this.ioSocketServer.emit(events.CANCEL_ROOM, room);
            }
            index++;
        }
    }

    public sendWaitingGames(): void {
        for (const room of this._rooms) {
            if (room.players.length === 1) {
                this.ioSocketServer.emit(events.GAME_LIST_RELOAD, room);
            }
        }
    }

    public getRoomByGameAndPlayer(gameName: string, player: string): RoomInterface {
        for (const room of this._rooms) {
            if (room.gameName === gameName && room.players.indexOf(player) >= 0) {
                return room;
            }
        }

        return emptyRoom;
    }

    public validateCoordsPromise(gameName: string, click: ClickEvent): Promise<Pixel[]> {
        return new Promise( (resolve: Function) => {
            const canvasHeight: number = 480;
            const serverY: number = canvasHeight - click.offsetY;
            try {
                resolve(GameService.validateCoords(gameName, click.offsetX, serverY));
            } catch (e) {
                throw e;
            }
        });
    }

    public emitGameDeleted(gameName: string): void {
        this.ioSocketServer.emit(events.GAME_DELETED, gameName);
    }

    public validateObjectPromise(gameName: string, uuid: string): Promise<boolean> {
        return new Promise( (resolve: Function) => {
            resolve(FreeViewDifference.FreeViewDifferenceService.checkIfDifference(gameName, uuid));
        });
    }

    public manageFreeViewClick(gameName: string, userName: string, object: THREE.Object3D, click: ClickEvent): void {
        const room: RoomInterface = this.getRoomByGameAndPlayer(gameName, userName);
        const clickManger: ClickManagerInterface = {
            room: room,
            player: userName,
            pixels: [],
            clickX: click.clientX,
            clickY: click.clientY,
            objectName: object["object"]["name"],
            objectuuid: object["object"]["uuid"],
        };
        this.validateObjectPromise(gameName, object["object"]["uuid"]).then( (found: boolean) => {
            found ?
                this.ioSocketServer.emit(events.DIFFERENCE_FOUND, clickManger) :
                this.ioSocketServer.emit(events.ERROR_FOUND, clickManger);
        });
    }

    public manageSimpleViewClick(gameName: string, userName: string, click: ClickEvent): void {
        let pixels: Pixel[] = [];
        const room: RoomInterface = this.getRoomByGameAndPlayer(gameName, userName);
        const clickManger: ClickManagerInterface = {
            room: room,
            player: userName,
            pixels: [],
            clickX: click.clientX,
            clickY: click.clientY,
            objectName: "",
            objectuuid: "",
        };
        this.validateCoordsPromise(gameName, click).then( (p: Pixel[]) => {
            pixels = p;
        }).then( () => {
            clickManger.pixels = pixels;
            pixels.length ?
                this.ioSocketServer.emit(events.DIFFERENCE_FOUND, clickManger) :
                this.ioSocketServer.emit(events.ERROR_FOUND, clickManger);
        }).catch( () => {
            clickManger.pixels = pixels;
            pixels.length ?
                this.ioSocketServer.emit(events.DIFFERENCE_FOUND, clickManger) :
                this.ioSocketServer.emit(events.ERROR_FOUND, clickManger);
        });
    }

    public joinRoom(gameName: string, player: string, socket: SocketIO.Socket): void {
        const room: RoomInterface = this.getRoomByGameAndPlayer(gameName, player);
        socket.join(room.name);
        this.ioSocketServer.emit(events.NO_MORE_ROOMS, room);
    }

    public deleteRoom(gameName: string, player: string, socket: SocketIO.Socket): void {
        const room: RoomInterface = this.getRoomByGameAndPlayer(gameName, player);
        socket.leave(room.name);
    }

    public emitNewCard(gameName: string): void {
        this.ioSocketServer.emit(events.NEW_CARD, gameName);
    }
}
