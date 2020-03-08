import { Component } from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { SimpleGameCreationService } from "src/services/simple-game-creation.service";
import { SimpleGame } from "../../../../../common/Simple-Game";

@Component({
  selector: "app-simple-game-creation",
  templateUrl: "./simple-game-creation.component.html",
  styleUrls: ["./simple-game-creation.component.css"],
})
export class SimpleGameCreationComponent {

  public message: string;

  public constructor(public activeModal: NgbActiveModal,
                     public simpleGameCreation: SimpleGameCreationService) {}

  public model: SimpleGame = {
    gameName: undefined,
    originalImage: undefined,
    modifiedImage: undefined,
  };

  public onOriginalImageSelect(event): void {
    this.model.originalImage = event.target.files[0];
  }

  public onModifiedImageSelect(event): void {
    this.model.modifiedImage = event.target.files[0];
  }

  public cancelForm(): void {
  this.activeModal.close("Form cancelled");
  }

  public verifyForm(): void {
    this.simpleGameCreation.triggerErrorOrSendData(this.model.gameName,
                                                   this.model.originalImage,
                                                   this.model.modifiedImage).then((errorMessage: string) => {
      (errorMessage === "") ? (this.activeModal.close("Success")) : (this.message = errorMessage);
    }).catch();
  }
}
