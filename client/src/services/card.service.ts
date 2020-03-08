import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import {FreeGameDbManagerService} from "./freegame-dbmanager.service";
import {SimpleGameDbManagerService} from "./simplegame-dbmanager.service";

@Injectable({
  providedIn: "root",
})
export class CardService {

  public constructor(private simpleGameDBManager: SimpleGameDbManagerService,
                     private freeGameDBManager: FreeGameDbManagerService) { }

  public reinitializeLeaderboard(gameName: string, isSimpleGame: boolean): void {
    const HALF_SECOND: number = 500;
    Swal.fire( {
      title: "<span style='font-family: Roboto, Arial, sans-serif'>Are you sure?</span>",
      html: "<span style='font-family: Roboto, Arial, sans-serif'>" +
        "Once you reinitialize the leader board, there's no coming back!</span>",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, reinitialize it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#ff4757",
    }).then( (result) => {
      if (result.value) {
        isSimpleGame ? this.simpleGameDBManager.reinitializeLeaderboard(gameName)
          : this.freeGameDBManager.reinitializeLeaderboard(gameName);
        setTimeout( () => {
          window.location.reload();
        },          HALF_SECOND);
      }
    });
  }

  public deleteCard(gameName: string, isSimpleGame: boolean): void {
    const HALF_SECOND: number = 500;
    Swal.fire( {
      title: "<span style='font-family: Roboto, Arial, sans-serif'>Are you sure?</span>",
      html: "<span style='font-family: Roboto, Arial, sans-serif'>" +
        "Once you delete the game, there's no coming back!</span>",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#ff4757",
    }).then( (result) => {
      if (result.value) {
        isSimpleGame ? this.simpleGameDBManager.removeSimpleGame(gameName) : this.freeGameDBManager.removeFreeGame(gameName);
        setTimeout( () => {
          window.location.reload();
        },          HALF_SECOND);
      }
    });
  }
}
