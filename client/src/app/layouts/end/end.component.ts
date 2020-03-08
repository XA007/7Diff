import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-end",
  templateUrl: "./end.component.html",
  styleUrls: ["./end.component.css"],
})
export class EndComponent implements OnInit {

  @Input() public position: number;
  @Input() public time: string;
  public username: string;
  public gameName: string;
  public stars: boolean[];
  public message: string;
  public tryAgain: boolean;

  public constructor(private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.stars = [false, false, false];
    this.initialize();
    this.showGameState();
  }

  public initialize(): void {
    this.username = this.route.snapshot.params["username"];
    this.gameName = this.route.snapshot.params["gameName"];
  }

  public showGameState(): void {
    this.showStars();
    const three: number = 3;
    const topThree: boolean = this.position <= three && this.position > 0;
    this.message = topThree ? "Congrats, you won 💪" : "Oops, you lost 🙊";
    this.message = this.position === 1 ?  "You are a Champion 💪" : this.message;
    this.tryAgain = !topThree;
  }

  public showStars(): void {
    const firstPositionValue: number = 1;
    const secondPositionValue: number = 2;
    const thirdPositionValue: number = 3;

    if (this.position === firstPositionValue ) {
      this.stars[0] = true;
      this.stars[1] = true;
      this.stars[secondPositionValue] = true;
    } else if (this.position <= secondPositionValue && this.position > 0) {
      this.stars[0] = true;
      this.stars[1] = true;
    } else if (this.position === thirdPositionValue) {
      this.stars[0] = true;
    }
  }
}
