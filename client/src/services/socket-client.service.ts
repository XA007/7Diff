import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import * as socketIo from "socket.io-client";
import * as THREE from "three";
import {ClickEvent} from "../../../common/ClickEvent";
import {ClickManagerInterface} from "../../../common/ClickManagerInterface";
import {RoomInterface} from "../../../common/RoomInterface";
import * as events from "../../../common/SocketEvents";
import {SERVER_URL} from "./constants/Connections";

@Injectable({
  providedIn: "root",
})
export class SocketClientService {

  private socket: SocketIOClient.Socket;

  public constructor() {
    this.initSocket();
  }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: string): void {
    this.socket.emit(events.MESSAGE, message);
  }

  public onMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on(events.MESSAGE, (data: string) => {
        observer.next(data);
      });
    });
  }

  public onFullRoom(): Observable<RoomInterface> {
    return new Observable<RoomInterface>((observer) => {
      this.socket.on(events.ROOM_IS_FULL, (room: RoomInterface) => {
        observer.next(room);
      });
    });
  }

  public onWaiting(): Observable<RoomInterface> {
    return new Observable<RoomInterface>( (observer) => {
      this.socket.on(events.WAITING, (room: RoomInterface) => {
        observer.next(room);
      });
    });
  }

  public onCancelRoom(): Observable<RoomInterface> {
    return new Observable<RoomInterface>( (observer) => {
      this.socket.on(events.CANCEL_ROOM, (room: RoomInterface) => {
        observer.next(room);
      });
    });
  }

  public onGameListReload(): Observable<RoomInterface> {
    return new Observable<RoomInterface>( (observer) => {
      this.socket.on(events.GAME_LIST_RELOAD, (room: RoomInterface) => {
        observer.next(room);
      });
    });
  }

  public onDifferenceFound(): Observable<ClickManagerInterface> {
    return new Observable<ClickManagerInterface>( (observer) => {
      this.socket.on(events.DIFFERENCE_FOUND, (clickManager: ClickManagerInterface) => {
        observer.next(clickManager);
      });
    });
  }

  public onErrorFound(): Observable<ClickManagerInterface> {
    return new Observable<ClickManagerInterface>( (observer) => {
      this.socket.on(events.ERROR_FOUND, (clickManager: ClickManagerInterface) => {
        observer.next(clickManager);
      });
    });
  }

  public onGameDeleted(): Observable<string> {
    return new Observable<string>( (observer) => {
      this.socket.on(events.GAME_DELETED, (gameName: string) => {
        observer.next(gameName);
      });
    });
  }

  public onNewCard(): Observable<string> {
    return new Observable<string>( (observer) => {
      this.socket.on(events.NEW_CARD, (gameName: string) => {
        observer.next(gameName);
      });
    });
  }

  public onNoMoreRooms(): Observable<RoomInterface> {
    return new Observable<RoomInterface>( (observer) => {
      this.socket.on(events.NO_MORE_ROOMS, (room: RoomInterface) => {
        observer.next(room);
      });
    });
  }

  public emitWaitingOpponent(gameName: string, user: string, isSimpleGame: boolean): void {
    this.socket.emit(events.WAITING_OPPONENT, gameName, user, isSimpleGame);
  }

  public emitCreateRoom(gameName: string, user: string, isSimpleGame: boolean): void {
    this.socket.emit(events.CREATE_ROOM, gameName, user, isSimpleGame);
  }

  public emitCancelRoom(gameName: string): void {
    this.socket.emit(events.CANCEL_ROOM, gameName);
  }

  public emitGameListReload(): void {
    this.socket.emit(events.GAME_LIST_RELOAD);
  }

  public emitGameStarted(gameName: string, player: string): void {
    this.socket.emit(events.GAME_STARTED, gameName, player);
  }

  public emitSimpleViewClickDetected(gameName: string, userName: string, click: ClickEvent): void {
    this.socket.emit(events.SIMPLE_VIEW_CLICK_ENTERED, gameName, userName, click);
  }

  public emitFreeViewClickDetected(gameName: string, userName: string, object: THREE.Object3D, click: ClickEvent): void {
    this.socket.emit(events.FREE_VIEW_CLICK_ENTERED, gameName, userName, object, click);
  }

  public sendMessageToRoom(roomName: string, message: string): void {
    this.socket.emit(events.SEND_MESSAGE_TO_ROOM, roomName, message);
  }

  public emitGameEnded(gameName: string, player: string): void {
    this.socket.emit(events.GAME_ENDED, gameName, player);
  }

}
