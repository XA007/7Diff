import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import * as THREE from "three";
import {ClickEvent} from "../../../../common/ClickEvent";
import {GameCard} from "../../../../common/Game-Card";
import {FreeMultiPlayerGame} from "../../Models/FreeMultiPlayerGame";
import {FreeGameConst} from "../../services/constants/free-Game-Const";
import {EventsLogService} from "../../services/events-log.service";
import {FreeGameDbManagerService} from "../../services/freegame-dbmanager.service";
import {FreeViewMultiPlayerService} from "../../services/freeview-multiplayer.service";

@Component({
  selector: "app-free-multi-player",
  templateUrl: "./free-multi-player.component.html",
  styleUrls: ["./free-multi-player.component.css"],
})
export class FreeMultiPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("canvasOriginal") public canvasOriginal: ElementRef<HTMLCanvasElement>;
  @ViewChild("gamView") public gameView: ElementRef<HTMLDivElement>;
  @ViewChild("error") public error: ElementRef<HTMLDivElement>;

  public isReady: boolean;
  public multiPlayer: FreeMultiPlayerGame;
  public scene: THREE.Scene;
  public camera: THREE.OrthographicCamera;
  public mouse: THREE.Vector2;
  public raycaster: THREE.Raycaster;
  public renderer: THREE.WebGLRenderer;
  public loader: THREE.ObjectLoader;
  public ifGameCardReady: Promise<GameCard>;

  public constructor(private route: ActivatedRoute,
                     private eventsLog: EventsLogService,
                     public multiPlayerService: FreeViewMultiPlayerService,
                     public freeGameDBManager: FreeGameDbManagerService, ) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-FreeGameConst.WIDTH_RATIO, FreeGameConst.WIDTH_RATIO, FreeGameConst.HEIGHT_RATIO,
                                               -FreeGameConst.HEIGHT_RATIO, FreeGameConst.NEAR, FreeGameConst.FRUSTUM_SIZE);
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.loader = new THREE.ObjectLoader();
  }

  private initGameData(): void {
    this.multiPlayer = {
      game: {
        gameName: this.route.snapshot.params["gamename"],
        player: {username: this.route.snapshot.params["player"], score: 0},
        opponent: {username: this.route.snapshot.params["opponent"], score: 0},
        eventsLog: this.eventsLog.getEventMessage(),
        timer: "00:00",
        leaderBoard: [],
      },
      canvasOriginal: this.canvasOriginal,
      gameView: this.gameView,
      error: this.error,
    };
    this.ifGameCardReady = this.freeGameDBManager.getFreeGameByName(this.multiPlayer.game.gameName);
    this.ifGameCardReady.then( (game: GameCard) => {
      this.multiPlayer.game.leaderBoard = game.multiPlayer;
    });
  }

  public ngOnInit(): void {
    this.isReady = false;
    this.initGameData();
    this.multiPlayerService.initGameData(this.multiPlayer);
  }

  public appendRendererToDom(): void {
    const heightOfTheScene: number = 500;
    this.renderer.setSize(window.innerWidth,  heightOfTheScene);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  public startGame(): void {
    this.multiPlayerService.startGame(this.multiPlayer.game.gameName, this.scene, this.camera,
                                      this.renderer, this.raycaster, this.mouse).catch();
    this.multiPlayerService.startTimer();
    this.appendRendererToDom();
  }

  @HostListener("window:keyup", ["$event"])
  public keyEvent(event: KeyboardEvent): void {
    this.multiPlayerService.manageCheatMode(event.key);
  }

  public receiveClickEvent(event: ClickEvent): void {
    this.multiPlayerService.manageClick(event, this.multiPlayer.game.gameName,
                                        this.multiPlayer.game.player.username);
  }

  @HostListener("document:mousemove", ["$event"])
  public onDocumentMouseMove(event: MouseEvent): void {
    const TWO: number = 2;
    const ONE: number = 1;
    event.preventDefault();
    this.mouse.x = ( event.clientX / (this.renderer.getSize().width) ) * TWO - ONE;
    this.mouse.y = - ( event.offsetY / this.renderer.getSize().height ) * TWO + ONE;
  }

  public ngAfterViewInit(): void {
    this.renderer = new THREE.WebGLRenderer({canvas: this.multiPlayer.canvasOriginal.nativeElement});
    this.ifGameCardReady.then(() => {
      this.isReady = true;
      const NICE_BLUE: number = 0x2FA7E9;
      this.renderer.setClearColor(NICE_BLUE);
      this.startGame();
    }).catch();

  }

  public ngOnDestroy(): void {
    this.multiPlayerService.cheatModeSound.pause();
    clearInterval(this.multiPlayerService.interval);
    this.multiPlayerService.restoreObjects();
  }

}
