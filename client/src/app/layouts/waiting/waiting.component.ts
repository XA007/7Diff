import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {RoomInterface} from "../../../../../common/RoomInterface";
import {SocketClientService} from "../../../services/socket-client.service";

@Component({
  selector: "app-waiting",
  templateUrl: "./waiting.component.html",
  styleUrls: ["./waiting.component.css"],
})
export class WaitingComponent {

  public gamename: string;
  public username: string;
  public constructor(private router: Router,
                     private socketService: SocketClientService,
                     private route: ActivatedRoute, ) {
    this.gamename = this.route.snapshot.params["gameName"];
    this.username = this.route.snapshot.params["username"];
    this.startMultiPlayerGame();
    this.manageDeletedGame();
  }

  public returnHome(): void {
    const homePageLink: string = "/home/" + this.username;
    this.socketService.emitCancelRoom(this.gamename);
    this.router.navigateByUrl(homePageLink).then( () => {
      window.location.reload();
    });
  }

  public startMultiPlayerGame(): void {
    this.socketService.onFullRoom()
      .subscribe( (room: RoomInterface) => {
        if (room.players.includes(this.username)) {
          this.navigateToGame(room);
        }
      });
  }

  public manageDeletedGame(): void {
    this.socketService.onGameDeleted()
      .subscribe( (gameName: string) => {
        if (this.gamename === gameName) {
          Swal.fire({
            title: "<span style='font-family: Roboto, Arial, sans-serif'>Game deleted</span>",
            html: "<span style='font-family: Roboto, Arial, sans-serif'>" +
              "This game has been deleted! You'll be redirected to your home screen.</span>",
            type: "warning",
          }).then( () => {
            this.returnHome();
          });
        }
      });
  }

  private navigateToGame(room: RoomInterface): void {
    room.players[0] === this.username ?
      this.router.navigateByUrl((room.isSimpleGame ? "SimpleView" : "FreeView") +
        "/multiPlayer/" + room.gameName + "/" + room.players[0] + "/" + room.players[1]) :
      this.router.navigateByUrl((room.isSimpleGame ? "SimpleView" : "FreeView") +
        "/multiPlayer/" + room.gameName + "/" + room.players[1] + "/" + room.players[0]);
  }
}
