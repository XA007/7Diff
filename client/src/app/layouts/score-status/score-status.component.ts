import {Component, Input, OnInit} from "@angular/core";
import {GameConst} from "../../../services/constants/gameConst";

@Component({
  selector: "app-score-status",
  templateUrl: "./score-status.component.html",
  styleUrls: ["./score-status.component.css"],
})
export class ScoreStatusComponent implements OnInit {

  @Input() public score: number;
  @Input() public isMultiPlayer: boolean;
  @Input() public isPlayerTwo: boolean;
  public circles: number[];

  private static getArrayOf(maxScore: number): Array<number> {
    const defaultValue: number = 0;
    return Array(maxScore)
      .fill(defaultValue)
      .map((x: number, index: number, ) => index);
  }

  public ngOnInit(): void {
    const maxScore: number = this.isMultiPlayer ? GameConst.MAX_SCORE_MULTIPLAYER_MODE : GameConst.MAX_SCORE_SOLO_MODE;
    this.circles = ScoreStatusComponent.getArrayOf(maxScore);
  }

  public getCssClass(): string {
    const blueCircleClass: string = "playerOneWinClick";
    const watermelonCircleClass: string = "playerTwoWinClick";

    return this.isPlayerTwo ? watermelonCircleClass : blueCircleClass;
  }
}
