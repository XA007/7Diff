import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FreeGameCreationComponent } from "../game-creation/free-game-creation/free-game-creation.component";
import { SimpleGameCreationComponent } from "../game-creation/simple-game-creation/simple-game-creation.component";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent {

  public constructor(private modalService: NgbModal) { }

  public openSimpleGameCreation(): void {
    this.modalService.open(SimpleGameCreationComponent);
  }

  public openFreeGameCreation(): void {
    this.modalService.open(FreeGameCreationComponent);
  }
}
