import {async, inject, TestBed} from "@angular/core/testing";

import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { SimpleGameDbManagerService } from "../services/simplegame-dbmanager.service";

describe("SimpleGameDBManager", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        SimpleGameDbManagerService,
      ],
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it("should be created", () => {
    const service: SimpleGameDbManagerService = TestBed.get(SimpleGameDbManagerService);
    expect(service).toBeTruthy();
  });
});

describe("SimpleGameDBManager", () => {

  const gameName: string = "testGame";
  const userName: string = "testUser";
  const time: string = "00:02";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        SimpleGameDbManagerService,
      ],
    });
  });

  it("should make a DELETE Http Request to correct url",
     async(
      inject([SimpleGameDbManagerService, HttpTestingController], (service: SimpleGameDbManagerService, backend: HttpTestingController) => {
          service.removeSimpleGame(gameName).then().catch();
          backend.expectOne( (req) => {
            return req.method === "DELETE";
          });
        },
      ),
    ),
  );

  it("should make a GET Http Request to correct url",
     async(
      inject([SimpleGameDbManagerService, HttpTestingController], (service: SimpleGameDbManagerService, backend: HttpTestingController) => {
          service.getSimpleGameByName(gameName).subscribe();
          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/games/simplegames/games/testGame" && req.method === "GET";
          });
        },
      ),
    ),
  );

  it("should make a POST Http Request to correct url for updateLeaderBoard",
     async(
      inject([SimpleGameDbManagerService, HttpTestingController], (service: SimpleGameDbManagerService, backend: HttpTestingController) => {
          service.updateLeaderboard(gameName, userName, time, false).then().catch();
          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/games/simplegames/updateleaderboard/" && req.method === "POST";
          });
        },
      ),
    ),
  );

  it("should make a POST Http Request to correct url for reinitializeLeaderboard",
     async(
      inject([SimpleGameDbManagerService, HttpTestingController], (service: SimpleGameDbManagerService, backend: HttpTestingController) => {
          service.reinitializeLeaderboard("unjeutest");
          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/reinitializesimple" && req.method === "POST";
          });
        },
      ),
    ),
  );

});
