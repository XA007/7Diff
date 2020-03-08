import {Component, Input} from "@angular/core";
import {LeaderBoard} from "../../../../../common/LeaderBoard";

@Component({
  selector: "app-leader-board",
  templateUrl: "./leader-board.component.html",
  styleUrls: ["./leader-board.component.css"],
})
export class LeaderBoardComponent {

  @Input() public gameCard: LeaderBoard[];
}
