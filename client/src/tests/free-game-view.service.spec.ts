import {HttpClientModule} from "@angular/common/http";
import {ElementRef, Injectable} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import * as THREE from "three";
import {Intersection, Raycaster, Vector3} from "three";
import {ClickEvent} from "../../../common/ClickEvent";
import {FreeGameConst} from "../services/constants/free-Game-Const";
import {FreeGameViewService} from "../services/free-game-view.service";
import {FreeGameService} from "../services/free-game.service";
import {GameInfoSenderService} from "../services/game-info-sender.service";

@Injectable()
export class MockElementRef {
  public nativeElement: NativeElement = new NativeElement();
}

@Injectable()
export class NativeElement {
  public style: Style = new Style();
}

@Injectable()
export class Style {
  public display: string = "none";
  public left: string =  "1912px";
  public top: string = "743px";
}

describe("FreeGameViewService", () => {
  let freeGameStub: Partial<FreeGameService>;
  freeGameStub = {
    updateScore(gameName: string, userName: string, timestamp: string, score: number): number {
      return 0;
    },
    retrieveOriginalObjects(gameName: string): Promise<THREE.Object3D[]> {
      const object: THREE.Object3D = new THREE.Object3D();
      const objectArray: THREE.Object3D[] = [];
      objectArray.push(object);

      return Promise.resolve(objectArray);
    },
    retrieveModifiedObjects(gameName: string): Promise<THREE.Object3D[]> {
      const object: THREE.Object3D = new THREE.Object3D();
      const objectArray: THREE.Object3D[] = [];
      objectArray.push(object);

      return Promise.resolve(objectArray);
    },
    parseAndPushObjects(objects: THREE.Object3D[], objectArray: THREE.Object3D[]): void {
    },
    adjustAddedObjectsPosition(objectArray: THREE.Object3D[]): void {
    },
    applyColorFind(appliedObject: THREE.Object3D, applierObject: THREE.Object3D): void {
    },
  };
  let gameInfoSenderStub: Partial<GameInfoSenderService>;
  gameInfoSenderStub = {
    verifyFreeGameDifference(uuid: string, gameName: string): Promise<boolean> {
      return Promise.resolve(true);
    },
  };
  let raycasterStub: Partial<Raycaster>;
  raycasterStub = {
    intersectObjects(objects: THREE.Object3D[], recursive?: boolean, optionalTarget?: Intersection[]): Intersection[] {
      const intersectionArray: Intersection[] = [];
      const intersection: Intersection = {
        distance: 10,
        point: {x: 0, y: 0, z: 0} as Vector3,
        object: new THREE.Object3D(),
      };
      intersectionArray.push(intersection);

      return intersectionArray;
    },
    setFromCamera(coords: { x: number; y: number }, camera: THREE.Camera): void {
    },
  };
  const click: ClickEvent = {
    offsetX: 0,
    offsetY: 0,
    clientX: 0,
    clientY: 0,
    timeStamp: 0,
  };
  let elementRef: ElementRef;

  beforeEach( () =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [{provide: ElementRef, useValue: new MockElementRef()}, {provide: FreeGameService, useValue: freeGameStub},
                  {provide: GameInfoSenderService, useValue: gameInfoSenderStub}, {provide: Raycaster, useValue: raycasterStub}],
    }).compileComponents());

  it("should be created", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    expect(service).toBeTruthy();
  });

  it("should activate cheat mode", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.manageCheatMode("T");
  });

  it("should deactivate cheat mode", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.cheatMode = true;
    service.manageCheatMode("T");
  });

  it("should restore object of name is color on restoreObjects", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.cheatMode = true;
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "color";
    service.storedObjectArray.push(object);
    service.restoreObjects();
  });

  it("should not restore object if name is empty on restoreObjects", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.cheatMode = true;
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "";
    service.storedObjectArray.push(object);
    service.restoreObjects();
  });

  it("should not restore object if name is remove-hidden on restoreObjects", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.cheatMode = true;
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "remove-hidden";
    service.storedObjectArray.push(object);
    service.restoreObjects();
  });

  it("should create scene vignet", () => {
    elementRef = TestBed.get(ElementRef);
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.createSceneVignet("unjeu");
  });

  it("should apply color found", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    const storedObject: THREE.Object3D = new THREE.Object3D();
    storedObject.name = "color";
    service.storedObjectArray.push(storedObject);
    const OBJECT_POSITION: number = -100;
    object.position.x = OBJECT_POSITION;
    service.colorFound(object);
  });

  it("should apply remove hidden found", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    const storedObject: THREE.Object3D = new THREE.Object3D();
    storedObject.name = "remove";
    service.storedObjectArray.push(storedObject);
    service.removeHiddenFound(object);
  });

  it("should apply add found", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    service.addFound(object);
  });

  it("should apply remove found", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    const storedObject: THREE.Object3D = new THREE.Object3D();
    storedObject.name = "remove-hidden";
    service.storedObjectArray.push(storedObject);
    service.removeFound(object);
  });

  it("should call addFound when object name is add on updateViewAfterFind", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "add";
    service.updateViewAfterFind(object);
  });

  it("should call colorFound when object name is color on updateViewAfterFind", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "color";
    service.updateViewAfterFind(object);
  });

  it("should call removeFound when object name is remove on updateViewAfterFind", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "remove";
    service.updateViewAfterFind(object);
  });

  it("should call removeHiddenFound when object name is remove-hidden on updateViewAfterFind", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "remove-hidden";
    service.updateViewAfterFind(object);
  });

  it("should call default when object name is blank on updateViewAfterFind", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    service.updateViewAfterFind(object);
  });

  it("should call manageClick properly when isHovering", () => {
    elementRef = TestBed.get(ElementRef);
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.isHovering = true;
    service.currentObject = new THREE.Object3D();
    service.manageClick(click, elementRef, elementRef, "", "", "");
  });

  it("should call manageClick properly when not isHovering", () => {
    elementRef = TestBed.get(ElementRef);
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.manageClick(click, elementRef, elementRef, "", "", "");
  });

  it("should call manageClick properly when isHovering and object is found", () => {
    elementRef = TestBed.get(ElementRef);
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.currentObject = new THREE.Object3D();
    service.currentObject.name = "found";
    gameInfoSenderStub = {
      verifyFreeGameDifference(uuid: string, gameName: string): Promise<boolean> {
        return Promise.resolve(false);
      },
    };
    service.manageClick(click, elementRef, elementRef, "", "", "");
  });

  it("should call showError properly", () => {
    elementRef = TestBed.get(ElementRef);
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    service.showError(click, elementRef, elementRef);
  });

  it("should flicker object if name is add and flickerObject is called", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "add";
    service.storedObjectArray.push(object);
    service.flickerObject();
  });

  it("should flicker object if name is remove and flickerObject is called", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "remove";
    service.storedObjectArray.push(object);
    service.flickerObject();
  });

  it("should flicker object if name is color and flickerObject is called", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    object.name = "color";
    service.storedObjectArray.push(object);
    service.flickerObject();
  });

  it("should not flicker object if name is default and flickerObject is called", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    service.storedObjectArray.push(object);
    service.flickerObject();
  });

  it("should animate objects properly", () => {
    const service: FreeGameViewService = TestBed.get(FreeGameViewService);
    const object: THREE.Object3D = new THREE.Object3D();
    const objectArray: THREE.Object3D[] = [];
    objectArray.push(object);
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.OrthographicCamera =
      new THREE.OrthographicCamera(-FreeGameConst.WIDTH_RATIO , FreeGameConst.WIDTH_RATIO, FreeGameConst.HEIGHT_RATIO,
                                   -FreeGameConst.HEIGHT_RATIO, FreeGameConst.NEAR, FreeGameConst.FRUSTUM_SIZE);
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({devicePixelRatio: window.devicePixelRatio});
    const raycaster: THREE.Raycaster = TestBed.get(Raycaster);
    const mouse: THREE.Vector2 = new THREE.Vector2();
    service.animateObjects(objectArray, scene, camera, renderer, raycaster, mouse);
  });
});
