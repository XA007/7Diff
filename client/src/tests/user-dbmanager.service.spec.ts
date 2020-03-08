import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {async, inject, TestBed} from "@angular/core/testing";
import { UserDBManagerService } from "../services/user-dbmanager.service";

describe("UserDBManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        UserDBManagerService,
      ],
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it("should be created", () => {
    const service: UserDBManagerService = TestBed.get(UserDBManagerService);
    expect(service).toBeTruthy();
  });
});

describe("verifyUser function", () => {

  const newUserName: string = "Maple";
  const existingUserName: string = "user";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        UserDBManagerService,
      ],
    });
  });

  it("should make a GET Http Request to correct url",
     async(
      inject([UserDBManagerService, HttpTestingController], (service: UserDBManagerService, backend: HttpTestingController) => {
        service.verifyUser(newUserName).subscribe();
        backend.expectOne( (req) => {
          return req.url === "http://localhost:3000/verify/Maple" && req.method === "GET";
        });
      },
    ),
  ),
  );

  it("should expect true when username is not in database",
     async(
      inject([UserDBManagerService, HttpTestingController], (service: UserDBManagerService, backend: HttpTestingController) => {
      service.verifyUser(newUserName).subscribe((next) => {
        expect(next.isAdded).toBe(true);
      });

      backend.expectOne("http://localhost:3000/verify/Maple").flush({isAdded: true});
      }),
     ),
  );

  it("should expect false when username is in database",
     async(
      inject([UserDBManagerService, HttpTestingController], (service: UserDBManagerService, backend: HttpTestingController) => {
        service.verifyUser(existingUserName).subscribe((next) => {
          expect(next.isAdded).toBe(false);
        });

        backend.expectOne("http://localhost:3000/verify/user").flush({isAdded: false});
      }),
    ),
  );

});

describe("addUser function", () => {

  const newUserName: string = "Maple";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        UserDBManagerService,
      ],
    });
  });

  it("should make a POST Http Request to correct url with correct body",
     async(
      inject([UserDBManagerService, HttpTestingController], (service: UserDBManagerService, backend: HttpTestingController) => {
          service.addUser(newUserName).then().catch();

          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/add/" && req.method === "POST" && req.body.username === "Maple";
        });
        },
      ),
    ),
  );

});

describe("removeUser function", () => {

  const existingUsername: string = "Maple";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        UserDBManagerService,
      ],
    });
  });

  it("should make a DELETE Http Request to correct url",
     async(
      inject([UserDBManagerService, HttpTestingController], (service: UserDBManagerService, backend: HttpTestingController) => {
          service.removeUser(existingUsername).then().catch();

          backend.expectOne( (req) => {
            return req.url === "http://localhost:3000/remove/Maple" && req.method === "DELETE";
          });
        },
      ),
    ),
  );

});
