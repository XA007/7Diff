import {Component, Input} from "@angular/core";

@Component({
  selector: "app-score-section",
  templateUrl: "./score-section.component.html",
  styleUrls: ["./score-section.component.css"],
})
export class ScoreSectionComponent {
  @Input() public userName: string;
  @Input() public score: number;
  @Input() public isRight: boolean;
}
