import {HttpClient, HttpHandler} from "@angular/common/http";
import {async, TestBed} from "@angular/core/testing";
import {FreeGame} from "../../../common/Free-Game";
import {FreeGameNotifications} from "../services/Notifications/Free-Game-Notifications";
import {FreeGameCreationService} from "../services/free-game-creation.service";
import {FreeGameViewService} from "../services/free-game-view.service";
import {FreeGameDbManagerService} from "../services/freegame-dbmanager.service";
import {GameInfoSenderService} from "../services/game-info-sender.service";

describe("FreeGameCreationService",   () => {
  const RIGHT_QUANTITY: number = 69;
  const TOO_LESS_QUANTITY: number = 9;
  const TOO_MUCH_QUANTITY: number = 201;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [FreeGameCreationService,
                  GameInfoSenderService, FreeGameViewService, FreeGameDbManagerService, HttpClient, HttpHandler],
    });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [GameInfoSenderService, FreeGameViewService, FreeGameDbManagerService],
    });
  }));

  it("should return true on isObjectQuantityRight if passed number is 10 <= x <= 200", () => {
    expect(FreeGameCreationService.isObjectQuantityRight(RIGHT_QUANTITY)).toBe(true);
  });

  it("should return false on isObjectQuantityRight if passed number is 10 >= x >= 200",  () => {
    expect(FreeGameCreationService.isObjectQuantityRight(TOO_LESS_QUANTITY)).toBe(false);
    expect(FreeGameCreationService.isObjectQuantityRight(TOO_MUCH_QUANTITY)).toBe(false);
  });

  // tslint:disable-next-line
  it("should return true on isAtLeastOneChecked if one or multiple options are checked",  () => {
    let freeGameModel: FreeGame = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: false,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.isAtLeastOneChecked(freeGameModel)).toBe(true);
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: true,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.isAtLeastOneChecked(freeGameModel)).toBe(true);
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: true,
      isDeletion: false,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.isAtLeastOneChecked(freeGameModel)).toBe(true);
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: true,
      isDeletion: true,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.isAtLeastOneChecked(freeGameModel)).toBe(true);
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: true,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.isAtLeastOneChecked(freeGameModel)).toBe(true);
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: true,
      isDeletion: true,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.isAtLeastOneChecked(freeGameModel)).toBe(true);
  });

  it("should return false on isAtLeastOneChecked if no options are checked",  () => {
    const freeGameModel: FreeGame = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: false,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.isAtLeastOneChecked(freeGameModel)).toBe(false);
  });

  it("should return modification error message when no options are checked on verifyFreeGameInfo",  () => {
    const freeGameModel: FreeGame = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: false,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe(FreeGameNotifications.MODIFICATION_ERROR_MSG);
  });

  // tslint:disable-next-line
  it("should return an empty string on verifyFreeGameInfo when every condition pass", () => {
    let freeGameModel: FreeGame = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: false,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe("");
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: true,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe("");
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: true,
      isDeletion: false,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe("");
  });

  it("should return a string containing right error message on verifyFreeGameInfo when passed a FreeGame with bad game name", () => {
    let freeGameModel: FreeGame = {
      gameName: "anticonstitutionnellement",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: true,
      isDeletion: true,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe(FreeGameNotifications.LENGTH_ERROR_MSG);
    freeGameModel = {
      gameName: "mdr",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: true,
      isDeletion: true,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe(FreeGameNotifications.LENGTH_ERROR_MSG);
  });

  it("should return a string containing right error message on verifyFreeGameInfo when passed a FreeGame with bad object quantity", () => {
    let freeGameModel: FreeGame = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: TOO_LESS_QUANTITY,
      isAddition: true,
      isDeletion: true,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe(FreeGameNotifications.QUANTITY_ERROR_MSG);
    freeGameModel = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: TOO_MUCH_QUANTITY,
      isAddition: true,
      isDeletion: true,
      isColorChanging: true,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe(FreeGameNotifications.QUANTITY_ERROR_MSG);
  });

  it("should return a string containing right error message on verifyFreeGameInfo when passed a FreeGame with no options checked", () => {
    const freeGameModel: FreeGame = {
      gameName: "cestchill",
      objectType: "Sphere",
      objectQuantity: RIGHT_QUANTITY,
      isAddition: false,
      isDeletion: false,
      isColorChanging: false,
      dataURL: "",
    };
    expect(FreeGameCreationService.verifyFreeGameInfo(freeGameModel)).toBe(FreeGameNotifications.MODIFICATION_ERROR_MSG);
  });
});
