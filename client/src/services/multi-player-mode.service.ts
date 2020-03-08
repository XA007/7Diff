import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import Swal from "sweetalert2";
import {ClickEvent} from "../../../common/ClickEvent";
import {ClickManagerInterface} from "../../../common/ClickManagerInterface";
import {Coordinate} from "../../../common/Coordinate";
import {Pixel} from "../../../common/Pixel";
import {TimeModel} from "../Models/Time-Model";
import {SimpleMultiplayerGame} from "../Models/simpleMultiplayerGame";
import {SERVER_URL} from "./constants/Connections";
import {GameConst} from "./constants/gameConst";
import {ImageProcessingService} from "./image-processing.service";
import {SimpleGameDbManagerService} from "./simplegame-dbmanager.service";
import {SocketClientService} from "./socket-client.service";
import {SoundService} from "./sound.service";
import {TimerService} from "./timer.service";

@Injectable({
  providedIn: "root",
})
export class MultiPlayerModeService {

  private multiPlayer: SimpleMultiplayerGame;
  private ioConnection: Subscription;
  private timerObs: Subscription;

  public constructor(private socketClientService: SocketClientService,
                     private sound: SoundService,
                     private imgService: ImageProcessingService,
                     private timer: TimerService,
                     private router: Router,
                     private simpleGameDBManager: SimpleGameDbManagerService, ) {
  }

  private static getPixelCoordinateInCanvas(pixel: Pixel): Coordinate {
    const canvasOffset: number = 1;
    const canvasHeight: number = 480;

    return { x: pixel.coordinate.x,
             y: canvasHeight - canvasOffset - pixel.coordinate.y,
    };
  }

  private static addDateToMessage(message: string): string {
    const date: Date = new Date();
    const dateText: string = date.toTimeString().split(" ")[0];

    return dateText + " " + message;
  }

  private static createMessage(position: string, username: string, gameName: string, soloMode: boolean): string {
    let message: string = username + " gets the new ";
    const FIRST: string = "1";
    const SECOND: string = "2";
    const THIRD: string = "3";
    switch (position) {
      case FIRST: message += "first position "; break;
      case SECOND: message += "second position "; break;
      case THIRD: message += "third position "; break;
      default: break;
    }
    message += "in the leaderBoard of ";
    message += gameName;
    message += " in ";
    message += soloMode ? " solo mode. 🎊🎉" : " multiPlayer mode. 🎊🎉";

    return message;
  }

  public initializeGame(simpleGame: SimpleMultiplayerGame): void {
    this.initializeData(simpleGame);
    this.buildGame();
    this.manageDifferenceFound();
    this.manageErrorFound();
  }

  public createMultiPlayerGame(gameName: string, username: string, btnName: string, isSimpleGame: boolean): void {
    (btnName === "Create") ?
      this.socketClientService.emitCreateRoom(gameName, username, isSimpleGame) :
      this.socketClientService.emitWaitingOpponent(gameName, username, isSimpleGame);
  }

  public manageClick(event: ClickEvent): void {
    const isPlayerClickingTooFast: boolean = event.timeStamp < 1;
    isPlayerClickingTooFast ? this.wrongClick(event.clientX, event.clientY) : this.clickedInAnAcceptableTimeInterval(event);
  }

  public startTimer(): void {
    this.timer.resetTimer();
    this.timerObs = this.timer.startTimer().subscribe((time: TimeModel) => {
      this.multiPlayer.game.timer = time.timerMMSS;
    });
  }

  private initializeData(game: SimpleMultiplayerGame): void {
    this.multiPlayer = game;
    this.socketClientService.emitGameStarted(this.multiPlayer.game.gameName, this.multiPlayer.game.player.username);
  }

  private restorePixels(clickManager: ClickManagerInterface): void {
    clickManager.pixels.forEach( (pix: Pixel) => {
      const coordinate: Coordinate = MultiPlayerModeService.getPixelCoordinateInCanvas(pix);
      this.imgService.restorPixels(this.multiPlayer.canvasModified.nativeElement.getContext("2d"), coordinate, pix.color);
    });
  }

  private manageDifferenceFound(): void {
    this.ioConnection = this.socketClientService.onDifferenceFound()
      .subscribe( (clickManager: ClickManagerInterface) => {
        if (clickManager.room.players.includes(this.multiPlayer.game.player.username)) {
          const message: string = "Difference found by : " + clickManager.player + " ! 👏";
          this.socketClientService.sendMessageToRoom(clickManager.room.name, MultiPlayerModeService.addDateToMessage(message));
          this.restorePixels(clickManager);
          this.sound.winClick();
          clickManager.player === this.multiPlayer.game.player.username ? this.incrementUserScore() : this.incrementOpponentScore();
          this.verifyGameState();
        }
      });
  }

  private manageErrorFound(): void {
    this.ioConnection = this.socketClientService.onErrorFound()
      .subscribe( (clickManager: ClickManagerInterface) => {
        if (clickManager.player === this.multiPlayer.game.opponent.username) {
          const message: string = " Not the right one ... 🙊";
          this.socketClientService.sendMessageToRoom(clickManager.room.name, MultiPlayerModeService.addDateToMessage(message));
        } else if (clickManager.player === this.multiPlayer.game.player.username) {
          this.wrongClick(clickManager.clickX, clickManager.clickY);
        }
      });
  }

  private verifyGameState(): void {
    if ( this.multiPlayer.game.player.score === GameConst.MAX_SCORE_MULTIPLAYER_MODE ) {
      this.simpleGameDBManager.updateLeaderboard(this.multiPlayer.game.gameName,
                                                 this.multiPlayer.game.player.username, this.multiPlayer.game.timer, true)
        .then( (position: string) => {
          if (position !== "0") {
            const message: string =
              MultiPlayerModeService.createMessage(position, this.multiPlayer.game.player.username, this.multiPlayer.game.gameName, false);
            this.socketClientService.send(MultiPlayerModeService.addDateToMessage(message));
          }
        });
      this.playerSuccessRoutine();
    } else if ( this.multiPlayer.game.opponent.score === GameConst.MAX_SCORE_MULTIPLAYER_MODE ) {
      this.playerFailureRoutine();
    }
  }

  private playerSuccessRoutine(): void {
    const title: string = "Good job! 🙌";
    const message: string = "You've won the game against " + this.multiPlayer.game.opponent.username;
    this.endGameRoutine(title, message, true);
    this.sound.applause();
  }

  private playerFailureRoutine(): void {
    const title: string = "😤";
    const message: string = "You've lost the game against " + this.multiPlayer.game.opponent.username;
    this.endGameRoutine(title, message, false);
    this.sound.youLost();
  }

  private endGameRoutine(title: string, message: string, won: boolean): void {
    clearInterval(this.timer.interval);
    Swal.fire({
        title: "<span style='font-family: Roboto, Arial, sans-serif'>" + title + "</span>",
        html: "<span style='font-family: Roboto, Arial, sans-serif'>" + message + "</span>",
        type: (won) ? "success" : "info",
    }).then(() => {
      this.router.navigate(["home/" + this.multiPlayer.game.player.username])
        .then((confirmed) => { if (confirmed) { this.onTheEnd(); }})
        .catch((err) => console.error(err));
    });
  }

  private onTheEnd(): void {
    this.unsubscribe();
    window.location.reload();
    this.socketClientService.emitGameEnded(this.multiPlayer.game.gameName, this.multiPlayer.game.player.username);
  }

  private wrongClick(clientX: number, clientY: number): void {
    this.showErrorBanner(clientX, clientY);
    this.sound.wrongClick();
  }

  private clickedInAnAcceptableTimeInterval(event: ClickEvent): void {
    this.socketClientService.emitSimpleViewClickDetected(this.multiPlayer.game.gameName,
                                                         this.multiPlayer.game.player.username,
                                                         event);
  }

  private showErrorBanner(clientX: number, clientY: number): void {
    this.defineErrorTagStyle(clientX, clientY);
    const ONE_SECOND: number = 1000;
    setTimeout(() => {
      this.multiPlayer.error.nativeElement.style.display = "none";
      this.multiPlayer.gameView.nativeElement.style.cursor = "";
    },         ONE_SECOND);
  }

  private defineErrorTagStyle(x: number, y: number): void {
    const Y_OFFSET: number = 15;
    this.multiPlayer.error.nativeElement.style.display = "block";
    this.multiPlayer.error.nativeElement.style.left = x + "px";
    this.multiPlayer.error.nativeElement.style.top = (y - Y_OFFSET) + "px";
    this.multiPlayer.gameView.nativeElement.style.cursor = "not-allowed";
  }

  private unsubscribe(): void {
    this.ioConnection.unsubscribe();
    this.timerObs.unsubscribe();
  }

  private buildGame(): void {
    const originalImageURL: string = SERVER_URL + "/" + this.multiPlayer.game.gameName + "-originalImage.bmp";
    const modifiedImageURL: string = SERVER_URL + "/" + this.multiPlayer.game.gameName + "-modifiedImage.bmp";
    this.imgService.drawImage( originalImageURL,
                               this.multiPlayer.canvasOriginal.nativeElement);
    this.imgService.drawImage( modifiedImageURL,
                               this.multiPlayer.canvasModified.nativeElement);
  }

  private incrementUserScore(): void {
    if (this.multiPlayer.game.player.score < GameConst.MAX_SCORE_MULTIPLAYER_MODE) { this.multiPlayer.game.player.score++; }
  }

  private incrementOpponentScore(): void {
    if (this.multiPlayer.game.opponent.score < GameConst.MAX_SCORE_MULTIPLAYER_MODE) { this.multiPlayer.game.opponent.score++; }
  }
}
