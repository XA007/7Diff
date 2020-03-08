import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { GameInfoSenderService } from "src/services/game-info-sender.service";
import { SimpleGameCreationService } from "src/services/simple-game-creation.service";
import { SimpleGameCreationComponent } from "./simple-game-creation.component";

describe("SimpleGameCreationComponent", () => {
  const activeModal: NgbActiveModal = new NgbActiveModal();
  const http: HttpClient = new HttpClient(HttpHandler.prototype);
  const gameInfoSender: GameInfoSenderService = new GameInfoSenderService(http);
  const simpleGameCreation: SimpleGameCreationService = new SimpleGameCreationService(gameInfoSender);
  const simpleGameCreationComponent: SimpleGameCreationComponent = new SimpleGameCreationComponent(activeModal, simpleGameCreation);
  let component: SimpleGameCreationComponent;
  let fixture: ComponentFixture<SimpleGameCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
      declarations: [ SimpleGameCreationComponent ],
    })
    .compileComponents().catch();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGameCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call activeModal.close when cancelForm is called", () => {
    spyOn(activeModal, "close");
    simpleGameCreationComponent.cancelForm();
    expect(activeModal.close).toHaveBeenCalled();
  });

  it("should call triggerErrorOrSendData when verifyForm is called", () => {
    spyOn(simpleGameCreation, "triggerErrorOrSendData").and.returnValue(new Promise((resolve) => resolve("")));
    simpleGameCreationComponent.model.gameName = "aaaaaa";
    simpleGameCreationComponent.model.originalImage = new File([""], "originalImage");
    simpleGameCreationComponent.model.modifiedImage = new File([""], "modifiedImage");
    simpleGameCreationComponent.verifyForm();
    expect(simpleGameCreation.triggerErrorOrSendData).toHaveBeenCalled();
  });

  it("should get the right file in the model in original image", () => {
    const event: any = {
      target : {
        files : [ new File([""], "originalImage")],
      },
    };
    simpleGameCreationComponent.onOriginalImageSelect(event);
    expect(simpleGameCreationComponent.model.originalImage.name).toBe("originalImage");
  });

  it("should get the right file in the mode in modified image", () => {
    const event: any = {
      target : {
        files : [ new File([""], "modifiedImage")],
      },
    };
    simpleGameCreationComponent.onModifiedImageSelect(event);
    expect(simpleGameCreationComponent.model.modifiedImage.name).toBe("modifiedImage");
  });
});
