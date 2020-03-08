import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import Swal from "sweetalert2";
import * as THREE from "three";
import {ClickEvent} from "../../../common/ClickEvent";
import {ClickManagerInterface} from "../../../common/ClickManagerInterface";
import {FreeMultiPlayerGame} from "../Models/FreeMultiPlayerGame";
import {TimeModel} from "../Models/Time-Model";
import {GameConst} from "./constants/gameConst";
import {FreeGameViewService} from "./free-game-view.service";
import {FreeGameService} from "./free-game.service";
import {FreeGameDbManagerService} from "./freegame-dbmanager.service";
import {SocketClientService} from "./socket-client.service";
import {SoundService} from "./sound.service";
import {TimerService} from "./timer.service";

@Injectable({
  providedIn: "root",
})

export class FreeViewMultiPlayerService {

  public storedObjectArray: THREE.Object3D[] = [];
  public isHovering: boolean;
  public currentObject: THREE.Object3D;
  public score: number;
  public cheatModeSound: HTMLAudioElement;
  public cheatMode: boolean = false;
  public interval: number;
  public multiPlayerGame: FreeMultiPlayerGame;
  public timerObs: Subscription;

  public constructor(private freeGameService: FreeGameService, private socketService: SocketClientService, private timer: TimerService,
                     private sound: SoundService, private freeGameDBManager: FreeGameDbManagerService, private router: Router,
                     private freeGameView: FreeGameViewService) {
    this.score = 0;
    this.cheatModeSound = new Audio("/../../assets/sounds/CheatMode.mp3");
    this.manageDifferenceFound();
    this.manageErrorFound();
  }

  private static addDateToMessage(message: string): string {
    const date: Date = new Date();
    const dateText: string = date.toTimeString().split(" ")[0];

    return dateText + " " + message;
  }

  public startTimer(): void {
    this.timer.resetTimer();
    this.timerObs = this.timer.startTimer().subscribe((time: TimeModel) => {
      this.multiPlayerGame.game.timer = time.timerMMSS;
    });
  }

  public initGameData(game: FreeMultiPlayerGame): void {
    this.multiPlayerGame = game;
    this.socketService.emitGameStarted(this.multiPlayerGame.game.gameName, this.multiPlayerGame.game.player.username);
  }

  public manageDifferenceFound(): void {
    this.socketService.onDifferenceFound().subscribe( (clickManager: ClickManagerInterface) => {
      if (clickManager.room.players.includes(this.multiPlayerGame.game.player.username)) {
        if (clickManager.objectName !== "found") {
          const object: THREE.Object3D = this.storedObjectArray.filter(
            (obj: THREE.Object3D) => obj.uuid === clickManager.objectuuid )[0];
          this.updateViewAfterFind(object);
          const message: string = "Difference found by : " + clickManager.player + " ! 👏";
          this.socketService.sendMessageToRoom(clickManager.room.name, FreeViewMultiPlayerService.addDateToMessage(message));
          this.sound.winClick();
          clickManager.player === this.multiPlayerGame.game.player.username ? this.incrementUserScore() : this.incrementOpponentScore();
          this.verifyGameState();
        } else {
          this.showError(clickManager.clickX, clickManager.clickY);
        }
      }
    });
  }

  public manageErrorFound(): void {
    this.socketService.onErrorFound().subscribe( (clickManager: ClickManagerInterface) => {
      if (clickManager.player === this.multiPlayerGame.game.opponent.username) {
        const message: string = " Not the right one ... 🙊";
        this.socketService.sendMessageToRoom(clickManager.room.name, FreeViewMultiPlayerService.addDateToMessage(message));
      } else if (clickManager.player === this.multiPlayerGame.game.player.username) {
        this.showError(clickManager.clickX, clickManager.clickY);
      }
    });
  }

  public animateObjects(objectArray: THREE.Object3D[], scene: THREE.Scene, camera: THREE.OrthographicCamera,
                        renderer: THREE.WebGLRenderer, raycaster: THREE.Raycaster, mouse: THREE.Vector2): void {

    const animate: Function = () => {
      requestAnimationFrame(animate as FrameRequestCallback);
      camera.lookAt(scene.position);
      camera.updateMatrixWorld(false);
      raycaster.setFromCamera(mouse, camera);
      const intersected: THREE.Intersection[] = raycaster.intersectObjects(scene.children);
      if (intersected.length > 0) {
        this.currentObject = intersected[ 0 ].object;
        this.isHovering = true;
      } else {
        this.isHovering = false;
      }
      renderer.render(scene, camera);
    };
    animate();
  }

  public startGame(gameName: string, scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer,
                   raycaster: THREE.Raycaster, mouse: THREE.Vector2): Promise<string> {
    const objectArray: THREE.Object3D[] = [];
    const newObjectArray: THREE.Object3D[] = [];
    FreeGameService.setupSceneAndCamera(scene, camera);

    return new Promise((resolve: Function) => {
      this.freeGameService.retrieveOriginalObjects(gameName).then((objects: THREE.Object3D[]) => {
        this.freeGameService.parseAndPushObjects(objects, objectArray);
      }).then(() => {
        this.freeGameService.retrieveModifiedObjects(gameName).then( (objects: THREE.Object3D[]) => {
          this.freeGameService.parseAndPushObjects(objects, newObjectArray);
        }).then(() => {
          this.freeGameService.adjustAddedObjectsPosition(newObjectArray);
          objectArray.forEach((object) => this.storedObjectArray.push(object));
          newObjectArray.forEach((object) => this.storedObjectArray.push(object));
          FreeGameService.addObjectsToScene(this.storedObjectArray, scene);
          this.animateObjects(this.storedObjectArray, scene, camera, renderer, raycaster, mouse);
          resolve(renderer.domElement.toDataURL());
        }).catch();
      }).catch();
    });
  }

  public restoreObjects(): void {
    for (const object of this.storedObjectArray) {
      if (object.name !== "" && object.name !== "remove-hidden") {
        object.layers.mask = 1;
      }
    }
  }

  public manageClick(click: ClickEvent, gameName: string, userName: string): void {
    this.socketService.emitFreeViewClickDetected(gameName, userName, this.currentObject, click);
  }

  public showError(clickX: number, clickY: number): void {
    const Y_OFFSET: number = 15;
    const ONE_SECOND: number = 1000;
    this.multiPlayerGame.error.nativeElement.style.display = "block";
    this.multiPlayerGame.error.nativeElement.style.left = clickX + "px";
    this.multiPlayerGame.error.nativeElement.style.top = (clickY - Y_OFFSET) + "px";
    this.multiPlayerGame.canvasOriginal.nativeElement.style.cursor = "not-allowed";
    this.sound.wrongClick();
    setTimeout(() => {
      this.multiPlayerGame.error.nativeElement.style.display = "none";
      this.multiPlayerGame.canvasOriginal.nativeElement.style.cursor = "";
    },         ONE_SECOND);
  }

  public updateViewAfterFind(object: THREE.Object3D): void {
    switch (object.name) {
      case "remove" : this.removeFound(object); break;
      case "remove-hidden" : this.removeHiddenFound(object); break;
      case "add" : this.addFound(object); break;
      case "color" : this.colorFound(object); break;
      default: break;
    }
  }

  public removeFound(object: THREE.Object3D): void {
    this.storedObjectArray.forEach((storedObject) => {
      if (storedObject.name === "remove-hidden" && storedObject.position.y === object.position.y) {
        storedObject.layers.mask = 1;
        object.name = "found";
        storedObject.name = "found";
      }
    });
  }

  public removeHiddenFound(object: THREE.Object3D): void {
    this.storedObjectArray.forEach((storedObject) => {
      if (storedObject.name === "remove" && storedObject.position.y === object.position.y) {
        object.layers.mask = 1;
        object.name = "found";
        storedObject.name = "found";
      }
    });
  }

  public addFound(object: THREE.Object3D): void {
    this.storedObjectArray.splice(this.storedObjectArray.indexOf(object, 0), 1);
    object.layers.mask = 0;
    object.name = "found";
  }

  public colorFound(object: THREE.Object3D): void {
    this.storedObjectArray.forEach((storedObject) => {
      if (storedObject.name === "color"
        && storedObject.position.y === object.position.y
        && storedObject.position.x !== object.position.x) {
        (object.position.x > 0)
          ? FreeGameService.applyColorFind(object, storedObject)
          : FreeGameService.applyColorFind(storedObject, object);
        object.name = "found";
        storedObject.name = "found";
      }
    });
  }

  public manageCheatMode(key: string): void {
    const INTERVAL: number = 125;
    if (key === "t" || key === "T") {
      this.cheatMode ? this.cheatMode = false : this.cheatMode = true;
      if (this.cheatMode) {
        this.cheatModeSound.play().catch((onRejection) => console.error(onRejection));
        this.interval = window.setInterval(() => {this.freeGameView.flickerObject(); }, INTERVAL);
      } else {
        this.cheatModeSound.pause();
        clearInterval(this.interval);
        this.freeGameView.restoreObjects();
      }
    }
  }

  private incrementUserScore(): void {
    if (this.multiPlayerGame.game.player.score < GameConst.MAX_SCORE_MULTIPLAYER_MODE) { this.multiPlayerGame.game.player.score++; }
  }

  private incrementOpponentScore(): void {
    if (this.multiPlayerGame.game.opponent.score < GameConst.MAX_SCORE_MULTIPLAYER_MODE) { this.multiPlayerGame.game.opponent.score++; }
  }

  private verifyGameState(): void {
    if ( this.multiPlayerGame.game.player.score === GameConst.MAX_SCORE_MULTIPLAYER_MODE ) {
      this.freeGameDBManager.updateLeaderboard(this.multiPlayerGame.game.gameName,
                                               this.multiPlayerGame.game.player.username, this.multiPlayerGame.game.timer,
                                               true)
        .then( (position: number) => {
          if (position !== 0) {
            const message: string =
              FreeGameService.createMessage(position, this.multiPlayerGame.game.player.username, this.multiPlayerGame.game.gameName, false);
            this.socketService.send(FreeViewMultiPlayerService.addDateToMessage(message));
          }
        });
      this.playerSuccessRoutine();
    } else if ( this.multiPlayerGame.game.opponent.score === GameConst.MAX_SCORE_MULTIPLAYER_MODE ) {
      this.playerFailureRoutine();
    }
  }

  private playerSuccessRoutine(): void {
    const title: string = "Good job! 🙌";
    const message: string = "You've won the game against " + this.multiPlayerGame.game.opponent.username;
    this.endGameRoutine(title, message, true);
    this.sound.applause();
  }

  private playerFailureRoutine(): void {
    const title: string = "😤";
    const message: string = "You've lost the game against " + this.multiPlayerGame.game.opponent.username;
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
      this.router.navigate(["home/" + this.multiPlayerGame.game.player.username])
        .then((confirmed) => { if (confirmed) { this.onTheEnd(); }})
        .catch((err) => console.error(err));
    });
  }

  private unsubscribe(): void {
    this.timerObs.unsubscribe();
  }

  private onTheEnd(): void {
    this.unsubscribe();
    window.location.reload();
    this.socketService.emitGameEnded(this.multiPlayerGame.game.gameName, this.multiPlayerGame.game.player.username);
  }
}
