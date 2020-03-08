import { Component } from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { FreeGameCreationService } from "src/services/free-game-creation.service";
import {FreeGame} from "../../../../../common/Free-Game";

@Component({
  selector: "app-free-game-creation",
  templateUrl: "./free-game-creation.component.html",
  styleUrls: ["./free-game-creation.component.css"],
})
export class FreeGameCreationComponent {

  public message: string;
  public objectTypes: string[] = ["Geometric"];
  public model: FreeGame = {
    gameName: "",
    objectType: this.objectTypes[0],
    objectQuantity: undefined,
    isAddition: false,
    isDeletion: false,
    isColorChanging: false,
    dataURL: "",
  };

  public constructor(public activeModal: NgbActiveModal,
                     public freeGameCreation: FreeGameCreationService) {}

  public onSubmit(): void {
    this.freeGameCreation.sendFormOrTriggerError(this.model).then((errorMessage: string) => {
      (errorMessage === "") ? (this.activeModal.close()) : (this.message = errorMessage);
    }).catch();
  }

  public cancelForm(): void {
  this.activeModal.close("Form cancelled");
  }
}
