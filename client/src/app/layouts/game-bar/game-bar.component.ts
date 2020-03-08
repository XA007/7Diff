import {Component, Input} from "@angular/core";

@Component({
  selector: "app-game-bar",
  templateUrl: "./game-bar.component.html",
  styleUrls: ["./game-bar.component.css"],
})
export class GameBarComponent {

  @Input() public username: string;
  @Input() public gameName: string;
  @Input() public chronoValue: string;
  @Input() public score: number;
}
