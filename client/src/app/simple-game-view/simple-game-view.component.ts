import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ClickEvent} from "../../../../common/ClickEvent";
import {GameAsset} from "../../../../common/Game-Asset";
import {SimpleGameAttributes} from "../../../../common/SimpleGameAttributes";
import {TimeModel} from "../../Models/Time-Model";
import {EventsLogService} from "../../services/events-log.service";
import {ImageProcessingService} from "../../services/image-processing.service";
import {SimpleGameService} from "../../services/simple-game.service";
import {TimerService} from "../../services/timer.service";

@Component({
  selector: "app-simple-game-view",
  templateUrl: "./simple-game-view.component.html",
  styleUrls: ["./simple-game-view.component.css"],
})
export class SimpleGameViewComponent implements OnInit, AfterViewInit, OnDestroy {
  // getting the canvas Elements
  @ViewChild("canvasOriginal") public canvasOriginal: ElementRef<HTMLCanvasElement>;
  @ViewChild("canvasModified") public canvasModified: ElementRef<HTMLCanvasElement>;
  @ViewChild("gamView") public gameView: ElementRef<HTMLDivElement>;
  @ViewChild("error") public error: ElementRef<HTMLDivElement>;
  // game data
  public ifGameAssetReady: Promise<GameAsset>;
  public game: SimpleGameAttributes;
  public showLoader: boolean;
  private _subscription: Subscription;

  public constructor(private route: ActivatedRoute,
                     private simpleGameService: SimpleGameService,
                     private imgService: ImageProcessingService,
                     private eventsService: EventsLogService,
                     private timer: TimerService,
  ) {
    this.showLoader = true;
  }

  public ngOnInit(): void {
    this.initializeGame();
  }

  public ngAfterViewInit(): void {
    this.ifGameAssetReady.then( (gameAsset: GameAsset) => {
      this.startGame(gameAsset);
    }).catch();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public receiveClickEvent(event: ClickEvent): void {
    this.simpleGameService.manageClick(this.canvasModified.nativeElement, event, this.game.chronoValue);
  }

  public startGame(gameAsset: GameAsset): void {
    this.buildGame(gameAsset);
    this.startRoutineMessages();
    const timeToLoadInMs: number = 3000;
    setTimeout(() => {
      this.showLoader = false;
      this.startTimer();
    },         timeToLoadInMs);
  }

  public startRoutineMessages(): void {
    const greetUser: string = "- Hi ✋ " + this.game.userName + " we hope you are doing well";
    this.eventsService.getPersonalMessage(greetUser);
    const explainGame: string = "- Your mission is to spot 7 differences between the two images.";
    this.eventsService.getPersonalMessage(explainGame);
    const explainGameTwo: string = "- And yes you can click on both 🌆 🌇.";
    this.eventsService.getPersonalMessage(explainGameTwo);
    const goodLuck: string = "- GoodLuck ✊";
    this.eventsService.getPersonalMessage(goodLuck);
  }

  public startTimer(): void {
    this.timer.resetTimer();
    this._subscription = this.timer.startTimer().subscribe((time: TimeModel) => {
      this.game.chronoValue = time.timerMMSS;
    });
  }

  public buildGame(gameAsset: GameAsset): void {
    this.game.soloMode = gameAsset.gameCard.soloMode;
    this.imgService.drawImage( gameAsset.originalImage.url, this.canvasOriginal.nativeElement);
    this.imgService.drawImage( gameAsset.modifiedImage.url, this.canvasModified.nativeElement);
  }

  public initializeGame(): void {
    this.gameView.nativeElement.style.display = "none";
    const startTime: string = "00 : 00";
    this.game = {
      userName: this.route.snapshot.params["username"],
      gameName: this.route.snapshot.params["gameName"],
      eventsLog: this.eventsService.getEventMessage(),
      chronoValue: startTime,
      soloMode: null,
    };
    this.simpleGameService.initializeData(this.game, this.gameView, this.error);
    this.ifGameAssetReady = this.simpleGameService.getGameAssets();
  }

  @HostListener("window:unload")
  public unsubscribeFromTimer(): void {
    this._subscription.unsubscribe();
  }
}
