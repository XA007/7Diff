import {Injectable} from "@angular/core";
import {Subscription} from "rxjs";
import {GameCard} from "../../../common/Game-Card";
import {RoomInterface} from "../../../common/RoomInterface";
import {FreeGameDbManagerService} from "./freegame-dbmanager.service";
import {SimpleGameDbManagerService} from "./simplegame-dbmanager.service";
import {SocketClientService} from "./socket-client.service";

@Injectable({
  providedIn: "root",
})

export class GameListService {

  public simpleViewGames: GameCard[];
  public freeViewGames: GameCard[];
  public ioConnection: Subscription;

  public constructor(private simpleGameDBManager: SimpleGameDbManagerService,
                     private freeGameDBManager: FreeGameDbManagerService,
                     private socketService: SocketClientService) {
    this.simpleViewGames = [];
    this.freeViewGames = [];
    this.generateSimpleView();
    this.generateFreeView();
    this.updateToJoinButton();
    this.updateToCreateButton();
    this.socketService.emitGameListReload();
    this.updateWaitingGamesButton();
    this.manageNoMoreRooms();
  }

  public generateSimpleView(): void {
      this.simpleGameDBManager.getSimpleGames().subscribe((games) => {
        for (const game of games) {
          this.simpleViewGames.push(game);
        }
      });
  }

  public generateFreeView(): void {
    this.freeGameDBManager.getFreeGames().subscribe((games) => {
      for (const game of games) {
        this.freeViewGames.push(game);
      }
    });
  }

  public updateToJoinButton(): void {
    this.ioConnection = this.socketService.onWaiting()
      .subscribe((room: RoomInterface) => {
        if (room.isSimpleGame) {
          for (const game of this.simpleViewGames) {
            if (room.name.includes(game.name)) {
              game.multiPlayerButtonName = "Join";
            }
          }
        } else {
          for (const game of this.freeViewGames) {
            if (room.name.includes(game.name)) {
              game.multiPlayerButtonName = "Join";
            }
          }
        }
      });
  }

  public updateToCreateButton(): void {
    this.ioConnection = this.socketService.onCancelRoom()
      .subscribe((room: RoomInterface) => {
        if (room.isSimpleGame) {
          for (const game of this.simpleViewGames) {
            if (room.gameName === game.name) {
              game.multiPlayerButtonName = "Create";
            }
          }
        } else {
          for (const game of this.freeViewGames) {
            if (room.gameName === game.name) {
              game.multiPlayerButtonName = "Create";
            }
          }
        }
      });
  }

  public updateWaitingGamesButton(): void {
    this.ioConnection = this.socketService.onGameListReload()
      .subscribe((room: RoomInterface) => {
        if (room.isSimpleGame) {
          for (const game of this.simpleViewGames) {
            if (room.gameName === game.name) {
              game.multiPlayerButtonName = "Join";
            }
          }
        } else {
          for (const game of this.freeViewGames) {
            if (room.gameName === game.name) {
              game.multiPlayerButtonName = "Join";
            }
          }
        }
      });
  }

  public manageNoMoreRooms(): void {
    this.socketService.onNoMoreRooms().subscribe( (room: RoomInterface) => {
      if (room.isSimpleGame) {
        for (const game of this.simpleViewGames) {
          if (room.gameName === game.name) {
            game.multiPlayerButtonName = "Create";
          }
        }
      } else {
        for (const game of this.freeViewGames) {
          if (room.gameName === game.name) {
            game.multiPlayerButtonName = "Create";
          }
        }
      }
    });
  }
}
