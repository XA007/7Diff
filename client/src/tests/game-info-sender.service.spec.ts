import { async, inject, TestBed } from "@angular/core/testing";

import { HttpClient, HttpClientModule, HttpHandler } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import {FreeGame} from "../../../common/Free-Game";
import { GameInfoSenderService } from "../services/game-info-sender.service";

describe("GameInfoSenderService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, HttpHandler],
  }));

  it("should be created", () => {
    const service: GameInfoSenderService = TestBed.get(GameInfoSenderService);
    expect(service).toBeTruthy();
  });
});

describe("verifyForm function", () => {
  const formData: FormData = new FormData();
  const mockOriginalImage: File = new File([""], "originalImage");
  const mockModifiedImage: File = new File([""], "modifiedImage");
  formData.append("gameName", "waluigi");
  formData.append("originalImage", mockOriginalImage);
  formData.append("modifiedImage", mockModifiedImage);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        GameInfoSenderService,
      ],
    });
  });

  it("should make a POST Http Request to correct url with correct body",
     async(
      inject([GameInfoSenderService, HttpTestingController], (service: GameInfoSenderService, backend: HttpTestingController) => {
          service.verifyForm(formData).then().catch();

          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/formverification"
              && req.method === "POST";
        });
        },
      ),
    ),
  );

});

describe("submitForm function", () => {
  const formData: FormData = new FormData();
  const mockOriginalImage: File = new File([""], "originalImage");
  const mockModifiedImage: File = new File([""], "modifiedImage");
  formData.append("gameName", "waluigi");
  formData.append("originalImage", mockOriginalImage);
  formData.append("modifiedImage", mockModifiedImage);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        GameInfoSenderService,
      ],
    });
  });

  it("should make a POST Http Request to correct url with correct body",
     async(
      inject([GameInfoSenderService, HttpTestingController], (service: GameInfoSenderService, backend: HttpTestingController) => {
          service.generateDifferencesImage(formData).then().catch();

          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/generatedifferences"
              && req.method === "POST";
        });
        },
      ),
    ),
  );

});

describe("sendFreeGameData function", () => {
  const OBJECT_NUMBER: number = 69;
  const freeGameInfo: FreeGame = {
    gameName: "gameName",
    objectType: "Geometric",
    objectQuantity: OBJECT_NUMBER,
    isAddition: true,
    isDeletion: true,
    isColorChanging: true,
    dataURL: "",
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        GameInfoSenderService,
      ],
    });
  });

  it("should make a POST Http Request to correct url with correct body",
     async(
      inject([GameInfoSenderService, HttpTestingController], (service: GameInfoSenderService, backend: HttpTestingController) => {
          service.sendFreeGameData(freeGameInfo).then().catch();

          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/freegameinfo"
              && req.method === "POST";
          });
        },
      ),
    ),
  );

});

describe("saveFreeGameToDb function", () => {
  const OBJECT_NUMBER: number = 69;
  const freeGameInfo: FreeGame = {
    gameName: "gameName",
    objectType: "Geometric",
    objectQuantity: OBJECT_NUMBER,
    isAddition: true,
    isDeletion: true,
    isColorChanging: true,
    dataURL: "",
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        GameInfoSenderService,
      ],
    });
  });

  it("should make a POST Http Request to correct url with correct body",
     async(
      inject([GameInfoSenderService, HttpTestingController], (service: GameInfoSenderService, backend: HttpTestingController) => {
          service.saveFreeGameToDb(freeGameInfo).then().catch();

          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/savefreegame"
              && req.method === "POST";
          });
        },
      ),
    ),
  );

});

describe("verifyFreeGameDifference function", () => {
  const uuid: string = "unuuid";
  const gameName: string = "unjeu";
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        GameInfoSenderService,
      ],
    });
  });

  it("should make a POST Http Request to correct url with correct body",
     async(
      inject([GameInfoSenderService, HttpTestingController], (service: GameInfoSenderService, backend: HttpTestingController) => {
          service.verifyFreeGameDifference(uuid, gameName).then().catch();

          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/freegamedifference"
              && req.method === "POST";
          });
        },
      ),
    ),
  );

});
