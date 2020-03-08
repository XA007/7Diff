import { TestBed } from "@angular/core/testing";

import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { SimpleGameService } from "../services/simple-game.service";

describe("SimpleGameService", () => beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      HttpClientTestingModule,
    ],
    providers: [
      SimpleGameService,
    ],
  });

  it("should be created", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    expect(service).toBeTruthy();
  });
}));
