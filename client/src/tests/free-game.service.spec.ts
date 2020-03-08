import { TestBed } from "@angular/core/testing";

import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavigationExtras, Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import * as THREE from "three";
import {FreeGameCreationComponent} from "../app/game-creation/free-game-creation/free-game-creation.component";
import { FreeGameService } from "../services/free-game.service";

describe("FreeGameService", () => {
  let routerStub: Partial<Router>;
  routerStub = {
    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
      return Promise.resolve(true);
    },
  };
  beforeEach(() =>
    TestBed.configureTestingModule({
    providers: [NgbActiveModal, {provide: Router, useValue: routerStub}],
    imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientModule],
    declarations: [ FreeGameCreationComponent ],
  })
    .compileComponents());

  it("should be created", () => {
    const service: FreeGameService = TestBed.get(FreeGameService);
    expect(service).toBeTruthy();
  });

  it("should add objects to scene", () => {
    const objects: THREE.Object3D[] = [];
    const OBJECT_NUMBER: number = 10;
    const scene: THREE.Scene = new THREE.Scene();
    for (let i: number = 0; i < OBJECT_NUMBER; i++) {
      objects.push(new THREE.Object3D());
    }
    FreeGameService.addObjectsToScene(objects, scene);
    expect(scene.children.length).toBe(OBJECT_NUMBER);
  });

  it("should change an object position", () => {
    const objects: THREE.Object3D[] = [];
    const OBJECT_NUMBER: number = 1;
    const service: FreeGameService = TestBed.get(FreeGameService);
    for (let i: number = 0; i < OBJECT_NUMBER; i++) {
      const object: THREE.Object3D = new THREE.Object3D();
      object.position.set(0, 0, 0);
      object.name = "add";
      objects.push(new THREE.Object3D());
    }
    service.adjustAddedObjectsPosition(objects);
    expect(objects[0].position.x).toBe(0);
  });

  it("should change an object material color", () => {
    const object: THREE.Object3D = new THREE.Object3D();
    const redHex: number = 16711680;
    const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({color: 0xFF0000});
    (object as THREE.Mesh).material = material;
    const newObject: THREE.Object3D = new THREE.Object3D();
    FreeGameService.applyColorFind(newObject, object);
    expect(((newObject as THREE.Mesh).material as THREE.MeshLambertMaterial).color.getHex()).toBe(redHex);
  });

  it("should update the score when updateScore is called", () => {
    const service: FreeGameService = TestBed.get(FreeGameService);
    const gameName: string = "testGame";
    const userName: string = "testUser";
    const timeStamp: string = "time";
    let score: number = 1;
    const expectedScore: number = 2;
    score = service.updateScore(gameName, userName, timeStamp, score);
    expect(score).toBe(expectedScore);
  });

  it("should clone objects when cloneObjects is called", () => {
    const objects: THREE.Object3D[] = [];
    const object: THREE.Object3D = new THREE.Object3D();
    objects.push(object);
    FreeGameService.cloneObjects(objects);
  });
});
