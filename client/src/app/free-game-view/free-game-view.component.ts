import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import { FreeGameViewService } from "src/services/free-game-view.service";
import * as THREE from "three";
import {ClickEvent} from "../../../../common/ClickEvent";
import {GameCard} from "../../../../common/Game-Card";
import {SimpleGameAttributes} from "../../../../common/SimpleGameAttributes";
import {TimeModel} from "../../Models/Time-Model";
import {FreeGameConst} from "../../services/constants/free-Game-Const";
import {EventsLogService} from "../../services/events-log.service";
import {FreeGameDbManagerService} from "../../services/freegame-dbmanager.service";
import {TimerService} from "../../services/timer.service";

@Component({
  selector: "app-free-game-view",
  templateUrl: "./free-game-view.component.html",
  styleUrls: ["./free-game-view.component.css"],
})

export class FreeGameViewComponent implements OnInit, AfterViewInit, OnDestroy {
  public scene: THREE.Scene;
  public camera: THREE.OrthographicCamera;
  public mouse: THREE.Vector2;
  public raycaster: THREE.Raycaster;
  public renderer: THREE.WebGLRenderer;
  public loader: THREE.ObjectLoader;
  public game: SimpleGameAttributes;
  public ifGameCardReady: Promise<GameCard>;
  public showLoader: boolean;

  @ViewChild("canvasOriginal") public canvasOriginal: ElementRef<HTMLCanvasElement>;
  @ViewChild("gamView") public gameView: ElementRef<HTMLDivElement>;
  @ViewChild("error") public error: ElementRef<HTMLDivElement>;

  public constructor(public freeGameView: FreeGameViewService,
                     public eventsService: EventsLogService,
                     public route: ActivatedRoute,
                     public freeGameDBManager: FreeGameDbManagerService,
                     public timer: TimerService) {

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-FreeGameConst.WIDTH_RATIO, FreeGameConst.WIDTH_RATIO, FreeGameConst.HEIGHT_RATIO,
                                               -FreeGameConst.HEIGHT_RATIO, FreeGameConst.NEAR, FreeGameConst.FRUSTUM_SIZE);
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.loader = new THREE.ObjectLoader();
    this.showLoader = true;
   }

  public ngOnInit(): void {
    this.gameView.nativeElement.style.display = "none";
    this.game = {
      userName: this.route.snapshot.params["username"],
      gameName: this.route.snapshot.params["gameName"],
      eventsLog: this.eventsService.getEventMessage(),
      chronoValue: "00:00",
      soloMode: null,
    };
    this.ifGameCardReady = this.freeGameDBManager.getFreeGameByName(this.game.gameName);
  }

  public appendRendererToDom(): void {
    const heightOfTheScene: number = 500;
    this.renderer.setSize(window.innerWidth,  heightOfTheScene);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  public startGame(): void {
    this.freeGameView.startGame(this.game.gameName, this.scene, this.camera, this.renderer, this.raycaster, this.mouse).catch();
    this.appendRendererToDom();
  }

  @HostListener("window:keyup", ["$event"])
  public keyEvent(event: KeyboardEvent): void {
    this.freeGameView.manageCheatMode(event.key);
  }

  public receiveClickEvent(event: ClickEvent): void {
      this.freeGameView.manageClick(event, this.error, this.canvasOriginal, this.game.gameName, this.game.userName, this.game.chronoValue);
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
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasOriginal.nativeElement});
    this.ifGameCardReady.then((gameCard: GameCard) => {
      this.game.soloMode = gameCard.soloMode;
      const NICE_BLUE: number = 0x2FA7E9;
      this.renderer.setClearColor(NICE_BLUE);
      this.startGame();
      const timeToLoadInMs: number = 1500;
      setTimeout(() => {
        this.showLoader = false;
        this.gameView.nativeElement.style.display = "block";
        this.timer.resetTimer();
        this.timer.startTimer().subscribe((time: TimeModel) => {
          this.game.chronoValue = time.timerMMSS;
        });
      },         timeToLoadInMs);    }).catch();

  }

  public ngOnDestroy(): void {
    this.freeGameView.cheatModeSound.pause();
    clearInterval(this.freeGameView.interval);
    this.freeGameView.restoreObjects();
  }
}
