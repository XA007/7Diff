import {Component, Input} from "@angular/core";
import {OneVsOne} from "../../../../../common/OneVsOne";

@Component({
  selector: "app-game-bar-multi-player",
  templateUrl: "./game-bar-multi-player.component.html",
  styleUrls: ["./game-bar-multi-player.component.css"],
})
export class GameBarMultiPlayerComponent {

  @Input() public game: OneVsOne;
  @Input() public chronoValue: string;

}
