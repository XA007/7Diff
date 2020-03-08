import {Component, Input} from "@angular/core";

@Component({
  selector: "app-game-loader",
  templateUrl: "./game-loader.component.html",
  styleUrls: ["./game-loader.component.css"],
})
export class GameLoaderComponent {

  @Input() public gameName;

}
