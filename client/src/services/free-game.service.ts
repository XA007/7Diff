import { Injectable } from "@angular/core";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import * as THREE from "three";
import {EventsLogService} from "./events-log.service";
import {FreeGameDbManagerService} from "./freegame-dbmanager.service";
import {SoundService} from "./sound.service";
import {TimerService} from "./timer.service";

@Injectable({
  providedIn: "root",
})
export class FreeGameService {

  public constructor(private freeGameDBManager: FreeGameDbManagerService, private eventsLogService: EventsLogService,
                     public timeService: TimerService, private router: Router, private sound: SoundService) {
  }

  public static cloneObjects(objectArray: THREE.Object3D[]): THREE.Object3D[] {
    const TWO: number = 2;
    const newObjectArray: THREE.Object3D[] = [];
    for (const object of objectArray) {
      const obj: THREE.Object3D = object.clone();
      obj.position.x = object.position.x + window.innerWidth / TWO;
      newObjectArray.push(obj);
    }

    return newObjectArray;
  }

  public static addObjectsToScene(objectArray: THREE.Object3D[], scene: THREE.Scene): void {
    for (const object of objectArray) {
      scene.add(object);
    }
  }

  public static setupSceneAndCamera(scene: THREE.Scene, camera: THREE.OrthographicCamera): void {
    const WHITE: number = 0xFFFFFF;
    const AMBIENT_INTENSITY: number = 0.5;
    const POINT_INTENSITY: number = 0.8;
    const LIGHT_POSITION: number = 1000;
    const LIGHT_POSITION_Z: number = 10000;
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(WHITE, AMBIENT_INTENSITY);
    const pointLight: THREE.PointLight = new THREE.PointLight(WHITE, POINT_INTENSITY);
    pointLight.position.set(LIGHT_POSITION, LIGHT_POSITION, LIGHT_POSITION_Z);

    scene.add(ambientLight);
    camera.add(pointLight);
    scene.add(camera);
  }

  public static createMessage(position: number, username: string, gameName: string, soloMode: boolean): string {
    let message: string = username + " gets the new ";
    const SECOND: number = 2;
    const THIRD: number = 3;
    switch (position) {
      case 1: message += "first position "; break;
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

  public static windowReload(): void {
    window.location.reload();
  }

  public static applyColorFind(appliedObject: THREE.Object3D, applierObject: THREE.Object3D): void {
    const material: THREE.MeshLambertMaterial = (applierObject as THREE.Mesh).material as THREE.MeshLambertMaterial;
    const newMaterial: THREE.MeshLambertMaterial = material.clone();
    newMaterial.color.setHex(material.color.getHex());
    (appliedObject as THREE.Mesh).material = newMaterial;
  }

  public parseAndPushObjects(objects: THREE.Object3D[], objectArray: THREE.Object3D[]): void {
    const loader: THREE.ObjectLoader = new THREE.ObjectLoader();
    for (const object of objects) {
      loader.parse(object, (obj: THREE.Object3D) => {
        objectArray.push(obj);
      });
    }
  }

  public retrieveOriginalObjects(gameName: string): Promise<THREE.Object3D[]> {
    return new Promise((res) => {
      this.freeGameDBManager.getObjects(gameName + "-originalObjects.json").subscribe((objects) => {
        res(objects);
      });
    });
  }

  public retrieveModifiedObjects(gameName: string): Promise<THREE.Object3D[]> {
    return new Promise((res) => {
      this.freeGameDBManager.getObjects(gameName + "-modifiedObjects.json").subscribe((objects) => {
        res(objects);
      });
    });
  }

  public updateScore(gameName: string, userName: string, timestamp: string, score: number): number {
    const GAME_FINISHED: number = 7;
    score += score === GAME_FINISHED ? 0 : 1;
    if (score === GAME_FINISHED) {
      this.sound.applause();
      this.freeGameDBManager.updateLeaderboard(gameName, userName, timestamp, false).then((position: number) => {
        if (position !== 0) {
          this.eventsLogService.sendMessageToAll(FreeGameService.createMessage(position, userName, gameName, true));
        }
        clearInterval(this.timeService.interval);
        this.endGameRoutine(userName);
      });
    }

    return score;
  }

  public adjustAddedObjectsPosition(objectArray: THREE.Object3D[]): void {
    const TWO: number = 2;
    objectArray.forEach((item) => {
      if (item.name === "add") {
        item.position.x = item.position.x + window.innerWidth / TWO;
      }
    });
  }

  public endGameRoutine(username: string): void {
    const ONE_SECOND: number = 1000;
    setTimeout( () => {
      Swal.fire({
        title: "<span style='font-family: Roboto, Arial, sans-serif'>Congrats, you won!</span>",
        html: "<span style='font-family: Roboto, Arial, sans-serif'>" +
          "You beat the game! You'll be redirected to your home screen.</span>",
        type: "success",
      }).then( () => {
        this.router.navigate(["home/" + username]).then( () => {
          FreeGameService.windowReload();
        }).catch();
      });
    },          ONE_SECOND);
  }
}
