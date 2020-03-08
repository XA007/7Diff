import {HttpClient, HttpHandler} from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { CardService } from "../services/card.service";
import {FreeGameDbManagerService} from "../services/freegame-dbmanager.service";
import {SimpleGameDbManagerService} from "../services/simplegame-dbmanager.service";

describe("CardService", () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [HttpClient,
                                                               HttpHandler,
                                                               SimpleGameDbManagerService,
                                                               FreeGameDbManagerService], }));

  it("should be created", () => {
    const service: CardService = TestBed.get(CardService);
    expect(service).toBeTruthy();
  });

  it("should call removeSimpleGame when deleteCard is called with isSimpleGame at true", () => {
    const service: CardService = TestBed.get(CardService);
    const simpleDbManager: SimpleGameDbManagerService = TestBed.get(SimpleGameDbManagerService);
    spyOn(simpleDbManager, "removeSimpleGame");
    service.deleteCard("testdejeu", true);
    expect(simpleDbManager.removeSimpleGame).toHaveBeenCalled();
  });
});
