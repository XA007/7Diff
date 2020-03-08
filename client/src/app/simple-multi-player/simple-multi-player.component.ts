import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ClickEvent} from "../../../../common/ClickEvent";
import {GameAsset} from "../../../../common/Game-Asset";
import {SimpleMultiplayerGame} from "../../Models/simpleMultiplayerGame";
import {EventsLogService} from "../../services/events-log.service";
import {MultiPlayerModeService} from "../../services/multi-player-mode.service";
import {SimpleGameDbManagerService} from "../../services/simplegame-dbmanager.service";

@Component({
  selector: "app-simple-multi-player",
  templateUrl: "./simple-multi-player.component.html",
  styleUrls: ["./simple-multi-player.component.css"],
})
export class SimpleMultiPlayerComponent implements OnInit {

  // Getting the needed Html Elements
  @ViewChild("canvasOriginal") public canvasOriginal: ElementRef<HTMLCanvasElement>;
  @ViewChild("canvasModified") public canvasModified: ElementRef<HTMLCanvasElement>;
  @ViewChild("gamView") public gameView: ElementRef<HTMLDivElement>;
  @ViewChild("error") public error: ElementRef<HTMLDivElement>;

  public isReady: boolean;
  public simpleGame: SimpleMultiplayerGame;

  public constructor(private route: ActivatedRoute,
                     private multiPlayer: MultiPlayerModeService,
                     private eventsLog: EventsLogService,
                     private simpleGameDBManager: SimpleGameDbManagerService) {
  }

  private initGameData(): void {
    this.simpleGame = {
      game: {
        gameName: this.route.snapshot.params["gamename"],
        player: {username: this.route.snapshot.params["player"], score: 0},
        opponent: {username: this.route.snapshot.params["opponent"], score: 0},
        eventsLog: this.eventsLog.getEventMessage(),
        timer: "00 : 00",
        leaderBoard: [],
      },
      canvasOriginal: this.canvasOriginal,
      canvasModified: this.canvasModified,
      gameView: this.gameView,
      error: this.error,
    };
    this.simpleGameDBManager.getSimpleGameByName(this.simpleGame.game.gameName).subscribe( (gameAsset: GameAsset) => {
      this.simpleGame.game.leaderBoard = gameAsset.gameCard.multiPlayer;
    });
  }

  public ngOnInit(): void {
    this.initGameData();
    this.multiPlayer.initializeGame(this.simpleGame);
    this.isReady = false;
    const timeToLoad: number = 2000;
    setTimeout(() => {
      this.isReady = true;
      this.multiPlayer.startTimer();
       },      timeToLoad);
  }

  public receiveClickEvent(event: ClickEvent): void {
    this.multiPlayer.manageClick(event);
  }
}
