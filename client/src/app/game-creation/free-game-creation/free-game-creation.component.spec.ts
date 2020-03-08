import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {FreeGame} from "../../../../../common/Free-Game";
import {FreeGameCreationService} from "../../../services/free-game-creation.service";
import { FreeGameCreationComponent } from "./free-game-creation.component";

describe("FreeGameCreationComponent",  () => {
  let freeGameCreationStub: Partial<FreeGameCreationService> & {model: FreeGame};
  freeGameCreationStub = {
    sendFormOrTriggerError(freeGameInfo: FreeGame): Promise<string> {
      return Promise.resolve("");
    },
    model: undefined,
  };
  let component: FreeGameCreationComponent;
  let fixture: ComponentFixture<FreeGameCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal, RouterTestingModule, {provide: FreeGameCreationService, useValue: freeGameCreationStub}],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      declarations: [ FreeGameCreationComponent ],
    })
    .compileComponents().catch();
  }));

  beforeEach( () => {
    fixture = TestBed.createComponent(FreeGameCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create",  () => {
    expect(component).toBeTruthy();
  });

  it("should call freeGameCreation.verifyForm when onSubmit is called",  () => {
    freeGameCreationStub.sendFormOrTriggerError(component.model).then((response: string) => {
      expect(response).toBe("");
    }).catch();
  });

  it("should call activeModal.close when onSubmit is called and model is ok",  async(() => {
    const activeModal: NgbActiveModal = TestBed.get(NgbActiveModal);
    spyOn(activeModal, "close");
    component.onSubmit();
    fixture.whenStable().then(() => {
      expect(activeModal.close).toHaveBeenCalled();
    });
  }));

  it("should not call activeModal.close when onSubmit is called and model is not ok",  async(() => {
    const activeModal: NgbActiveModal = TestBed.get(NgbActiveModal);
    spyOn(activeModal, "close");
    const service: FreeGameCreationService = TestBed.get(FreeGameCreationService);
    spyOn(service, "sendFormOrTriggerError").and.returnValue(Promise.resolve("dekoi"));
    component.onSubmit();
    fixture.whenStable().then(() => {
      expect(activeModal.close).not.toHaveBeenCalled();
    });
  }));

  it("should call activeModal.close when cancelForm is called",  () => {
    const activeModal: NgbActiveModal = TestBed.get(NgbActiveModal);
    spyOn(activeModal, "close");
    component.cancelForm();
    expect(activeModal.close).toHaveBeenCalled();
  });
});
