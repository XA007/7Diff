import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {GameCard} from "../../../../../common/Game-Card";
import {CardService} from "../../../services/card.service";
import {MultiPlayerModeService} from "../../../services/multi-player-mode.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {

  @Input() public username: string;
  @Input() public game: GameCard;
  @Input() public viewName: string;

  public isAdmin: boolean;

  public constructor(private router: Router, private card: CardService,
                     private multiPlayerService: MultiPlayerModeService) {}

  public ngOnInit(): void {
    this.isAdmin = this.router.url === "/admin";
  }

  public manageLeftClick(): void {
    (this.viewName === "SimpleView") ? this.card.deleteCard(this.game.name, true)
        : this.card.deleteCard(this.game.name, false);
  }

  public manageRightClick(): void {
      (this.viewName === "SimpleView") ? this.card.reinitializeLeaderboard(this.game.name, true)
        : this.card.reinitializeLeaderboard(this.game.name, false);
  }

  public createOrJoinMultiPlayerGame(gameName: string, username: string): void {
    (this.viewName === "SimpleView") ?
      this.multiPlayerService.createMultiPlayerGame(gameName, username, this.game.multiPlayerButtonName, true) :
      this.multiPlayerService.createMultiPlayerGame(gameName, username, this.game.multiPlayerButtonName, false);
  }
}
