import {Component, Input} from "@angular/core";
import {GameCard} from "../../../../../common/Game-Card";

@Component({
  selector: "app-view-mode",
  templateUrl: "./view-mode.component.html",
  styleUrls: ["./view-mode.component.css"],
})
export class ViewModeComponent {

  @Input() public username: string;
  @Input() public games: GameCard[];
  @Input() public viewName: string;
}
