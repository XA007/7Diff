import {ElementRef, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {ClickEvent} from "../../../common/ClickEvent";
import {Coordinate} from "../../../common/Coordinate";
import {GameAsset} from "../../../common/Game-Asset";
import {Pixel} from "../../../common/Pixel";
import {SimpleGameAttributes} from "../../../common/SimpleGameAttributes";
import {EventsLogService} from "./events-log.service";
import {ImageProcessingService} from "./image-processing.service";
import {SimpleGameDbManagerService} from "./simplegame-dbmanager.service";
import {SoundService} from "./sound.service";
import {TimerService} from "./timer.service";

@Injectable({
  providedIn: "root",
})
export class SimpleGameService {

  public readonly GAME_FINISHED: number = 7;
  public gameView: ElementRef<HTMLDivElement>;
  public error: ElementRef<HTMLDivElement>;
  public score: number;
  public gameName: string;
  public userName: string;
  public gameState: boolean[];

  public constructor(private imgService: ImageProcessingService,
                     private simpleGameDBManager: SimpleGameDbManagerService,
                     public timeService: TimerService,
                     private eventsLogService: EventsLogService,
                     private router: Router,
                     private sound: SoundService) {
    this.score = 0;
    this.gameName = "";
    this.userName = "";
    const isFound: boolean = false;
    this.gameState = [isFound, isFound, isFound, isFound, isFound, isFound, isFound];
  }

  private static getPixelCoordinateInCanvas(pixel: Pixel): Coordinate {
    const canvasOffset: number = 1;
    const canvasHeight: number = 480;

    return { x: pixel.coordinate.x,
             y: canvasHeight - canvasOffset - pixel.coordinate.y,
    };
  }

  public manageClick(modifiedCanvas: HTMLCanvasElement,
                     click: ClickEvent,
                     timeStamp: string, ): void {
    const isHeCheating: boolean = click.timeStamp < 1;
    if (isHeCheating) {
      this.stopClickingTooFast();
      this.unSuccessfulClickRoutine(click);
    } else {
      const context: CanvasRenderingContext2D = modifiedCanvas.getContext("2d");
      const pixelGroup: Pixel[] = this.getPixelGroupFromServer(click.offsetX, click.offsetY);
      const timeout: number = 100;
      setTimeout(() => {
          pixelGroup.length ? this.upDateGameState(click, timeStamp, pixelGroup, context) : this.unSuccessfulClickRoutine(click);
        }
        ,        timeout);
    }
  }

  public manageErrorClick(click: ClickEvent): void {
    this.defineErrorTagStyle(click.clientX, click.clientY);
    const ONE_SECOND: number = 1000;
    setTimeout(() => {
      this.error.nativeElement.style.display = "none";
      this.gameView.nativeElement.style.cursor = "";
    },         ONE_SECOND);
  }

  private defineErrorTagStyle(x: number, y: number): void {
    const Y_OFFSET: number = 15;
    this.error.nativeElement.style.display = "block";
    this.error.nativeElement.style.left = x + "px";
    this.error.nativeElement.style.top = (y - Y_OFFSET) + "px";
    this.gameView.nativeElement.style.cursor = "not-allowed";
  }

  public getGameAssets(): Promise<GameAsset> {
    return new Promise( (resolve) => {
      this.simpleGameDBManager.getSimpleGameByName(this.gameName).subscribe( (game: GameAsset) => {
        resolve(game);
      });
    });
  }

  public upDateGameState(click: ClickEvent, timeStamp: string, pixelGroup: Pixel[], context: CanvasRenderingContext2D): void {
    const pixelGroupLabel: number = pixelGroup[1].label;
    if (!this.gameState[pixelGroupLabel]) {
      this.gameState[pixelGroupLabel] = true;
      this.restoreDifferences(pixelGroup, context);
      this.updateScore(timeStamp);
    } else {
      this.unSuccessfulClickRoutine(click);
    }
  }

  public getPixelGroupFromServer(x: number, y: number): Pixel[] {
    const canvasHeight: number = 480;
    const serverY: number = canvasHeight - y;
    const pixelGroup: Pixel[] = [];
    this.simpleGameDBManager.verifyCoordinates(this.gameName, x, serverY).then( (pixels) => {
      for (const pixel of pixels) {
        pixelGroup.push(pixel);
      }
    });

    return pixelGroup;
  }

  public updateScore(timestamp: string): void {
    this.score += this.score === this.GAME_FINISHED ?  0 :  1;
    if (this.score === this.GAME_FINISHED) {
      this.sound.applause();
      this.simpleGameDBManager.updateLeaderboard(this.gameName, this.userName, timestamp, false).then( (position: string) => {
        if (position !== "0") {
          this.eventsLogService.sendMessageToAll(this.createMessage(position));
        }
      }).catch((err) => {throw err; });
      clearInterval(this.timeService.interval);
      this.endGameRoutine();
    } else {
      this.sound.winClick();
      this.successfulClickMessage();
    }
  }

  public restoreDifferences(diffPixels: Pixel[], context: CanvasRenderingContext2D): void {
    diffPixels.forEach((pix) => {
      const coordinate: Coordinate = SimpleGameService.getPixelCoordinateInCanvas(pix);
      this.imgService.restorPixels(context, coordinate, pix.color);
    });
  }

  private successfulClickMessage(): void {
    const congratulate: string = "- 👊, well done 🙌";
    this.eventsLogService.getPersonalMessage(congratulate);
    const differencesLeft: number = this.GAME_FINISHED - this.score;
    if (differencesLeft > 0 ) {
      const showState: string = "- 💪 You still have " + differencesLeft + " left to finish";
      this.eventsLogService.getPersonalMessage(showState);
    }
  }

  private unSuccessfulClickRoutine(click: ClickEvent): void {
    this.manageErrorClick(click);
    this.sound.wrongClick();
    this.unSuccessfulClickMessage();
  }

  private unSuccessfulClickMessage(): void {
    const message: string = "- Error. 🙊";
    this.eventsLogService.getPersonalMessage(message);
    const showCompassion: string = "- 😤, not the right one";
    this.eventsLogService.getPersonalMessage(showCompassion);
  }

  private endGameRoutine(): void {
    const timeout: number = 1000;
    const congratulate: string = "- 🙌, you are a genius";
    this.eventsLogService.getPersonalMessage(congratulate);
    setTimeout( () => {
      Swal.fire({
        title: "<span style='font-family: Roboto, Arial, sans-serif'>Congrats, you won!</span>",
        html: "<span style='font-family: Roboto, Arial, sans-serif'>" +
          "You beat the game! You'll be redirected to your home screen.</span>",
        type: "success",
      }).then( () => {
        this.router.navigate(["home/" + this.userName]).then( () => {
          window.location.reload();
        });
      });
      },        timeout);

  }

  private stopClickingTooFast(): void {
    const message: string = "- 🙈 Stop Clicking Too Fast, it won't help.";
    this.eventsLogService.getPersonalMessage(message);
  }

  /**
   *
   * @param game
   * @param gameView
   * @param error
   */
  public initializeData(game: SimpleGameAttributes,
                        gameView: ElementRef<HTMLDivElement>,
                        error: ElementRef<HTMLDivElement>): void {
    this.gameName = game.gameName;
    this.userName = game.userName;
    this.gameView = gameView;
    this.error = error;
  }

  private createMessage(position: string): string {
    let message: string = this.userName + " gets the new ";
    switch (position) {
      case "1":
        message += "first position ";
        break;
      case "2":
        message += "second position ";
        break;
      case "3":
        message += "third position ";
        break;
      default:
        break;
    }
    message += "in the leaderBoard of ";
    message += this.gameName;
    message += " in solo mode. 🎊🎉";

    return message;
  }
}
