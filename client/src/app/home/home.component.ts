import {Component, HostListener, Inject, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {GameCard} from "../../../../common/Game-Card";
import {GameListService} from "../../services/game-list.service";
import {SocketClientService} from "../../services/socket-client.service";
import {UserDBManagerService} from "../../services/user-dbmanager.service";

const TOAST: typeof Swal = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {

  public username: string;
  public simpleView: GameCard[];
  public freeView: GameCard[];
  public constructor(@Inject(UserDBManagerService) public userDBManager: UserDBManagerService,
                     private route: ActivatedRoute, private gameList: GameListService,
                     private socketService: SocketClientService) { }

  public ngOnInit(): void {

    const username: string = this.route.snapshot.params["username"];
    this.username = username ? username : "Admin";
    this.simpleView = this.gameList.simpleViewGames;
    this.freeView = this.gameList.freeViewGames;
    this.manageNewCard();
  }

  @HostListener("window:unload")
  public removeUser(): void {
    if (this.username !== "Admin") {
      this.userDBManager.removeUser(this.username).catch( (error) => console.error(error));
      const date: Date = new Date();
      const datetext: string = date.toTimeString().split(" ")[0];
      const message: string = datetext + " - " + this.username + " has logged out of the application.";
      this.socketService.send(message);
    }
  }

  public manageNewCard(): void {
    this.socketService.onNewCard().subscribe( (gameName: string) => {
      TOAST.fire({
        type: "info",
        html: "<span style='font-family: Roboto, Arial, sans-serif'>&nbsp;A new game, " + gameName + ", has been added</span>",
      });
    });
  }

}
