import {async, inject, TestBed} from "@angular/core/testing";

import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { FreeGameDbManagerService } from "../services/freegame-dbmanager.service";

describe("SimpleGameDBManager", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        FreeGameDbManagerService,
      ],
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it("should be created", () => {
    const service: FreeGameDbManagerService = TestBed.get(FreeGameDbManagerService);
    expect(service).toBeTruthy();
  });
});

describe("FreeGameDBManager", () => {

  const gameName: string = "testGame";
  const image: string = "testImage";
  const url: string = "url";
  const userName: string = "testUser";
  const time: string = "00:02";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        FreeGameDbManagerService,
      ],
    });
  });

  it("should make a POST Http Request to correct url",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.initializeImage(gameName, image).then().catch();
          backend.expectOne( (req) => {
            return req.method === "POST";
          });
        },
      ),
    ),
  );

  it("should make a GET Http Request to correct url",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.getFreeGames().subscribe();
          backend.expectOne( (req) => {
            return req.method === "GET";
          });
        },
      ),
    ),
  );

  it("should make a GET Http Request to correct url",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.getObjects(url).subscribe();
          backend.expectOne( (req) => {
            return req.method === "GET";
          });
        },
      ),
    ),
  );

  it("should make a POST Http Request to correct url for updateLeaderBoard",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.updateLeaderboard(gameName, userName, time, true).then().catch();
          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/games/freegames/updateleaderboard/" && req.method === "POST";
          });
        },
      ),
    ),
  );

  it("should make a POST Http Request to correct url for reinitializeLeaderboard",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.reinitializeLeaderboard(gameName).then().catch();
          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/reinitializefree" && req.method === "POST";
          });
        },
      ),
    ),
  );

  it("should make a GET Http Request to correct url",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.getFreeGameByName(gameName).then().catch();
          backend.expectOne( (req) => {
            return req.method === "GET";
          });
        },
      ),
    ),
  );

  it("should make a GET Http Request to correct url",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.verifyGameName(gameName).then().catch();
          backend.expectOne( (req) => {
            return req.method === "GET";
          });
        },
      ),
    ),
  );

  it("should make a DELETE Http Request to correct url",
     async(
      inject([FreeGameDbManagerService, HttpTestingController], (service: FreeGameDbManagerService, backend: HttpTestingController) => {
          service.removeFreeGame(gameName).then().catch();
          backend.expectOne( (req) => {
            return req.method === "DELETE";
          });
        },
      ),
    ),
  );

});
