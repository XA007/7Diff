import { HttpClient, HttpHandler } from "@angular/common/http";
import {fakeAsync, tick, TestBed} from "@angular/core/testing";
import { GameInfoSenderService } from "src/services/game-info-sender.service";
import { SimpleGameCreationService } from "../services/simple-game-creation.service";

describe("SimpleGameCreationService", () => {

  const MOCK_FILE: File = new File([""], "mockFile");
  const MOCK_GAME_NAME: string = "mockGameName";
  const MOCK_FORM_DATA: FormData = new FormData();
  MOCK_FORM_DATA.append("gameName", MOCK_GAME_NAME);
  MOCK_FORM_DATA.append("originalImage", MOCK_FILE);
  MOCK_FORM_DATA.append("modifiedImage", MOCK_FILE);
  const TOO_SHORT_GAME_NAME: string = "aaa";
  const TOO_LONG_GAME_NAME: string = "aaaaaaaaaaaaaaaa";
  const GAME_NAME_LENGTH_ERROR_MESSAGE: string = "Game name must be between 4 & 15 characters. / \n";
  const MISSING_FIELD_ERROR_MESSAGE: string = "There is a missing field in your form. Please try again.";
  const EMPTY_STRING: string = "";

  let gameInfoSenderStub: Partial<GameInfoSenderService>;
  gameInfoSenderStub = {
    generateDifferencesImage(form: FormData): Promise<string> {
      return Promise.resolve("success");
    },
    verifyForm(form: FormData): Promise<string> {
      return Promise.resolve("success");
    },
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, HttpHandler, {provide: GameInfoSenderService, useValue: gameInfoSenderStub}],
  }));

  it("should be created", () => {
    const service: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    expect(service).toBeTruthy();
  });

  it("should return true when missing field on isMissingField", () => {
    expect(SimpleGameCreationService.isMissingField(undefined, undefined, undefined)).toBe(true);
    expect(SimpleGameCreationService.isMissingField(MOCK_GAME_NAME, undefined, undefined)).toBe(true);
    expect(SimpleGameCreationService.isMissingField(undefined, MOCK_FILE, undefined)).toBe(true);
    expect(SimpleGameCreationService.isMissingField(undefined, undefined, MOCK_FILE)).toBe(true);
    expect(SimpleGameCreationService.isMissingField(MOCK_GAME_NAME, MOCK_FILE, undefined)).toBe(true);
    expect(SimpleGameCreationService.isMissingField(undefined, MOCK_FILE, MOCK_FILE)).toBe(true);
    expect(SimpleGameCreationService.isMissingField(MOCK_GAME_NAME, undefined, MOCK_FILE)).toBe(true);
  });

  it("should return false when no missing field on isMissingField", () => {
    expect(SimpleGameCreationService.isMissingField(MOCK_GAME_NAME, MOCK_FILE, MOCK_FILE)).toBe(false);
  });

  it("should return error message when gameName is bad length on addErrorMessageIfBadGameNameLength", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    expect(simpleGameCreation.addErrorMessageIfBadGameNameLength(TOO_SHORT_GAME_NAME)).toBe(GAME_NAME_LENGTH_ERROR_MESSAGE);
    expect(simpleGameCreation.addErrorMessageIfBadGameNameLength(TOO_LONG_GAME_NAME)).toBe(GAME_NAME_LENGTH_ERROR_MESSAGE);
  });

  it("should return empty string when gameName is good length on addErrorMessageIfBadGameNameLength", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    expect(simpleGameCreation.addErrorMessageIfBadGameNameLength(MOCK_GAME_NAME)).toBe(EMPTY_STRING);
  });

  it("should call verifyForm when addErrorMessageOrSendData is called", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    const gameInfoSender: GameInfoSenderService = TestBed.get(GameInfoSenderService);
    spyOn(gameInfoSender, "verifyForm").and.returnValue(new Promise((resolve) => resolve("")));
    simpleGameCreation.addErrorMessageOrSendData(EMPTY_STRING, MOCK_FILE, MOCK_FILE);
    expect(gameInfoSender.verifyForm).toHaveBeenCalled();
  });

  // problème avec fakeAsync

  it("should call generateDifferencesImage when errorMessage is empty string on submitFormAndGenerateGameCardIfErrorMessageEmpty",
     fakeAsync(() => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    const gameInfoSender: GameInfoSenderService = TestBed.get(GameInfoSenderService);
    spyOn(gameInfoSender, "generateDifferencesImage").and.returnValue(Promise.resolve("Bloop"));
    simpleGameCreation.submitFormAndGenerateGameCardIfErrorMessageEmpty(EMPTY_STRING, MOCK_GAME_NAME, MOCK_FORM_DATA);
    tick();
    expect(gameInfoSender.generateDifferencesImage).toHaveBeenCalled();
  }));

  it("should return MISSING_FIELD_ERROR_MESSAGE on triggerErrorOrSendData when missing field", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    simpleGameCreation.triggerErrorOrSendData(undefined, undefined, undefined).then((result) => {
      expect(result).toBe(MISSING_FIELD_ERROR_MESSAGE);
    });
    simpleGameCreation.triggerErrorOrSendData(MOCK_GAME_NAME, undefined, undefined).then((result) => {
      expect(result).toBe(MISSING_FIELD_ERROR_MESSAGE);
    });
    simpleGameCreation.triggerErrorOrSendData(undefined, MOCK_FILE, undefined).then((result) => {
      expect(result).toBe(MISSING_FIELD_ERROR_MESSAGE);
    });
    simpleGameCreation.triggerErrorOrSendData(undefined, undefined, MOCK_FILE).then((result) => {
      expect(result).toBe(MISSING_FIELD_ERROR_MESSAGE);
    });
    simpleGameCreation.triggerErrorOrSendData(MOCK_GAME_NAME, MOCK_FILE, undefined).then((result) => {
      expect(result).toBe(MISSING_FIELD_ERROR_MESSAGE);
    });
    simpleGameCreation.triggerErrorOrSendData(undefined, MOCK_FILE, MOCK_FILE).then((result) => {
      expect(result).toBe(MISSING_FIELD_ERROR_MESSAGE);
    });
    simpleGameCreation.triggerErrorOrSendData(MOCK_GAME_NAME, undefined, MOCK_FILE).then((result) => {
      expect(result).toBe(MISSING_FIELD_ERROR_MESSAGE);
    });
  });

  it("should return GAME_NAME_LENGTH_ERROR_MESSAGE on triggerErrorOrSendData when gameName is bad length", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    simpleGameCreation.triggerErrorOrSendData(TOO_SHORT_GAME_NAME, MOCK_FILE, MOCK_FILE).then((result) => {
      expect(result).toContain(GAME_NAME_LENGTH_ERROR_MESSAGE);
    });
    simpleGameCreation.triggerErrorOrSendData(TOO_SHORT_GAME_NAME, MOCK_FILE, MOCK_FILE).then((result) => {
      expect(result).toContain(GAME_NAME_LENGTH_ERROR_MESSAGE);
    });
  });

  it("should call addErrorMessageOrSendData when all fields are filed", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    spyOn(simpleGameCreation, "addErrorMessageOrSendData");
    simpleGameCreation.triggerErrorOrSendData(MOCK_GAME_NAME, MOCK_FILE, MOCK_FILE).then(() => {
      expect(simpleGameCreation.addErrorMessageOrSendData).toHaveBeenCalled();
    });
  });

  it("should add game name length error on addErrorMessageOrSendData when gameName is bad length", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    simpleGameCreation.addErrorMessageOrSendData(TOO_SHORT_GAME_NAME, MOCK_FILE, MOCK_FILE).then((result) => {
      expect(result).toContain(GAME_NAME_LENGTH_ERROR_MESSAGE);
    });
    simpleGameCreation.addErrorMessageOrSendData(TOO_LONG_GAME_NAME, MOCK_FILE, MOCK_FILE).then((result) => {
      expect(result).toContain(GAME_NAME_LENGTH_ERROR_MESSAGE);
    });
  });

  it("should not add game name length error on addErrorMessageOrSendData when gameName is good length", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    simpleGameCreation.addErrorMessageOrSendData(MOCK_GAME_NAME, MOCK_FILE, MOCK_FILE).then((result) => {
      expect(result).not.toContain(GAME_NAME_LENGTH_ERROR_MESSAGE);
    });
  });

  it("should call submitFormAndGenerateGameCardIfErrorMessageEmpty when addErrorMessageOrSendData is called", () => {
    const simpleGameCreation: SimpleGameCreationService = TestBed.get(SimpleGameCreationService);
    spyOn(simpleGameCreation, "submitFormAndGenerateGameCardIfErrorMessageEmpty");
    simpleGameCreation.triggerErrorOrSendData(MOCK_GAME_NAME, MOCK_FILE, MOCK_FILE).then(() => {
      expect(simpleGameCreation.submitFormAndGenerateGameCardIfErrorMessageEmpty).toHaveBeenCalled();
    });
  });

  it("should create formData with infos when makeFormData is called", () => {
    const formData: FormData = new FormData();
    formData.append("gameName", EMPTY_STRING);
    formData.append("originalImage", MOCK_FILE);
    formData.append("modifiedImage", MOCK_FILE);

    expect(SimpleGameCreationService.makeFormData(EMPTY_STRING, MOCK_FILE, MOCK_FILE)).toEqual(formData);
  });
});
