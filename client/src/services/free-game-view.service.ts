import {ElementRef, Injectable} from "@angular/core";
import * as THREE from "three";
import {ClickEvent} from "../../../common/ClickEvent";
import {FreeGameConst} from "./constants/free-Game-Const";
import {EventsLogService} from "./events-log.service";
import {FreeGameService} from "./free-game.service";
import {GameInfoSenderService} from "./game-info-sender.service";
import {SoundService} from "./sound.service";

@Injectable({
  providedIn: "root",
})

export class FreeGameViewService {

  public readonly GAME_FINISHED: number = 7;
  public storedObjectArray: THREE.Object3D[] = [];
  public isHovering: boolean;
  public currentObject: THREE.Object3D;
  public score: number;
  public cheatModeSound: HTMLAudioElement;
  public cheatMode: boolean = false;
  public interval: number;

  public constructor(private freeGame: FreeGameService, private gameInfoSender: GameInfoSenderService,
                     private eventsLogService: EventsLogService, private sound: SoundService) {
    this.score = 0;
    this.cheatModeSound = new Audio("/../../assets/sounds/CheatMode.mp3");
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
      this.freeGame.retrieveOriginalObjects(gameName).then((objects: THREE.Object3D[]) => {
      this.freeGame.parseAndPushObjects(objects, objectArray);
      }).then(() => {
        this.freeGame.retrieveModifiedObjects(gameName).then( (objects: THREE.Object3D[]) => {
        this.freeGame.parseAndPushObjects(objects, newObjectArray);
        }).then(() => {
          this.freeGame.adjustAddedObjectsPosition(newObjectArray);
          objectArray.forEach((object) => this.storedObjectArray.push(object));
          newObjectArray.forEach((object) => this.storedObjectArray.push(object));
          FreeGameService.addObjectsToScene(this.storedObjectArray, scene);
          this.animateObjects(this.storedObjectArray, scene, camera, renderer, raycaster, mouse);
          resolve(renderer.domElement.toDataURL());
        }).catch();
      }).catch();
    });
  }

  public flickerObject(): void {
    for (const object of this.storedObjectArray) {
      switch (object.name) {
        case "remove" :  (object.layers.mask === 0) ? object.layers.mask = 1 : object.layers.mask = 0; break;
        case "add" :  (object.layers.mask === 0) ? object.layers.mask = 1 : object.layers.mask = 0; break;
        case "color" : (object.layers.mask === 0) ? object.layers.mask = 1 : object.layers.mask = 0; break;
        default: break;
      }
    }
  }

  public restoreObjects(): void {
    for (const object of this.storedObjectArray) {
      if (object.name !== "" && object.name !== "remove-hidden") {
        object.layers.mask = 1;
      }
    }
  }

  public manageClick(click: ClickEvent,
                     error: ElementRef<HTMLDivElement>,
                     canvas: ElementRef<HTMLCanvasElement>,
                     gameName: string,
                     userName: string,
                     timestamp: string): void {
      this.gameInfoSender.verifyFreeGameDifference(this.currentObject.uuid, gameName).then((result) => {
        if (result && this.currentObject.name !== "found") {
          this.updateViewAfterFind(this.currentObject);
          this.score = this.freeGame.updateScore(gameName, userName, timestamp, this.score);
          this.successfulClickMessage();
          this.sound.winClick();
        } else {
          this.showError(click, error, canvas);
        }
      }).catch();
  }

  public showError(click: ClickEvent, error: ElementRef<HTMLDivElement>, canvas: ElementRef<HTMLCanvasElement>): void {
    const Y_OFFSET: number = 15;
    const ONE_SECOND: number = 1000;
    error.nativeElement.style.display = "block";
    error.nativeElement.style.left = click.clientX + "px";
    error.nativeElement.style.top = (click.clientY - Y_OFFSET) + "px";
    canvas.nativeElement.style.cursor = "not-allowed";
    this.unSuccessfulClickMessage();
    this.sound.wrongClick();
    setTimeout(() => {
      error.nativeElement.style.display = "none";
      canvas.nativeElement.style.cursor = "";
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
    object.layers.mask = 0; object.name = "found";
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

  public createSceneVignet(gameName: string): Promise<string> {

    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.OrthographicCamera =
      new THREE.OrthographicCamera(-FreeGameConst.WIDTH_RATIO , FreeGameConst.WIDTH_RATIO, FreeGameConst.HEIGHT_RATIO,
                                   -FreeGameConst.HEIGHT_RATIO, FreeGameConst.NEAR, FreeGameConst.FRUSTUM_SIZE);
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({devicePixelRatio: window.devicePixelRatio});
    const raycaster: THREE.Raycaster = new THREE.Raycaster();
    const mouse: THREE.Vector2 = new THREE.Vector2();

    return new Promise((resolve: Function) => {
      this.startGame(gameName, scene, camera, renderer, raycaster, mouse).then((result: string) => {
        resolve(result);
      }).catch();
    });
  }

  public manageCheatMode(key: string): void {
    const INTERVAL: number = 125;
    if (key === "t" || key === "T") {
      this.cheatMode ? this.cheatMode = false : this.cheatMode = true;
      if (this.cheatMode) {
        this.cheatModeSound.play().catch((onRejection) => console.error(onRejection));
        this.interval = window.setInterval(() => {this.flickerObject(); }, INTERVAL);
      } else {
        this.cheatModeSound.pause();
        clearInterval(this.interval);
        this.restoreObjects();
      }
    }
  }

  private successfulClickMessage(): void {
    const congratulate: string = "- 👊, well done 🙌";
    this.eventsLogService.getPersonalMessage(congratulate);
    const differencesLeft: number = this.GAME_FINISHED - this.score;
    if (differencesLeft > 0) {
      const showState: string = "- 💪 You still have " + differencesLeft + " left to finish";
      this.eventsLogService.getPersonalMessage(showState);
    }
  }

  private unSuccessfulClickMessage(): void {
    const message: string = "- Error. 🙊";
    this.eventsLogService.getPersonalMessage(message);
    const showCompassion: string = "- 😤, not the right one";
    this.eventsLogService.getPersonalMessage(showCompassion);
  }
}
